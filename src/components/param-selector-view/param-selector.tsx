import React from 'react';
import { ButtonGroup, Flex, IconButton, SystemStyleObject } from '@chakra-ui/react';
import { getRelativeTime } from '../../util/utils';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { RmgEnrichedButton } from '@railmapgen/rmg-components';
import { ParamConfig } from '../../constants/constants';

interface ParamSelectorProps {
    paramRegistry: ParamConfig[];
    selectedParam?: string;
    onParamSelect: (id: string) => void;
    onParamRemove: (id: string) => void;
}

const styles: SystemStyleObject = {
    flex: 1,
    flexDirection: 'column',
    h: 200,
    overflowX: 'hidden',
    overflowY: 'auto',
    borderRadius: 'md',
    borderWidth: 2,

    '& .chakra-button__group': {
        flexShrink: 0,
        h: 10,

        '& button': {
            h: '100%',
        },
    },
};

export default function ParamSelector(props: ParamSelectorProps) {
    const { paramRegistry, selectedParam, onParamSelect, onParamRemove } = props;
    const { t } = useTranslation();

    return (
        <Flex sx={styles}>
            {paramRegistry
                .slice()
                .sort((a, b) => {
                    return (b.lastModified ?? 0) - (a.lastModified ?? 0);
                })
                .map(({ id, lastModified }) => (
                    <ButtonGroup
                        key={id}
                        size="sm"
                        isAttached
                        colorScheme={selectedParam === id ? 'primary' : undefined}
                        variant={selectedParam === id ? 'solid' : 'ghost'}
                    >
                        <RmgEnrichedButton
                            primaryText={t('Project ID') + ': ' + id}
                            secondaryText={t('Last modified') + ': ' + getRelativeTime(lastModified)}
                            onClick={() => onParamSelect(id)}
                        />
                        <IconButton
                            aria-label="Remove this project"
                            icon={<MdDelete />}
                            onClick={() => onParamRemove(id)}
                        />
                    </ButtonGroup>
                ))}
        </Flex>
    );
}
