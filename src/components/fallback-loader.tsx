import React from 'react';
import { CircularProgress, Flex } from '@chakra-ui/react';

export default function FallbackLoader() {
    return (
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
            <CircularProgress isIndeterminate color="teal" />
        </Flex>
    );
}
