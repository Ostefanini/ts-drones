import { useEffect, useState } from "react";
import { type Asset } from "@ts-drones/shared";
import '@mantine/core/styles.css';
import { Center, NativeSelect, Title, MantineProvider, Input, Button } from '@mantine/core';

import axios from "axios";
import { IconSearch } from "@tabler/icons-react";

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Asset[]>("http://localhost:4000/assets")
      .then(response => setAssets(response.data))
      .finally(() => { setLoading(false) })
      .catch((error: Error) => {
        console.error("Error fetching assets:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement…</div>;

  return (
    <MantineProvider
      defaultColorScheme="dark"
      forceColorScheme="dark"
    >
      <div
        style={{ marginTop: "75px" }}
      >
        <Center><Title order={1}>TS - Drones</Title></Center>
        <Center><Title order={3}>A minimalist version of the drawn lights app, in typescript</Title></Center>
        <div style={{ marginTop: "24px" }}>
          {assets.length === 0 && (
            <Center>No asset yet, create the first one !</Center>
            
          )}
          {assets.length > 0 && (
            <Center>
              <Input
                placeholder='search for an asset...'
                style={{ width: "60%" }}
              />
              <Button
                style={{ marginLeft: "12px" }}
              ><IconSearch /></Button>
            </Center>
          )}
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
