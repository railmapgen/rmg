import React from 'react';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import GZMTRNoteCard from './gzmtr-note-card';
import { addNote, removeNote, updateNote } from '../../../redux/param/action';
import { MdAdd } from 'react-icons/md';
import { useAppSelector } from '../../../redux';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function GZMTRNoteSection() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const notesGZMTR = useAppSelector(state => state.param.notesGZMTR);

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StyleSidePanel.note.title')}
            </Heading>

            <VStack spacing={0.5}>
                {notesGZMTR.map((note, i) => (
                    <GZMTRNoteCard
                        key={i}
                        note={note}
                        onUpdate={value => dispatch(updateNote(i, value))}
                        onDelete={() => dispatch(removeNote(i))}
                    />
                ))}

                <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<MdAdd />}
                    alignSelf="flex-end"
                    onClick={() => dispatch(addNote())}
                >
                    {t('StyleSidePanel.note.add')}
                </Button>
            </VStack>
        </Box>
    );
}
