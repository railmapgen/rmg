import { Note } from '../../../constants/constants';
import {
    MdOutlineArrowDropDown,
    MdOutlineArrowDropUp,
    MdOutlineArrowLeft,
    MdOutlineArrowRight,
    MdOutlineDeleteOutline,
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button, Card, Group, Switch, Textarea } from '@mantine/core';
import { RMLabelledSlider } from '@railmapgen/mantine-components';

interface GZMTRNoteCardProps {
    note: Note;
    onUpdate?: (value: Note) => void;
    onDelete?: () => void;
}

export default function GZMTRNoteCard(props: GZMTRNoteCardProps) {
    const { note, onUpdate, onDelete } = props;
    const { t } = useTranslation();

    return (
        <Card withBorder>
            <Textarea
                label={t('StyleSidePanel.note.zhNote')}
                value={note[0]}
                onChange={({ currentTarget: { value } }) => onUpdate?.([value, note[1], note[2], note[3], note[4]])}
            />
            <Textarea
                label={t('StyleSidePanel.note.enNote')}
                value={note[1]}
                onChange={({ currentTarget: { value } }) => onUpdate?.([note[0], value, note[2], note[3], note[4]])}
            />
            <Group gap="xs">
                <RMLabelledSlider
                    fieldLabel={t('StyleSidePanel.note.positionX')}
                    size="sm"
                    defaultValue={note[2]}
                    min={0}
                    max={100}
                    step={0.01}
                    onChangeEnd={value => onUpdate?.([note[0], note[1], value, note[3], note[4]])}
                    withExternalControls
                    leftIcon={<MdOutlineArrowLeft />}
                    leftIconLabel={t('Move left')}
                    rightIcon={<MdOutlineArrowRight />}
                    rightIconLabel={t('Move right')}
                />
                <RMLabelledSlider
                    fieldLabel={t('StyleSidePanel.note.positionY')}
                    size="sm"
                    defaultValue={note[3]}
                    min={0}
                    max={100}
                    step={0.01}
                    onChangeEnd={value => onUpdate?.([note[0], note[1], note[2], value, note[4]])}
                    withExternalControls
                    leftIcon={<MdOutlineArrowDropUp />}
                    leftIconLabel={t('Move up')}
                    rightIcon={<MdOutlineArrowDropDown />}
                    rightIconLabel={t('Move down')}
                />
            </Group>

            <Group gap="xs">
                <Switch
                    label={t('StyleSidePanel.note.border')}
                    checked={note[4]}
                    onChange={({ currentTarget: { checked } }) =>
                        onUpdate?.([note[0], note[1], note[2], note[3], checked])
                    }
                />
                <Button variant="default" leftSection={<MdOutlineDeleteOutline />} onClick={() => onDelete?.()}>
                    {t('StyleSidePanel.note.remove')}
                </Button>
            </Group>
        </Card>
    );
}
