import React from 'react';
import { Box, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Note } from '../../../../constants/constants';
import RmgFields, { RmgFieldsField } from '../../../common/rmg-fields';
import { RmgBooleanButtonGroup } from '../../../common/rmg-button-group';
import { MdDelete } from 'react-icons/md';

interface GZMTRNoteCardProps {
    note: Note;
    onUpdate?: (value: Note) => void;
    onDelete?: () => void;
}

export default function GZMTRNoteCard(props: GZMTRNoteCardProps) {
    const { note, onUpdate, onDelete } = props;

    const cardBg = useColorModeValue('gray.50', 'gray.700');

    const fields1: RmgFieldsField[] = [
        {
            type: 'textarea',
            label: 'Chinese note',
            value: note[0],
            onChange: value => onUpdate?.([value, note[1], note[2], note[3], note[4]]),
        },
        {
            type: 'textarea',
            label: 'English note',
            value: note[1],
            onChange: value => onUpdate?.([note[0], value, note[2], note[3], note[4]]),
        },
    ];

    const fields2: RmgFieldsField[] = [
        {
            type: 'slider',
            label: 'Horizontal position',
            value: note[2],
            min: 0,
            max: 100,
            onChange: value => onUpdate?.([note[0], note[1], value, note[3], note[4]]),
        },
        {
            type: 'slider',
            label: 'Vertical position',
            value: note[3],
            min: 0,
            max: 100,
            onChange: value => onUpdate?.([note[0], note[1], note[2], value, note[4]]),
        },
        {
            type: 'custom',
            label: 'Display border',
            component: (
                <RmgBooleanButtonGroup
                    defaultValue={note[4]}
                    onChange={value => onUpdate?.([note[0], note[1], note[2], note[3], value])}
                />
            ),
        },
    ];

    return (
        <Box bg={cardBg} boxShadow="lg" p={1} my={1} w="100%">
            <RmgFields fields={fields1} />
            <HStack spacing={0.5}>
                <RmgFields fields={fields2} />

                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Delete note"
                    onClick={() => onDelete?.()}
                    icon={<MdDelete />}
                />
            </HStack>
        </Box>
    );
}
