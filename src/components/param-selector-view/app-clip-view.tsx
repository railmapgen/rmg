import { RmgPage } from '@railmapgen/rmg-components';
import ParamSelector from './param-selector';
import { useEffect, useRef, useState } from 'react';
import { Events, ParamConfig } from '../../constants/constants';
import { getParam, getParamRegistry } from '../../util/param-manager-utils';
import { Alert, AlertIcon, Button, chakra, Divider, HStack, IconButton, SystemStyleObject } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { MdRefresh, MdSettings } from 'react-icons/md';
import { updateParam } from '../../util/param-updater-utils';

const CHANNEL_PREFIX = 'rmg-bridge--';

const styles: SystemStyleObject = {
    overflow: 'hidden',
    flex: 1,
    px: 2,
    pb: 2,

    '& > div': {
        m: 0,
        h: '100%',

        '& > div': {
            h: '100%',
        },
    },
};

export default function AppClipView() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const parentId = searchParams.get('parentId');
    const parentComponent = searchParams.get('parentComponent');

    const [paramRegistry, setParamRegistry] = useState<ParamConfig[]>([]);
    const [selectedParam, setSelectedParam] = useState<string>();
    const [isError, setIsError] = useState(false);

    const channelRef = useRef<BroadcastChannel>();

    useEffect(() => {
        // channel that talks to parent (RMP import modal, RMG Templates upload modal)
        channelRef.current = new BroadcastChannel(CHANNEL_PREFIX + parentId);
        rmgRuntime.event(Events.APP_CLIP_VIEW_OPENED, { parentComponent });

        // init paramRegistry state update
        setParamRegistry(getParamRegistry());

        return () => {
            channelRef.current?.close();
        };
    }, []);

    const handleImport = () => {
        if (!selectedParam) {
            return;
        }

        const { config, param } = getParam(selectedParam);
        try {
            channelRef.current?.postMessage({
                event: 'IMPORT',
                meta: config,
                data: param ? updateParam(param) : param,
            });
            rmgRuntime.event(Events.APP_CLIP_VIEW_IMPORT, { parentComponent });

            setSelectedParam(undefined);
            setIsError(false);
        } catch (e) {
            setIsError(true);
        }
    };

    const handleClose = () => {
        channelRef.current?.postMessage({
            event: 'CLOSE',
        });
        rmgRuntime.event(Events.APP_CLIP_VIEW_CLOSED, { parentComponent });

        setSelectedParam(undefined);
        setIsError(false);
    };

    const handleManage = () => {
        rmgRuntime.openApp({ appId: 'rmg' });
    };

    return (
        <RmgPage>
            {isError && (
                <Alert status="error" variant="solid" size="xs" pl={3} pr={1} py={1}>
                    <AlertIcon />
                    {t('Project selected is invalid or corrupted.')}
                </Alert>
            )}

            <chakra.div sx={styles}>
                <ParamSelector
                    paramRegistry={paramRegistry}
                    selectedParam={selectedParam}
                    onParamSelect={setSelectedParam}
                />
            </chakra.div>

            <Divider />

            <HStack p={2}>
                <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={t('Manage')}
                    title={t('Manage')}
                    icon={<MdSettings />}
                    onClick={handleManage}
                />
                <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={t('Reload')}
                    title={t('Reload')}
                    icon={<MdRefresh />}
                    onClick={() => setParamRegistry(getParamRegistry())}
                />

                <Button size="sm" onClick={handleClose} ml="auto">
                    {t('Close')}
                </Button>
                <Button size="sm" colorScheme="primary" isDisabled={!selectedParam} onClick={handleImport}>
                    {t('Import')}
                </Button>
            </HStack>
        </RmgPage>
    );
}
