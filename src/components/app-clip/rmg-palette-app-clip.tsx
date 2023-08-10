import { useEffect, useRef, useState } from 'react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RmgAppClip } from '@railmapgen/rmg-components';
import { CloseButton, SystemStyleObject } from '@chakra-ui/react';
import { Theme } from '../../constants/constants';

const CHANNEL_PREFIX = 'rmg-palette-bridge--';

const styles: SystemStyleObject = {
    position: 'relative',
    h: 460,
    maxH: '70%',

    '& > button': {
        position: 'absolute',
        right: 1,
        top: 1,
    },

    '& iframe': {
        h: '100%',
        w: '100%',
    },
};

interface RmgPaletteAppClip {
    isOpen: boolean;
    onClose: () => void;
    defaultTheme?: Theme;
    onSelect: (theme: Theme) => void;
}

export default function RmgPaletteAppClip(props: RmgPaletteAppClip) {
    const { isOpen, onClose, defaultTheme, onSelect } = props;

    const [appClipId] = useState(crypto.randomUUID());
    const [isLoaded, setIsLoaded] = useState(false);

    const frameUrl =
        '/rmg-palette/#/picker?' +
        new URLSearchParams({
            parentComponent: rmgRuntime.getAppName(),
            parentId: appClipId,
        });

    const channelRef = useRef<BroadcastChannel>();

    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_PREFIX + appClipId);
        channelRef.current = channel;

        channel.onmessage = ev => {
            const { event, data } = ev.data;
            console.log('[rmg] Received event from Palette app clip:', event);
            if (event === 'CLOSE') {
                onClose();
            } else if (event === 'SELECT') {
                onSelect(data);
            } else if (event === 'LOADED') {
                // force trigger default theme update again when app clip first opened
                setIsLoaded(true);
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    useEffect(() => {
        if (defaultTheme) {
            channelRef.current?.postMessage({ event: 'OPEN', data: defaultTheme });
        }
    }, [isLoaded, defaultTheme?.toString()]);

    return (
        <RmgAppClip size="md" isOpen={isOpen} onClose={onClose} sx={styles}>
            <CloseButton onClick={onClose} />
            <iframe src={frameUrl} loading="eager" />
        </RmgAppClip>
    );
}
