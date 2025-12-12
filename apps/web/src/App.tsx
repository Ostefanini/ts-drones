import { useEffect, useState } from "react";
import { type Asset, type Tag, assetCreateSchema } from "@ts-drones/shared";
import '@mantine/core/styles.css';
import { Center, Title, Input, Button, Card, Image, Group, Text, Badge, SimpleGrid } from '@mantine/core';
import { serialize } from 'object-to-formdata';
import { IconDatabase, IconSearch } from "@tabler/icons-react";

import api from "./services/api";
import { demoPlaystationModels } from "./constants";


function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [{ data: a }, { data: b }] = await Promise.all([
          api.get<Asset[]>("/assets"),
          api.get<Tag[]>("/tags"),
        ]);

        if (!cancelled) {
          setAssets(a);
          setTags(b);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Chargement…</div>;

  return (
    <div
      style={{ marginTop: "75px" }}
    >
      <Center><Title order={1}>TS - Drones</Title></Center>
      <Center><Title order={3}>A minimalist version of the drawn lights app, in typescript</Title></Center>
      <div style={{ marginTop: "24px" }}>
        {assets.length === 0 && (
          <div>
            <Center>No asset yet, let's populate the database !</Center>
            <Center style={{ marginTop: "12px" }}>
              <Button
                onClick={async () => {
                  try {
                    await Promise.all(demoPlaystationModels.map(async (model) => {
                      const filename = `${model.name}.png`;
                      const res = await fetch(`/public/${filename}`);
                      const imgBlob = await res.blob();
                      const sendData = {
                        thumbnail: new File([imgBlob], filename, { type: "image/png" }),
                        description: null,
                        name: model.name,
                        durationSec: model.duration,
                        nbUav: model.nbUav,
                        priceEur: 0,
                        type: "2d",
                        tags: ["playstation"],
                      }
                      const safeData = assetCreateSchema.safeParse(sendData);
                      if (!safeData.success) {
                        console.error(safeData.error);
                        throw new Error("Invalid asset data");
                      }

                      const serializeData = serialize(safeData.data);
                      console.log(serializeData);

                      const { data } = await api.post<Asset>("/assets", serializeData)
                      setAssets((prev) => [...prev, data]);
                    }))
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Populate
                <IconDatabase />
              </Button>
            </Center>
          </div>
        )}
        {assets.length > 0 && (
          <>
            <Center>
              <Input
                placeholder='search for an asset...'
                style={{ width: "60%" }}
              />
              <Button
                style={{ marginLeft: "12px" }}
              ><IconSearch /></Button>
            </Center>
            <SimpleGrid
              cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              spacing="md"
              style={{ margin: "24px" }}
            >
              {assets.map((asset) => (
                <Card>
                  <Card.Section>
                    <Image
                      height={200}
                      width={"auto"}
                      src={`http://localhost:4000/assets/thumbnail/${asset.thumbnail}`} alt={asset.name} />
                  </Card.Section>
                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>{asset.name}</Text>
                    {asset.tags.map((tag) => <Badge color="pink" key={tag}>{tag}</Badge>)}
                  </Group>

                  {asset.description && <Text size="sm" c="dimmed">
                    {asset.description}
                  </Text>}

                  <Button color="blue" fullWidth mt="md" radius="md">
                    Book classic tour now
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          </>
        )
        }
      </div>
    </div >
  );
}

export default App;