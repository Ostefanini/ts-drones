import { useRef } from "react";
import { Group, ActionIcon } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { useWavesurfer } from '@wavesurfer/react';

export const WaveSurferPlayer = ({ url }: { url: string }) => {
    const containerRef = useRef(null);
    const { wavesurfer, isPlaying } = useWavesurfer({
        container: containerRef,
        url,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 30,
        barWidth: 2,
        cursorWidth: 0,
    });

    return (
        <Group gap="xs" style={{ width: '200px' }}>
            <ActionIcon onClick={() => void wavesurfer?.playPause()} variant="subtle" size="sm">
                {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
            </ActionIcon>
            <div ref={containerRef} style={{ flex: 1 }} />
        </Group>
    );
};
