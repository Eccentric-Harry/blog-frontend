import { useEffect, useState } from "react";
import { api,  type PostSummary } from "./api";
import "tailwindcss/tailwind.css";

function App() {
  const [health, setHealth] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(h => setHealth(h.status))
      .catch(e => setHealth("unreachable: " + e.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getPosts().then(res => {
      setPosts(res.content || []);
      setLoading(false);
    }).catch(e => { setErr(String(e)); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Blog frontend / API test</h1>
      <p>Backend health: <strong>{health ?? "loading..."}</strong></p>

      <h2>Posts</h2>
      {loading ? <p>Loading...</p> : null}
      {err ? <p style={{color:"red"}}>{err}</p> : null}
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong> <br />
            <small>{p.excerpt ?? ""}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
