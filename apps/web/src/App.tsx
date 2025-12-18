import { useEffect, useState } from "react";
import { type Asset, demoPlaystationModels } from "@ts-drones/shared";
import '@mantine/core/styles.css';
import {
  Center, Title, Button,
  Card, Image, Group, Text,
  Badge, SimpleGrid, Divider,
  Combobox, useCombobox, InputBase
} from '@mantine/core';
import { serialize } from 'object-to-formdata';
import {
  IconDatabase, IconDrone, IconHourglassEmpty, IconPlaylistAdd
} from "@tabler/icons-react";
import GithubCorner from 'react-github-corner';
import { emojiBlasts } from "emoji-blast";

import api from "./services/api.js";
import showsConst from "./playstation_shows.json";
import { ComputeMenu } from "./components/ComputeMenu";
import { computeAssetQueryParams } from "./helpers.js";


function App() {
  const [loading, setLoading] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [playlist, setPlaylist] = useState<Asset[]>([]);
  const [showVideo, setShowVideo] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [foundBy, setFoundBy] = useState<string | null>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const exactOptionMatch = users.some((item) => item === foundBy);
  const filteredOptions = exactOptionMatch
    ? users
    : users.filter((item) => item.toLowerCase().includes(foundBy?.toLowerCase().trim()));
  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ data: assetsData }, { data: usersData }] = await Promise.all([
        api.get<Asset[]>("/assets"),
        api.get<string[]>("/users")
      ]);

      if (!cancelled) {
        setAssets(assetsData);
        setUsers(usersData);
        setLoading(false);
      }
    })().catch((e) => {
      if (!cancelled) {
        setLoading(false);
        console.error("Failed to load data", e);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isNew === null) return;
    const emojis = isNew ? "✅🎉🚀" : "❌😢";
    const { cancel } = emojiBlasts({
      interval: 40,
      emojis: [emojis],
    });
    setTimeout(cancel, 1000);
  }, [isNew])


  if (loading) return <div>Loading…</div>;

  return (
    <>
      <GithubCorner
        href="https://github.com/Ostefanini/ts-drones"
      />
      <div
        style={{ marginTop: "30px" }}
      >
        <Title ta='center' order={1}>TS - Drones</Title>
        <Title ta="center" order={3}>A minimalist version of the drawn lights app, in typescript</Title>
        <Text fs="italic" ta="center">And try to discover new combinations...</Text>
        <div style={{ marginTop: "24px" }}>
          {assets.length === 0 && playlist.length === 0 && (
            <div>
              <Center>No asset yet, let's populate the database !</Center>
              <Center style={{ marginTop: "12px" }}>
                <Button
                  onClick={() => {
                    void (async () => {
                      try {
                        await Promise.all(
                          demoPlaystationModels.map(async (model) => {
                            const filename = `${model.name}.png`;
                            const res = await fetch(`/${filename}`);
                            const imgBlob = await res.blob();

                            const sendData = {
                              thumbnail: new File([imgBlob], filename, { type: "image/png" }),
                              ...model,
                            };

                            const serializedData = serialize(sendData);
                            const { data } = await api.post<Asset>("/assets", serializedData);
                            setAssets((prev) => [...prev, data]);
                          })
                        );
                      } catch (e) {
                        console.error(e);
                      }
                    })();
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
                    key={asset.id}
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
      <ComputeMenu
        playlist={playlist}
        onRemoveFromPlaylist={(asset) => {
          setAssets([...assets, asset]);
          setPlaylist(playlist.filter((a) => a.id !== asset.id));
        }}
        onCompute={() => {

          void (async () => {
            try {
              const { data } = await api.get(`/combinations/is-found?${computeAssetQueryParams(playlist)}`);
              if (data.exist && data.foundBy) {
                setFoundBy(data.foundBy);
              }
              setIsNew(!data.exist);

              const combinationName = playlist.map(({ name }) => name).join(",");
              const fullNameNotVr = `source_0_${combinationName}_glossy.mp4`;
              const linkNotVr = showsConst.find(
                (show) => show.isVr === false && show.fullName === fullNameNotVr
              )?.link;
              if (linkNotVr) {
                setShowVideo(linkNotVr);
                setTimeout(() => {
                  const videoFrame = document.getElementById("videoFrame");
                  if (videoFrame) {
                    videoFrame.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }
            } catch (e) {
              console.error("Failed to compute show", e);
            }
          })();
        }}
      />
      {showVideo && (
        <>
          <Divider my="sm" />
          <Title ta='center' order={2}>Render result (With sound 📢)</Title>
          <Center>
            <Group align="flex-end" gap="sm">
              <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                  if (val === '$create') {
                    setFoundBy(foundBy);
                    setUsers((current) => [...current, foundBy]);
                  } else {
                    setFoundBy(val);
                  }

                  combobox.closeDropdown();
                }}
              >
                <Combobox.Target>
                  <InputBase
                    label="Found by"
                    rightSection={<Combobox.Chevron />}
                    value={foundBy || ''}
                    onChange={(event) => {
                      combobox.openDropdown();
                      combobox.updateSelectedOptionIndex();
                      setFoundBy(event.currentTarget.value);
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => {
                      combobox.closeDropdown();
                      setFoundBy(foundBy || '');
                    }}
                    placeholder="Attribute your discovery"
                    rightSectionPointerEvents="none"
                  />
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {options}
                    {!exactOptionMatch && foundBy && foundBy.trim().length > 0 && (
                      <Combobox.Option value="$create">+ Create {foundBy}</Combobox.Option>
                    )}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
              <Button
                disabled={!isNew}
                onClick={() => {
                  void (async () => {
                    try {
                      await api.post(`/combinations/attribute?${computeAssetQueryParams(playlist)}`, {
                        userNickname: foundBy,
                      });
                    } catch (e) {
                      console.error("Failed to save combination", e);
                    }
                  })();
                }}
              >Save</Button>
            </Group>
          </Center>
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