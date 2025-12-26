const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type PostSummary = {
    id: number;
    title: string;
    excerpt: string;
    createdAt?: string;
}

async function request<T>(path: string, options: RequestInit = {}):Promise<T>{
    const response = await fetch(`${API_BASE_URL}${path}`,{
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include",
        ...options
    })
    if(!response.ok){
        throw new Error(`API request failed with status ${response.status}`);
    }
    return (await response.json()) as T;
}

export const api = {
    getHealth :() => 
        request<{status: string}>("/health"),
    getPosts : (page = 0, size = 10) => 
        request<{content: PostSummary[]; totalElements?:number}>(`/api/posts?page=${page}&size=${size}`),
    getPost : (id: number) => 
        request<{id: number; title: string; content: string; createdAt?: string}>
        (`/api/posts/${id}`),
    createPost : (payload: {title: string; content: string}) => 
        request<any>("/api/posts", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    uploadImage : (postId: number, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetch(`{API_BASE_URL}/api/posts/${postId}/images`, {
            method: "POST",
            body: formData,
        })
        .then(async (response) => {
            if(!response.ok){
                throw new Error(await response.text());
            }
            return response.json();
        })
    }
}