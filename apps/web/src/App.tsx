import { useEffect, useState } from "react";
import { type Asset, type Tag, assetCreateSchema, demoPlaystationModels } from "@ts-drones/shared";
import '@mantine/core/styles.css';
import { Center, Title, Button, Card, Image, Group, Text, Badge, SimpleGrid, Menu, Box, Indicator, Divider } from '@mantine/core';
import { serialize } from 'object-to-formdata';
import { IconCloudComputing, IconDatabase, IconDrone, IconHourglassEmpty, IconPlaylist, IconPlaylistAdd, IconTrash } from "@tabler/icons-react";

import api from "./services/api";
import showsConst from "./playstation_shows.json";


function App() {
  const [loading, setLoading] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [playlist, setPlaylist] = useState<Asset[]>([]);
  const [showVideo, setShowVideo] = useState<string | null>(null);

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
    <>
      <div
        style={{ marginTop: "30px" }}
      >
        <Title ta='center' order={1}>TS - Drones</Title>
        <Title ta="center" order={3}>A minimalist version of the drawn lights app, in typescript</Title>
        <div style={{ marginTop: "24px" }}>
          {assets.length === 0 && playlist.length === 0 && (
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
                          ...model,
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
              <SimpleGrid
                cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                spacing="md"
                style={{ margin: "24px" }}
              >
                {assets.map((asset) => (
                  <Card
                    style={{
                      transition: "transform 0.2s ease-in-out",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                    radius={"md"}
                    withBorder
                  >
                    <Card.Section style={{ position: "relative" }}>
                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await api.delete(`/assets/${asset.id}`);
                            setAssets(assets.filter(a => a.id !== asset.id));
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        color="red"
                        size="compact-xs"
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          zIndex: 10,
                          minWidth: "auto",
                        }}
                      >
                        <IconTrash size={20} />
                      </Button>
                      {asset.video ? (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 9",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <iframe
                            src={asset.video}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              border: "none",
                              transform: "scale(1.2)",
                            }}
                            allow="autoplay"
                          />
                        </div>
                      ) : (
                        <Image
                          height={200}
                          width={"auto"}
                          src={`http://localhost:4000/assets/thumbnail/${asset.thumbnail}`} alt={asset.name} />
                      )}
                    </Card.Section>
                    <Group mt="md" mb="xs">
                      <Title order={3}>{asset.name}</Title>
                      <div style={{ position: "absolute", right: "12px" }}>
                        <Badge color="violet" key={asset.type}>{asset.type}</Badge>
                        {asset.tags.map((tag) => <Badge color="pink" key={tag}>#{tag}</Badge>)}
                      </div>
                    </Group>

                    {asset.description && <Text size="sm" c="dimmed">
                      {asset.description}
                    </Text>}

                    <Group gap="xs" mt="xs">
                      <IconDrone size={16} />
                      <Text size="sm">{asset.nbUav} Drones</Text>
                      <Text size="sm">•</Text>
                      <IconHourglassEmpty size={16} />
                      <Text size="sm">{asset.durationSec} seconds</Text>
                    </Group>

                    <Button
                      onClick={() => {
                        setPlaylist([...playlist, asset]);
                        setAssets(assets.filter(a => a.id !== asset.id));
                      }}
                      fullWidth={false} size={"xs"} color="blue" mt="md" >
                      <IconPlaylistAdd />
                    </Button>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )
          }
        </div>
      </div >
      {playlist.length > 0 && (
        <Box style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
          <Menu
            transitionProps={{ transition: 'pop-top-right' }}
            width={220}
            withinPortal
            radius="md"
          >
            <Menu.Target
            >
              <Indicator inline label={playlist.length} size={24}>
                <Button
                  size="xl"
                  p={20}
                  radius="xl"
                  styles={{
                    root: {
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      '&:hover': {
                        background: "linear-gradient(135deg, #7c8ef5 0%, #8b5bb5 100%)",
                        boxShadow: "0 12px 24px rgba(102, 126, 234, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                      }
                    }
                  }}
                >
                  <IconPlaylist size={20} />
                </Button>
              </Indicator>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: "#663399",
                border: "2px solid #667eea",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {playlist.map((asset) => (
                <Menu.Item
                  key={asset.id}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ borderBottom: '1px solid white' }}
                  rightSection={
                    <IconTrash
                      size={16}
                      color={"red"}
                      stroke={1.5}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssets([...assets, asset]);
                        setPlaylist(playlist.filter(a => a.id !== asset.id));
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  }
                >
                  <Text c="white">
                    {asset.name}
                  </Text>
                </Menu.Item>
              ))}
              <Menu.Item
                key={"compute"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  marginTop: '8px',
                }}
              >
                <Button
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                  fullWidth
                  onClick={() => {
                    const combinationName = playlist.map(({ name }) => name).join(",");;
                    const fullNameNotVr = `source_0_${combinationName}_glossy.mp4`
                    const linkNotVr = showsConst.find((show: any) => show.isVr === false && show.fullName === fullNameNotVr)?.link;
                    if (linkNotVr) {
                      setShowVideo(linkNotVr);
                      setTimeout(() => {
                        const videoFrame = document.getElementById("videoFrame");
                        if (videoFrame) {
                          videoFrame.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 100);
                    }
                  }
                  }
                >
                  <Text c="white">

                    <IconCloudComputing
                      size={16}
                      stroke={1.5}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Delete clicked");
                      }}
                      style={{ cursor: "pointer", marginRight: "8px" }}
                    />Compute
                  </Text>
                </Button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      )}
      {showVideo && (
        <>
          <Divider my="sm" />
          <Title ta='center' order={2}>Render result (With sound 📢)</Title>
          <Center>
            <div style={{
              width: "100%",
              maxWidth: "900px",
              aspectRatio: "16 / 9",
              margin: "20px 0"
            }}>
              <iframe
                src={showVideo}
                allow="autoplay"
                id="videoFrame"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "8px"
                }}
              />
            </div>
          </Center>
        </>
      )}
    </>
  );
}

export default App;