import classes from './app-clip-view.module.css';
import ParamSelector from './param-selector';
import { useEffect, useRef, useState } from 'react';
import { Events, ParamConfig } from '../../constants/constants';
import { getParam, getParamRegistry } from '../../util/param-manager-utils';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { MdOutlineClose, MdOutlineRefresh, MdOutlineSettings } from 'react-icons/md';
import { updateParam } from '../../util/param-updater-utils';
import { RMPage } from '@railmapgen/mantine-components';
import { ActionIcon, Button, Divider, Group, Notification } from '@mantine/core';

const CHANNEL_PREFIX = 'rmg-bridge--';

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
            console.error('Unable to update param', e);
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
        <RMPage>
            {isError && (
                <Notification icon={<MdOutlineClose />} color="red" withCloseButton={false}>
                    {t('Project selected is invalid or corrupted.')}
                </Notification>
            )}

            <ParamSelector
                paramRegistry={paramRegistry}
                selectedParam={selectedParam}
                onParamSelect={setSelectedParam}
                className={classes.selector}
            />

            <Divider />

            <Group gap="xs" p="xs">
                <ActionIcon variant="default" aria-label={t('Manage')} title={t('Manage')} onClick={handleManage}>
                    <MdOutlineSettings />
                </ActionIcon>
                <ActionIcon
                    variant="default"
                    aria-label={t('Reload')}
                    title={t('Reload')}
                    onClick={() => setParamRegistry(getParamRegistry())}
                >
                    <MdOutlineRefresh />
                </ActionIcon>

                <Button variant="default" onClick={handleClose} ml="auto">
                    {t('Close')}
                </Button>
                <Button disabled={!selectedParam} onClick={handleImport}>
                    {t('Import')}
                </Button>
            </Group>
        </RMPage>
    );
}
