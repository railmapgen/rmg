import React from 'react';
import { useRootSelector } from '../../redux';
import { Button, ButtonGroup, Flex, IconButton, SystemStyleObject } from '@chakra-ui/react';
import { getRelativeTime } from '../../util/utils';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

interface ParamSelectorProps {
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

        '& button:first-of-type': {
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',

            '& span:first-of-type': {
                maxW: '100%',
                textOverflow: 'ellipsis',
            },

            '& span:last-of-type': {
                fontWeight: 'normal',
                fontSize: '2xs',
            },
        },
    },
};

export default function ParamSelector(props: ParamSelectorProps) {
    const { selectedParam, onParamSelect, onParamRemove } = props;
    const { t } = useTranslation();

    const { paramRegistry } = useRootSelector(state => state.app);

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
                        <Button onClick={() => onParamSelect(id)}>
                            <span>
                                {t('Project ID')}: {id}
                            </span>
                            <span>
                                {t('Last modified')}: {getRelativeTime(lastModified)}
                            </span>
                        </Button>
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
