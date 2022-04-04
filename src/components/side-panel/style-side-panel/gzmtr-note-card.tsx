import React from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { Note } from '../../../constants/constants';
import { RmgBooleanButtonGroup } from '../../common/rmg-button-group';
import { MdDelete } from 'react-icons/md';
import { RmgCard, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

interface GZMTRNoteCardProps {
    note: Note;
    onUpdate?: (value: Note) => void;
    onDelete?: () => void;
}

export default function GZMTRNoteCard(props: GZMTRNoteCardProps) {
    const { note, onUpdate, onDelete } = props;
    const { t } = useTranslation();

    const fields1: RmgFieldsField[] = [
        {
            type: 'textarea',
            label: t('StyleSidePanel.note.zhNote'),
            value: note[0],
            onChange: value => onUpdate?.([value, note[1], note[2], note[3], note[4]]),
        },
        {
            type: 'textarea',
            label: t('StyleSidePanel.note.enNote'),
            value: note[1],
            onChange: value => onUpdate?.([note[0], value, note[2], note[3], note[4]]),
        },
    ];

    const fields2: RmgFieldsField[] = [
        {
            type: 'slider',
            label: t('StyleSidePanel.note.positionX'),
            value: note[2],
            min: 0,
            max: 100,
            onChange: value => onUpdate?.([note[0], note[1], value, note[3], note[4]]),
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.note.positionY'),
            value: note[3],
            min: 0,
            max: 100,
            onChange: value => onUpdate?.([note[0], note[1], note[2], value, note[4]]),
        },
        {
            type: 'custom',
            label: t('StyleSidePanel.note.border'),
            component: (
                <RmgBooleanButtonGroup
                    defaultValue={note[4]}
                    onChange={value => onUpdate?.([note[0], note[1], note[2], note[3], value])}
                />
            ),
        },
    ];

    return (
        <RmgCard direction="column">
            <RmgFields fields={fields1} />
            <HStack spacing={0.5}>
                <RmgFields fields={fields2} />

                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={t('StyleSidePanel.note.remove')}
                    onClick={() => onDelete?.()}
                    icon={<MdDelete />}
                />
            </HStack>
        </RmgCard>
    );
}
