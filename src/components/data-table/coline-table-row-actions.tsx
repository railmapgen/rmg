import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import { setGlobalAlert, setSelectedColine, setSidePanelMode } from '../../redux/app/action';
import { useDispatch } from 'react-redux';
import { HStack, IconButton } from '@chakra-ui/react';
import { SidePanelMode } from '../../constants/constants';
import { MdContentCopy, MdDelete, MdEdit } from 'react-icons/md';
import RemoveConfirmModal from '../modal/remove-confirm-modal';
import { addColine, removeColine } from '../../redux/param/coline-action';

interface ColineTableRowActionsProps {
    colineIndex: number;
}

export default function ColineTableRowActions(props: ColineTableRowActionsProps) {
    const { colineIndex } = props;

    const dispatch = useDispatch();
    const curColine = useAppSelector(state => state.param.coline[colineIndex]);

    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const handleAdd = () => {
        try {
            dispatch(addColine(curColine.from, curColine.to, curColine.colors));
        } catch {
            dispatch(setGlobalAlert({ status: 'error', message: 'Unable to add this coline segment.' }));
        }
    };

    const handleEdit = () => {
        dispatch(setSelectedColine(colineIndex));
        dispatch(setSidePanelMode(SidePanelMode.COLINE));
    };

    const handleDelete = () => {
        dispatch(removeColine(colineIndex));
        setIsRemoveModalOpen(false);
    };

    return (
        <HStack>
            <IconButton
                size="xs"
                aria-label="Copy share track"
                onClick={() => handleAdd()} // duplicate last leg
                icon={<MdContentCopy />}
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
