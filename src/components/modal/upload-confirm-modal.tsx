import React, { RefObject } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';
import { MonoColour, RMGParam } from '../../constants/constants';
import RmgLineBadge from '../common/rmg-line-badge';

interface UploadConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef?: RefObject<HTMLButtonElement>;
    uploadedParam?: RMGParam;
    onOpenParam: (param: Record<string, any>) => void;
}

export default function UploadConfirmModal(props: UploadConfirmModalProps) {
    const { isOpen, onClose, cancelRef, uploadedParam, onOpenParam } = props;

    const handleConfirm = () => {
        if (uploadedParam) {
            onOpenParam(uploadedParam);
        }
        onClose();
    };

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Open from configuration file
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {'Are you sure to import '}
                        <RmgLineBadge
                            name={uploadedParam?.line_name?.join(' ') || ''}
                            fg={uploadedParam?.theme?.[3] || MonoColour.white}
                            bg={uploadedParam?.theme?.[2] || '#AAAAAA'}
                        />
                        {` with ${
                            uploadedParam ? Object.keys(uploadedParam.stn_list).length - 2 : 0
                        } stations? Your current unsaved progress will be lost. `}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={handleConfirm} ml={3}>
                            Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
