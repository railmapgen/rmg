import React, { useEffect, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { checkStationCouldBeRemoved, removeStation } from '../../redux/param/remove-station-action';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';
import { useRootDispatch, useRootSelector } from '../../redux';
import { Events, SidePanelMode } from '../../constants/constants';
import { removeInvalidColineOnRemoveStation } from '../../redux/param/coline-action';
import rmgRuntime from '@railmapgen/rmg-runtime';

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
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                {error && (
                    <Alert status="error" variant="solid" size="xs">
                        <AlertIcon />
                        {t('Unable to remove this station.')}
                    </Alert>
                )}
                <Box position="relative">
                    <ModalHeader>{t('Remove station')}</ModalHeader>
                    <ModalCloseButton />
                </Box>

                <ModalBody>{t('Are you sure to remove station? You cannot undo this action.')}</ModalBody>

                <ModalFooter>
                    <Button onClick={onClose}>{t('Cancel')}</Button>
                    <Button colorScheme="primary" onClick={handleConfirm} ml={3}>
                        {t('Confirm')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
