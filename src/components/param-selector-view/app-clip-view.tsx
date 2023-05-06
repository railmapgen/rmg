import { RmgCard, RmgPage } from '@railmapgen/rmg-components';
import ParamSelector from './param-selector';
import React, { useEffect, useRef, useState } from 'react';
import { Events, LocalStorageKey, ParamConfig } from '../../constants/constants';
import { getParamRegistry } from '../../util/param-manager-utils';
import { Button, HStack, SystemStyleObject } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import rmgRuntime from '@railmapgen/rmg-runtime';

const CHANNEL_PREFIX = 'rmg-bridge--';

const styles: SystemStyleObject = {
    flexDirection: 'column',
    h: '100%',
    p: 2,

    '& > div:first-of-type': {
        mr: 0,
        '& > div': {
            h: '100%',
        },
    },

    '& > div:last-of-type': {
        mt: 2,
        '& button': {
            flex: 1,
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

    const channelRef = useRef<BroadcastChannel>();

    useEffect(() => {
        // channel that talks to parent (RMP import modal, RMG Templates upload modal)
        channelRef.current = new BroadcastChannel(CHANNEL_PREFIX + parentId);
        rmgRuntime.event(Events.APP_CLIP_VIEW_OPENED, { parentComponent });

        // hide window header
        const styleEl = document.createElement('style');
        styleEl.textContent = `.rmg-window__header{display: none;}`;
        document.head.appendChild(styleEl);

        // init paramRegistry state on mount and when external project is downloaded
        setParamRegistry(getParamRegistry());

        return () => {
            channelRef.current?.close();
            document.head.removeChild(styleEl);
        };
    }, []);

    const handleImport = () => {
        const paramStr = window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + selectedParam);
        channelRef.current?.postMessage({
            event: 'IMPORT',
            data: paramStr ? JSON.parse(paramStr) : null,
        });
        rmgRuntime.event(Events.APP_CLIP_VIEW_IMPORT, { parentComponent });
    };

    const handleClose = () => {
        setSelectedParam(undefined);
        channelRef.current?.postMessage({
            event: 'CLOSE',
        });
        rmgRuntime.event(Events.APP_CLIP_VIEW_CLOSED, { parentComponent });
    };

    return (
        <RmgPage>
            <RmgCard sx={styles}>
                <ParamSelector
                    paramRegistry={paramRegistry}
                    selectedParam={selectedParam}
                    onParamSelect={setSelectedParam}
                />

                <HStack>
                    <Button onClick={handleClose}>{t('Close')}</Button>
                    <Button colorScheme="primary" isDisabled={!selectedParam} onClick={handleImport}>
                        {t('Import')}
                    </Button>
                </HStack>
            </RmgCard>
        </RmgPage>
    );
}
