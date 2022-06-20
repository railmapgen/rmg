import { Button, HStack } from '@chakra-ui/react';
import { RmgSidePanelFooter } from '@railmapgen/rmg-components';
import React, { useRef, useState } from 'react';
import { removeInvalidColineOnRemoveStation } from '../../../redux/param/coline-action';
import { checkStationCouldBeRemoved, removeStation } from '../../../redux/param/remove-station-action';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setGlobalAlert, setSelectedStation, setSidePanelMode } from '../../../redux/app/app-slice';
import RemoveConfirmModal from '../../modal/remove-confirm-modal';
import { setCurrentStation } from '../../../redux/param/action';
import { SidePanelMode } from '../../../constants/constants';
import { useTranslation } from 'react-i18next';

export default function StationSidePanelFooter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);

    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleDelete = () => {
        if (dispatch(checkStationCouldBeRemoved(selectedStation))) {
            // close side panel
            dispatch(setSidePanelMode(SidePanelMode.CLOSE));

            // reset selected station
            dispatch(setSelectedStation('linestart'));

            dispatch(removeInvalidColineOnRemoveStation(selectedStation));
            dispatch(removeStation(selectedStation));
            setIsRemoveModalOpen(false);
        } else {
            dispatch(setGlobalAlert({ status: 'error', message: t('StationSidePanel.footer.errorOnRemove') }));
        }
    };

    return (
        <RmgSidePanelFooter>
            <HStack>
                <Button size="sm" variant="outline" onClick={() => dispatch(setCurrentStation(selectedStation))}>
                    {t('StationSidePanel.footer.current')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsRemoveModalOpen(true)}>
                    {t('StationSidePanel.footer.remove')}
                </Button>
            </HStack>

            <RemoveConfirmModal
                isOpen={isRemoveModalOpen}
                cancelRef={cancelRef}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={handleDelete}
            />
        </RmgSidePanelFooter>
    );
}
