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

interface RemoveConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef?: RefObject<HTMLButtonElement>;
    onConfirm: () => void;
}

export default function RemoveConfirmModal(props: RemoveConfirmModalProps) {
    const { isOpen, onClose, cancelRef, onConfirm } = props;

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Remove station
                    </AlertDialogHeader>

                    <AlertDialogBody>Are you sure to remove station? You cannot undo this action.</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="teal" onClick={onConfirm} ml={3}>
                            Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
