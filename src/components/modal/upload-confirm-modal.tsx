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
import { RmgLineBadge } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

interface UploadConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef: RefObject<HTMLButtonElement>;
    uploadedParam?: RMGParam;
    onOpenParam: (param: Record<string, any>) => void;
}

export default function UploadConfirmModal(props: UploadConfirmModalProps) {
    const { isOpen, onClose, cancelRef, uploadedParam, onOpenParam } = props;
    const { t } = useTranslation();

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
                        {t('UploadConfirmModal.title')}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {t('UploadConfirmModal.message1')}
                        <RmgLineBadge
                            name={uploadedParam?.line_name?.join(' ') || ''}
                            fg={uploadedParam?.theme?.[3] || MonoColour.white}
                            bg={uploadedParam?.theme?.[2] || '#AAAAAA'}
                        />
                        {t('UploadConfirmModal.message2') +
                            (uploadedParam ? Object.keys(uploadedParam.stn_list).length - 2 : 0) +
                            t('UploadConfirmModal.message3')}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {t('Cancel')}
                        </Button>
                        <Button colorScheme="teal" onClick={handleConfirm} ml={3}>
                            {t('Confirm')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
