import classes from './param-selector-view.module.css';
import { useState } from 'react';
import { getRelativeTime } from '../../util/utils';
import { MdOutlineDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { ParamConfig } from '../../constants/constants';
import ParamConfigEditModal from '../modal/param-config-edit-modal';
import { Button, Card, Group, Stack, StackProps, Text } from '@mantine/core';
import clsx from 'clsx';

interface ParamSelectorProps extends StackProps {
    paramRegistry: ParamConfig[];
    downloading?: string;
    selectedParam?: string;
    onParamSelect: (id: string) => void;
    onParamRemove?: (id: string) => void;
    onParamUpdate?: (config: ParamConfig) => void;
}

export default function ParamSelector({
    paramRegistry,
    downloading,
    selectedParam,
    onParamSelect,
    onParamRemove,
    onParamUpdate,
    className,
    ...others
}: ParamSelectorProps) {
    const { t } = useTranslation();

    const [configEditing, setConfigEditing] = useState<ParamConfig>();

    const handleConfigUpdate = (config: ParamConfig) => {
        onParamUpdate?.(config);
        setConfigEditing(undefined);
    };

    return (
        <Stack className={clsx(classes.selectors, className)} {...others}>
            <Card withBorder>
                {downloading && (
                    <Group grow>
                        <Button
                            variant="subtle"
                            classNames={{
                                inner: classes['selector-main-inner'],
                                label: classes['selector-main-label'],
                            }}
                            disabled
                        >
                            <span>{t('Downloading') + '...'}</span>
                            <span>{downloading}</span>
                        </Button>
                    </Group>
                )}
                {paramRegistry
                    .slice()
                    .sort((a, b) => {
                        return (b.lastModified ?? 0) - (a.lastModified ?? 0);
                    })
                    .map(config => (
                        <Button.Group
                            key={config.id}
                            className={clsx(classes.selector, { selected: selectedParam === config.id })}
                        >
                            <Button
                                variant={selectedParam === config.id ? 'filled' : 'subtle'}
                                classNames={{
                                    inner: classes['selector-main-inner'],
                                    label: classes['selector-main-label'],
                                }}
                                onClick={() => onParamSelect(config.id)}
                            >
                                <span>{config.name ?? t('Project') + ' ' + config.id}</span>
                                <span>
                                    {t('Last modified') +
                                        ': ' +
                                        getRelativeTime(config.lastModified)
                                            .map(v => t(v))
                                            .join(' ')}
                                </span>
                            </Button>
                            {onParamUpdate && (
                                <Button
                                    variant={selectedParam === config.id ? 'filled' : 'subtle'}
                                    aria-label={t('Edit project info')}
                                    title={t('Edit project info')}
                                    onClick={() => setConfigEditing(config)}
                                >
                                    <MdOutlineEdit />
                                </Button>
                            )}
                            {onParamRemove && (
                                <Button
                                    variant={selectedParam === config.id ? 'filled' : 'subtle'}
                                    aria-label={t('Remove project')}
                                    title={t('Remove project')}
                                    onClick={() => onParamRemove(config.id)}
                                >
                                    <MdOutlineDeleteOutline />
                                </Button>
                            )}
                        </Button.Group>
                    ))}
            </Card>
            {paramRegistry.length >= 10 && (
                <Text size="xs" fs="italic">
                    {t('You have reached the maximum number of projects.')}
                </Text>
            )}

            <ParamConfigEditModal
                config={configEditing}
                onClose={() => setConfigEditing(undefined)}
                onUpdate={handleConfigUpdate}
            />
        </Stack>
    );
}
