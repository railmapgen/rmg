import React, { useState } from 'react';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { InterchangeInfo, MonoColour, Theme } from '../../../constants/constants';
import { MdAdd, MdContentCopy, MdDelete } from 'react-icons/md';
import ColourModal from '../../modal/colour-modal/colour-modal';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../redux';
import ThemeButton from '../theme-button';
import { RmgCard, RmgFields, RmgFieldsField, RmgLabel } from '@railmapgen/rmg-components';

interface InterchangeCardProps {
    interchangeList: InterchangeInfo[];
    onAdd?: (info: InterchangeInfo) => void;
    onDelete?: (index: number) => void;
    onUpdate?: (index: number, info: InterchangeInfo) => void;
}

export default function InterchangeCard(props: InterchangeCardProps) {
    const { interchangeList, onAdd, onDelete, onUpdate } = props;

    const { t } = useTranslation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const theme = useAppSelector(state => state.param.theme);

    const interchangeFields: RmgFieldsField[][] = interchangeList.map((it, i) => [
        {
            type: 'input',
            label: t('StationSidePanel.interchange.zhName'),
            value: it[4],
            minW: '80px',
            onChange: val => onUpdate?.(i, [it[0], it[1], it[2], it[3], val, it[5]]),
        },
        {
            type: 'input',
            label: t('StationSidePanel.interchange.enName'),
            value: it[5],
            minW: '80px',
            onChange: val => onUpdate?.(i, [it[0], it[1], it[2], it[3], it[4], val]),
        },
    ]);

    return (
        <RmgCard direction="column">
            {interchangeList.length === 0 && (
                <HStack spacing={0.5}>
                    <Text as="i" flex={1} align="center" fontSize="md" colorScheme="gray">
                        {t('StationSidePanel.interchange.noInterchanges')}
                    </Text>

                    <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label={t('StationSidePanel.interchange.add')}
                        onClick={() => onAdd?.([theme[0], '', '#aaaaaa', MonoColour.white, '', ''])}
                        icon={<MdAdd />}
                    />
                </HStack>
            )}

            {interchangeList.map((it, i) => (
                <HStack key={i} spacing={0.5}>
                    <RmgLabel label={t('StationSidePanel.interchange.colour')} minW="40px" noLabel={i !== 0}>
                        <ThemeButton
                            theme={[it[0], it[1], it[2], it[3]]}
                            onClick={() => {
                                setIsModalOpen(true);
                                setSelectedIndex(i);
                            }}
                        />
                    </RmgLabel>

                    <RmgFields fields={interchangeFields[i]} noLabel={i !== 0} />

                    {onAdd && i === interchangeFields.length - 1 ? (
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label={t('StationSidePanel.interchange.copy')}
                            onClick={() => onAdd?.(interchangeList.slice(-1)[0])} // duplicate last leg
                            icon={<MdContentCopy />}
                        />
                    ) : (
                        <Box minW={8} />
                    )}

                    {onDelete && (
                        <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label={t('StationSidePanel.interchange.remove')}
                            onClick={() => onDelete?.(i)}
                            icon={<MdDelete />}
                        />
                    )}
                </HStack>
            ))}

            <ColourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultTheme={interchangeList[selectedIndex]?.slice(0, 4) as Theme}
                onUpdate={theme =>
                    onUpdate?.(selectedIndex, [
                        ...theme,
                        interchangeList[selectedIndex][4],
                        interchangeList[selectedIndex][5],
                    ])
                }
            />
        </RmgCard>
    );
}
