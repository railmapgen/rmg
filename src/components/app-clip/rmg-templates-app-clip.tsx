import rmgRuntime from '@railmapgen/rmg-runtime';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { RMAppClip } from '@railmapgen/mantine-components';

const CHANNEL_PREFIX = 'rmg-templates-bridge--';

interface RmgTemplatesAppClipProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (param: Record<string, any>, name: string) => void;
}

export default function RmgTemplatesAppClip(props: RmgTemplatesAppClipProps) {
    const { isOpen, onClose, onImport } = props;

    const [appClipId] = useState(nanoid());
    const frameUrl =
        '/rmg-templates/#/import?' +
        new URLSearchParams({
            parentComponent: rmgRuntime.getAppName(),
            parentId: appClipId,
        });

    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_PREFIX + appClipId);
        channel.onmessage = ev => {
            const { event, meta, data } = ev.data;
            console.log('[rmg] Received event from RMG Templates app clip:', event);
            if (event === 'CLOSE') {
                onClose();
            } else if (event === 'IMPORT') {
                onImport(data, meta.name);
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    return (
        <RMAppClip size="xl" opened={isOpen} onClose={onClose} styles={{ content: { height: 800 } }}>
            <iframe src={frameUrl} loading="eager" />
        </RMAppClip>
    );
}
