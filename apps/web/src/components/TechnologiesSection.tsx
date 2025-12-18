import { useState } from "react";
import { Group, Image, Tooltip, Title } from '@mantine/core';
import Marquee from "react-fast-marquee";

const technologies = [
    { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/339933" },
    { name: "Mantine", url: "https://cdn.simpleicons.org/mantine/339AF0" },
    { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "Docker", url: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "GitHub", url: "https://cdn.simpleicons.org/github/181717" },
    { name: "GitHub Actions", url: "https://cdn.simpleicons.org/githubactions/2088FF" },
    { name: "Zod", url: "https://cdn.simpleicons.org/zod/3E67B1" },
    { name: "OpenAPI", url: "https://cdn.simpleicons.org/openapiinitiative/6BA539" },
    { name: "React", url: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "Jest", url: "https://cdn.simpleicons.org/jest/C21325" },
    { name: "Express", url: "https://cdn.simpleicons.org/express/000000" },
    { name: "Nginx", url: "https://cdn.simpleicons.org/nginx/009639" },
    { name: "Let's Encrypt", url: "https://cdn.simpleicons.org/letsencrypt/003A70" },
    { name: "Prisma", url: "https://cdn.simpleicons.org/prisma/2D3748" },
];

const TechLogo = ({ label, src }: { label: string, src: string }) => {
    const [opened, setOpened] = useState(false);
    return (
        <Tooltip label={label} opened={opened}>
            <Image
                w={40}
                src={src}
                alt={label}
                onClick={() => setOpened((o) => !o)}
                onMouseEnter={() => typeof window !== 'undefined' && window.matchMedia("(hover: hover)").matches && setOpened(true)}
                onMouseLeave={() => typeof window !== 'undefined' && window.matchMedia("(hover: hover)").matches && setOpened(false)}
            />
        </Tooltip>
    );
};

export const TechnologiesSection = () => {
    return (
        <>
            <Title ta="center" style={{ marginTop: "16px" }} order={4}>Technologies used</Title>
            <Marquee autoFill pauseOnHover style={{ marginBottom: '24px' }}>
                <Group gap="xl" style={{ paddingRight: 'var(--mantine-spacing-xl)' }}>
                    {technologies.map((tech) => (
                        <TechLogo key={tech.name} label={tech.name} src={tech.url} />
                    ))}
                </Group>
            </Marquee>
        </>
    );
};
