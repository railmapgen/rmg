import classes from './param-selector-view.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, LocalStorageKey, ParamConfig } from '../../constants/constants';
import ParamSelector from '../param-selector-view/param-selector';
import { getParamRegistry } from '../../util/param-manager-utils';
import SelectorActions from './selector-actions';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { updateTitle } from '../../util/metadata-utils';
import { RMPage, RMPageBody } from '@railmapgen/mantine-components';
import { Card, Flex, LoadingOverlay, Title } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

interface ParamSelectorViewProps {
    downloading?: string;
}

export default function ParamSelectorView(props: ParamSelectorViewProps) {
    const { downloading } = props;
    const { t } = useTranslation();

    const [searchParams] = useRootSearchParams();
    const urlParamId = searchParams.get('project');

    const [paramRegistry, setParamRegistry] = useState<ParamConfig[]>([]);
    const [selectedParam, setSelectedParam] = useState<string>();

    useEffect(() => {
        updateTitle(t('Manage projects'));
    }, []);

    useEffect(() => {
        // init paramRegistry state on mount and when external project is downloaded
        setParamRegistry(getParamRegistry());
    }, [downloading]);

    const selectorRef = useClickOutside(() => setSelectedParam(undefined));

    const handleUpdate = (config: ParamConfig) => {
        const { id, name, lastModified } = config;
        if (id) {
            rmgRuntime.storage.set(LocalStorageKey.PARAM_CONFIG_BY_ID + id, JSON.stringify({ name, lastModified }));

            setSelectedParam(undefined);
            setParamRegistry(getParamRegistry());

            rmgRuntime.event(Events.UPDATE_PARAM_CONFIG, {});
        }
    };

    const handleDelete = (id: string) => {
        rmgRuntime.storage.remove(LocalStorageKey.PARAM_BY_ID + id);
        rmgRuntime.storage.remove(LocalStorageKey.PARAM_CONFIG_BY_ID + id);

        setSelectedParam(undefined);
        setParamRegistry(getParamRegistry());

        rmgRuntime.event(Events.REMOVE_PARAM, {});
    };

    const handleError = (message: string) => {
        rmgRuntime.sendNotification({
            title: t('Unable to open project'),
            message,
            type: 'error',
            duration: 10_000,
        });
    };

    return (
        <RMPage>
            {urlParamId && <LoadingOverlay visible />}
            <RMPageBody className={classes.container}>
                <Card className={classes.card} withBorder>
                    <Title order={2} size="h2">
                        {t('Saved projects')}
                    </Title>

                    <Flex ref={selectorRef}>
                        <ParamSelector
                            paramRegistry={paramRegistry}
                            downloading={downloading}
                            selectedParam={selectedParam}
                            onParamSelect={setSelectedParam}
                            onParamRemove={handleDelete}
                            onParamUpdate={handleUpdate}
                        />

                        <SelectorActions
                            selectedParam={selectedParam}
                            disableNew={paramRegistry.length >= 10}
                            onError={handleError}
                        />
                    </Flex>
                </Card>
            </RMPageBody>
        </RMPage>
    );
}
