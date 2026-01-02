## Backend Integration Guide

This document explains what the backend needs to implement for the frontend to work correctly.

### Required Spring Boot Dependencies

```xml
<dependency>
    <groupId>io.imagekit</groupId>
    <artifactId>imagekitio</artifactId>
    <version>2.0.0</version>
</dependency>
```

### Application Properties

```properties
# ImageKit Configuration
imagekit.private-key=your_private_key_here
imagekit.public-key=your_public_key_here
imagekit.url-endpoint=https://ik.imagekit.io/your_imagekit_id

# CORS Configuration (adjust for production)
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### ImageKit Authentication Endpoint (Required)

```java
@RestController
@RequestMapping("/api/imagekit")
public class ImageKitController {
    
    @Value("${imagekit.private-key}")
    private String privateKey;
    
    @Value("${imagekit.public-key}")
    private String publicKey;
    
    @Value("${imagekit.url-endpoint}")
    private String urlEndpoint;
    
    @GetMapping("/auth")
    public ResponseEntity<Map<String, Object>> getAuthParameters() {
        try {
            ImageKit imageKit = ImageKit.getInstance();
            Configuration config = new Configuration(publicKey, privateKey, urlEndpoint);
            imageKit.setConfig(config);
            
            Map<String, String> authParams = imageKit.getAuthenticationParameters();
            
            Map<String, Object> response = new HashMap<>();
            response.put("signature", authParams.get("signature"));
            response.put("token", authParams.get("token"));
            response.put("expire", Long.parseLong(authParams.get("expire")));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

### Alternative: Backend Proxy Upload (Fallback)

If you prefer to handle uploads through your backend:

```java
@PostMapping("/api/images/upload")
public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
    try {
        ImageKit imageKit = ImageKit.getInstance();
        Configuration config = new Configuration(publicKey, privateKey, urlEndpoint);
        imageKit.setConfig(config);
        
        FileCreateRequest request = new FileCreateRequest(
            file.getBytes(),
            file.getOriginalFilename()
        );
        
        Result result = imageKit.upload(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("url", result.getUrl());
        response.put("fileId", result.getFileId());
        response.put("name", result.getName());
        response.put("size", result.getSize());
        response.put("fileType", result.getFileType());
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
```

### Post Entity Example

```java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;  // HTML from Tiptap editor
    
    @Column(length = 500)
    private String excerpt;
    
    @Column(unique = true)
    private String slug;
    
    private String author;
    
    @ElementCollection
    @CollectionTable(name = "post_tags")
    private List<String> tags;
    
    private String coverImageUrl;
    
    private Boolean published = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Getters and setters
}
```

### Posts REST Controller

```java
@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostRepository postRepository;
    
    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<Post> posts;
        if (tag != null && !tag.isEmpty()) {
            posts = postRepository.findByTagsContaining(tag, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return postRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody @Valid PostRequest request) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setTags(request.getTags());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setPublished(true);
        
        // Generate slug from title
        post.setSlug(generateSlug(request.getTitle()));
        
        Post saved = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @RequestBody @Valid PostRequest request
    ) {
        return postRepository.findById(id)
            .map(post -> {
                post.setTitle(request.getTitle());
                post.setContent(request.getContent());
                post.setExcerpt(request.getExcerpt());
                post.setTags(request.getTags());
                post.setCoverImageUrl(request.getCoverImageUrl());
                Post updated = postRepository.save(post);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    private String generateSlug(String title) {
        return title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .trim();
    }
}
```

### CORS Configuration

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### Testing the Integration

1. Start your Spring Boot backend
2. Configure `.env` in the frontend with correct API URL
3. Run `npm run dev` in the frontend
4. Test the health check at http://localhost:5173
5. Try creating a post with images

### Common Issues

**CORS errors**: Check your CORS configuration allows the frontend origin.

**ImageKit upload fails**: Verify your private key is correct and the `/api/imagekit/auth` endpoint is working.

**Images not displaying**: Check that ImageKit URL endpoint is configured correctly.

**Posts not saving**: Check that your Post entity matches the expected schema and validation rules.
