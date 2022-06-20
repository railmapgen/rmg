import React from 'react';
import { CircularProgress, Flex, Modal, ModalOverlay } from '@chakra-ui/react';
import { useRootSelector } from '../../redux';

export default function LoadingModal() {
    const isLoading = useRootSelector(state => state.app.isLoading);

    return (
        <Modal isOpen={isLoading !== undefined} onClose={() => {}}>
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
                <CircularProgress
                    isIndeterminate={isLoading === -1}
                    value={isLoading && isLoading >= 0 ? isLoading : undefined}
                    color="teal"
                />
            </Flex>
        </Modal>
    );
}
