import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { checkStationCouldBeRemoved, removeStation } from '../../redux/param/remove-station-action';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';
import { useRootDispatch, useRootSelector } from '../../redux';
import { Events, SidePanelMode } from '../../constants/constants';
import { removeInvalidColineOnRemoveStation } from '../../redux/param/coline-action';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Group, Modal, Notification, Stack, Text } from '@mantine/core';
import { MdOutlineClose } from 'react-icons/md';

interface RemoveConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RemoveConfirmModal(props: RemoveConfirmModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const selectedStation = useRootSelector(state => state.app.selectedStation);

    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setError(false);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        const result = dispatch(checkStationCouldBeRemoved(selectedStation));
        if (result) {
            onClose();

            // close side panel
            dispatch(setSidePanelMode(SidePanelMode.CLOSE));

            // reset selected station
            dispatch(setSelectedStation('linestart'));

            dispatch(removeInvalidColineOnRemoveStation(selectedStation));
            dispatch(removeStation(selectedStation));
        } else {
            setError(true);
        }

        rmgRuntime.event(Events.REMOVE_STATION, { success: result });
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title={t('Remove station')}>
            {error && (
                <Notification icon={<MdOutlineClose />} color="red" withCloseButton={false} mb="xs">
                    {t('Unable to remove this station.')}
                </Notification>
            )}

            <Stack>
                <Text>{t('Are you sure to remove station? You cannot undo this action.')}</Text>
                <Group className={classes.footer}>
                    <Button variant="default" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleConfirm}>{t('Confirm')}</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
