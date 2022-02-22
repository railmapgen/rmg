import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import GZMTRNoteCard from './gzmtr-note-card';
import { addNote, removeNote, updateNote } from '../../../../redux/param/action';
import { MdAdd } from 'react-icons/md';
import { useAppSelector } from '../../../../redux';
import { useDispatch } from 'react-redux';

export default function GZMTRNoteSection() {
    const dispatch = useDispatch();

    const notesGZMTR = useAppSelector(state => state.param.notesGZMTR);

    return (
        <Flex direction="column">
            <Heading as="h6" size="xs">
                Notes
            </Heading>

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
                Add note
            </Button>
        </Flex>
    );
}
