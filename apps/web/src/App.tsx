import { useEffect, useState } from "react";
import { type Asset } from "@ts-drones/shared";
import { fetchJson } from "./api/client";

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Asset[]>("http://localhost:4000/assets")
      .then(setAssets)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement…</div>;

  return (
    <div>
      <h1>Library de contenus</h1>
      <ul>
        {assets.map((a) => (
          <li key={a.id}>
            {a.name} · {a.type} · {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
