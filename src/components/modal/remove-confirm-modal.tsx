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
import { useTranslation } from 'react-i18next';

interface RemoveConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef?: RefObject<HTMLButtonElement>;
    onConfirm: () => void;
}

export default function RemoveConfirmModal(props: RemoveConfirmModalProps) {
    const { isOpen, onClose, cancelRef, onConfirm } = props;
    const { t } = useTranslation();

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {t('RemoveConfirmModal.title')}
                    </AlertDialogHeader>

                    <AlertDialogBody>Are you sure to remove station? You cannot undo this action.</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {t('RemoveConfirmModal.cancel')}
                        </Button>
                        <Button colorScheme="teal" onClick={onConfirm} ml={3}>
                            {t('RemoveConfirmModal.confirm')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
