import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { useRootDispatch, useRootSelector } from '../../redux';
import { Events, SidePanelMode } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { addStationToExistingBranch } from '../../redux/param/add-station-action';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Group, Modal, NativeSelect, Notification, Stack } from '@mantine/core';
import { MdOutlineClose } from 'react-icons/md';
import useBranchOptions from '../../hooks/use-branch-options';
import { RMLabelledSegmentedControl } from '@railmapgen/mantine-components';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const [where, setWhere] = useState(selectedBranch);
    const [preposition, setPreposition] = useState<'before' | 'after'>('before');
    const [pivot, setPivot] = useState('');
    const [error, setError] = useState(false);

    const branchOptions = useBranchOptions();

    useEffect(() => {
        setWhere(selectedBranch);
    }, [selectedBranch]);

    useEffect(() => {
        if (!isOpen) {
            setError(false);
        }
    }, [isOpen]);

    const selectableStations = branches[Number(where)]?.slice(1, -1) ?? [];
    const stationOptions = [
        { value: '', label: t('AddStationModal.pleaseSelect'), disabled: true },
        ...selectableStations.map(id => ({
            value: id,
            label: stationList[id]?.localisedName.zh + '/' + stationList[id]?.localisedName.en,
        })),
    ];

    const handleSelectWhere = (value: number) => {
        setWhere(value);
        setPivot('');
    };

    const handleSubmit = () => {
        const result = dispatch(addStationToExistingBranch(where, preposition, pivot));
        if (result) {
            onClose();

            dispatch(setSelectedStation(result));
            dispatch(setSidePanelMode(SidePanelMode.STATION));
        } else {
            console.log('false here');
            setError(true);
        }
        rmgRuntime.event(Events.ADD_STATION, { style, branchIndex: where, success: result });
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title={t('AddStationModal.title')}>
            {error && (
                <Notification icon={<MdOutlineClose />} color="red" withCloseButton={false} mb="xs">
                    {t('AddStationModal.error')}
                </Notification>
            )}

            <Stack>
                <Group className={classes.body}>
                    <NativeSelect
                        label={t('AddStationModal.where')}
                        value={where}
                        data={branchOptions}
                        onChange={({ currentTarget: { value } }) => handleSelectWhere(Number(value))}
                        className={classes['mw-full']}
                    />
                    <RMLabelledSegmentedControl
                        label={t('AddStationModal.preposition')}
                        value={preposition}
                        data={[
                            { value: 'before', label: t('AddStationModal.before') },
                            { value: 'after', label: t('AddStationModal.after') },
                        ]}
                        onChange={value => setPreposition(value as 'before' | 'after')}
                    />
                    <NativeSelect
                        label={t('AddStationModal.pivot')}
                        value={pivot}
                        data={stationOptions}
                        onChange={({ currentTarget: { value } }) => setPivot(value)}
                    />
                </Group>

                <Group className={classes.footer}>
                    <Button onClick={handleSubmit} disabled={!pivot}>
                        {t('Confirm')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
