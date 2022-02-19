import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HStack, IconButton } from '@chakra-ui/react';
import { useAppSelector } from '../../redux';
import { setCurrentStation } from '../../redux/param/action';
import { setGlobalAlert, setSelectedStation, setSidePanelMode } from '../../redux/app/action';
import { SidePanelMode } from '../../constants/constants';
import { MdDelete, MdEdit, MdLocationPin } from 'react-icons/md';
import RemoveConfirmModal from '../modal/remove-confirm-modal';
import { checkStationCouldBeRemoved, removeStation } from '../../redux/param/remove-station-action';
import { removeInvalidColineOnRemoveStation } from '../../redux/param/coline-action';

interface TableRowActionsProps {
    stationId: string;
}

export default function TableRowActions(props: TableRowActionsProps) {
    const { stationId } = props;

    const dispatch = useDispatch();
    const { stn_list: stnList } = useAppSelector(state => state.param);

    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const handleEdit = () => {
        dispatch(setSelectedStation(stationId));
        dispatch(setSidePanelMode(SidePanelMode.STATION));
    };

    const handleDelete = () => {
        if (checkStationCouldBeRemoved(stationId, stnList)) {
            dispatch(removeInvalidColineOnRemoveStation(stationId));
            dispatch(removeStation(stationId));
            setIsRemoveModalOpen(false);
        } else {
            dispatch(setGlobalAlert({ status: 'error', message: 'Unable to remove this station.' }));
        }
    };

    return (
        <HStack>
            <IconButton
                size="xs"
                aria-label="Set as current station"
                onClick={() => dispatch(setCurrentStation(stationId))}
                icon={<MdLocationPin />}
            />
            <IconButton size="xs" aria-label="Edit this station" onClick={handleEdit} icon={<MdEdit />} />
            <IconButton
                size="xs"
                aria-label="Delete this station"
                onClick={() => setIsRemoveModalOpen(true)}
                icon={<MdDelete />}
            />

            <RemoveConfirmModal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={handleDelete}
            />
        </HStack>
    );
}
