import { useEffect, useState } from 'react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RmgAppClip } from '@railmapgen/rmg-components';
import { SystemStyleObject } from '@chakra-ui/react';
import { nanoid } from 'nanoid';

const CHANNEL_PREFIX = 'rmg-templates-bridge--';

const styles: SystemStyleObject = {
    h: 800,
    maxH: '70%',

    '& iframe': {
        h: '100%',
        w: '100%',
    },
};

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
        <RmgAppClip size="xl" isOpen={isOpen} onClose={onClose} sx={styles}>
            <iframe src={frameUrl} loading="eager" />
        </RmgAppClip>
    );
}
