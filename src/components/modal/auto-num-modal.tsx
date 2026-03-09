import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { Events } from '../../constants/constants';
import { autoNumbering } from '../../redux/param/action';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Group, Modal, NativeSelect, NumberInput, Stack } from '@mantine/core';
import useBranchOptions from '../../hooks/use-branch-options';

interface AutoNumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AutoNumModal(props: AutoNumModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);

    const [where, setWhere] = useState(selectedBranch);
    const [from, setFrom] = useState('1');
    const [maxLength, setMaxLength] = useState('2');
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');

    const branchOptions = useBranchOptions();

    useEffect(() => {
        setWhere(selectedBranch);
    }, [selectedBranch]);

    const handleSubmit = () => {
        dispatch(autoNumbering(where, Number(from), Number(maxLength), sort));
        onClose();
        rmgRuntime.event(Events.AUTO_NUMBERING, {});
    };

    const isSubmitDisabled = !from || !maxLength || isNaN(Number(from)) || isNaN(Number(maxLength));

    return (
        <Modal opened={isOpen} onClose={onClose} size="md" title={t('AutoNumModal.title')}>
            <Stack>
                <Group className={classes.body}>
                    <NativeSelect
                        label={t('AutoNumModal.where')}
                        value={where}
                        data={branchOptions}
                        onChange={({ currentTarget: { value } }) => setWhere(Number(value))}
                    />
                    <NumberInput
                        label={t('AutoNumModal.from')}
                        value={from}
                        onChange={value => setFrom(String(value))}
                    />
                    <NumberInput
                        label={t('AutoNumModal.maxLength')}
                        value={maxLength}
                        onChange={value => setMaxLength(String(value))}
                    />
                    <NativeSelect
                        label={t('AutoNumModal.sort')}
                        value={sort}
                        data={[
                            { value: 'asc', label: t('AutoNumModal.asc') },
                            { value: 'desc', label: t('AutoNumModal.desc') },
                        ]}
                        onChange={({ currentTarget: { value } }) => setSort(value as 'asc' | 'desc')}
                    />
                </Group>

                <Group className={classes.footer}>
                    <Button disabled={isSubmitDisabled} onClick={handleSubmit}>
                        {t('Confirm')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
