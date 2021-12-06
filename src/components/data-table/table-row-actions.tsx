import React from 'react';
import { setCurrentStation } from '../../redux/param/action';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/action';
import { useDispatch } from 'react-redux';
import { HStack, IconButton } from '@chakra-ui/react';
import { SidePanelMode } from '../../constants/constants';
import { MdDelete, MdEdit, MdLocationPin } from 'react-icons/md';

interface TableRowActionsProps {
    stationId: string;
}

export default function TableRowActions(props: TableRowActionsProps) {
    const { stationId } = props;

    const dispatch = useDispatch();

    const handleEdit = () => {
        dispatch(setSelectedStation(stationId));
        dispatch(setSidePanelMode(SidePanelMode.STATION));
    };

    const handleDelete = () => {};

    return (
        <HStack>
            <IconButton
                size="xs"
                aria-label="Set as current station"
                onClick={() => dispatch(setCurrentStation(stationId))}
                icon={<MdLocationPin />}
            />
            <IconButton
                size="xs"
                aria-label="Edit this station"
                onClick={handleEdit}
                icon={<MdEdit />}
            />
            <IconButton size="xs" aria-label="Delete this station" onClick={handleDelete} icon={<MdDelete />} />
        </HStack>
    );
}
