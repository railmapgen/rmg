import React from 'react';
import { CircularProgress, Flex, Modal, ModalOverlay } from '@chakra-ui/react';
import { useRootSelector } from '../../redux';

export default function LoadingModal() {
    const isLoading = useRootSelector(state => state.app.isLoading);

    return (
        <Modal isOpen={isLoading} onClose={() => {}}>
            <ModalOverlay />
            <Flex
                position="absolute"
                top={0}
                left={0}
                h="100%"
                w="100%"
                justifyContent="center"
                alignItems="center"
                zIndex={9999}
            >
                <CircularProgress isIndeterminate color="teal" />
            </Flex>
        </Modal>
    );
}
