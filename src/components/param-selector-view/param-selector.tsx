import React, { useState } from 'react';
import { Box, ButtonGroup, Flex, IconButton, SystemStyleObject, Text } from '@chakra-ui/react';
import { getRelativeTime } from '../../util/utils';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { RmgEnrichedButton } from '@railmapgen/rmg-components';
import { ParamConfig } from '../../constants/constants';
import ParamConfigEditModal from '../modal/param-config-edit-modal';

interface ParamSelectorProps {
    paramRegistry: ParamConfig[];
    downloading?: string;
    selectedParam?: string;
    onParamSelect: (id: string) => void;
    onParamRemove?: (id: string) => void;
    onParamUpdate?: (config: ParamConfig) => void;
}

const styles: SystemStyleObject = {
    flex: '2 1 0%',
    overflow: 'hidden',
    minW: { base: 'unset', md: 240 },
    w: { base: '100%', md: 'unset' },
    mr: { base: 0, md: 2 },
    mb: { base: 2, md: 0 },

    '& > div': {
        flexDirection: 'column',
        h: 200,
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: 'md',
        borderWidth: 2,

        '& >.chakra-button': {
            alignItems: 'center',
        },

        '& .chakra-button__group': {
            '& button:not(:first-of-type)': {
                h: '100%',
            },
        },
    },
};

export default function ParamSelector(props: ParamSelectorProps) {
    const { paramRegistry, downloading, selectedParam, onParamSelect, onParamRemove, onParamUpdate } = props;
    const { t } = useTranslation();

    const [configEditing, setConfigEditing] = useState<ParamConfig>();

    const handleConfigUpdate = (config: ParamConfig) => {
        onParamUpdate?.(config);
        setConfigEditing(undefined);
    };

    return (
        <Box sx={styles}>
            <Flex>
                {downloading && (
                    <RmgEnrichedButton
                        variant="ghost"
                        primaryText={t('Downloading') + '...'}
                        secondaryText={downloading}
                        isDisabled={true}
                    />
                )}
                {paramRegistry
                    .slice()
                    .sort((a, b) => {
                        return (b.lastModified ?? 0) - (a.lastModified ?? 0);
                    })
                    .map(config => (
                        <ButtonGroup
                            key={config.id}
                            size="sm"
                            isAttached
                            colorScheme={selectedParam === config.id ? 'primary' : undefined}
                            variant={selectedParam === config.id ? 'solid' : 'ghost'}
                        >
                            <RmgEnrichedButton
                                primaryText={config.name ?? t('Project') + ' ' + config.id}
                                secondaryText={
                                    t('Last modified') + ': ' + getRelativeTime(config.lastModified).map(t).join(' ')
                                }
                                onClick={() => onParamSelect(config.id)}
                            />
                            {onParamUpdate && (
                                <IconButton
                                    aria-label={t('Edit project info')}
                                    title={t('Edit project info')}
                                    icon={<MdEdit />}
                                    onClick={() => setConfigEditing(config)}
                                />
                            )}
                            {onParamRemove && (
                                <IconButton
                                    aria-label={t('Remove project')}
                                    title={t('Remove project')}
                                    icon={<MdDelete />}
                                    onClick={() => onParamRemove(config.id)}
                                />
                            )}
                        </ButtonGroup>
                    ))}
            </Flex>
            {paramRegistry.length >= 10 && (
                <Text as="em" fontSize="xs">
                    {t('You have reached the maximum number of projects.')}
                </Text>
            )}

            <ParamConfigEditModal
                config={configEditing}
                onClose={() => setConfigEditing(undefined)}
                onUpdate={handleConfigUpdate}
            />
        </Box>
    );
}
