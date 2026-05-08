import classes from '../side-panel.module.css';
import GZMTRNoteCard from './gzmtr-note-card';
import { addNote, removeNote, updateNote } from '../../../redux/param/param-slice';
import { MdAdd } from 'react-icons/md';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { useTranslation } from 'react-i18next';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Title } from '@mantine/core';
import clsx from 'clsx';

export default function GZMTRNoteSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const notesGZMTR = useRootSelector(state => state.param.notesGZMTR);

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StyleSidePanel.note.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                {notesGZMTR?.map((note, i) => (
                    <GZMTRNoteCard
                        key={i}
                        note={note}
                        onUpdate={value => dispatch(updateNote({ index: i, note: value }))}
                        onDelete={() => dispatch(removeNote(i))}
                    />
                ))}

                <Button variant="default" leftSection={<MdAdd />} onClick={() => dispatch(addNote())}>
                    {t('StyleSidePanel.note.add')}
                </Button>
            </RMSectionBody>
        </RMSection>
    );
}
