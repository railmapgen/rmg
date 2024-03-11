import { Flex, Icon, Link, SystemStyleObject, Text } from '@chakra-ui/react';
import { RmgAppClip } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { MdOpenInNew } from 'react-icons/md';

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
    const inst = rmgRuntime.getInstance();

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
            {inst === 'Gitee' ? <DisabledTemplates /> : <iframe src={frameUrl} loading="eager" />}
        </RmgAppClip>
    );
}

const DisabledTemplates = () => (
    <Flex flexDirection="column" p="10">
        <Text>抱歉，由于托管平台的敏感词限制，模板已被禁用 ):</Text>
        <br />
        <Text>欢迎切换到Github或Gitlab镜像以使用完整版本 :)</Text>
        <br style={{ marginBottom: 5 }} />
        <Link color="teal.500" href="https://railmapgen.github.io/?app=rmg" isExternal>
            https://railmapgen.github.io/?app=rmg <Icon as={MdOpenInNew} />
        </Link>
        <br />
        <Link color="teal.500" href="https://railmapgen.gitlab.io/?app=rmg" isExternal>
            https://railmapgen.gitlab.io/?app=rmg <Icon as={MdOpenInNew} />
        </Link>
    </Flex>
);
