import React from 'react';
import { CircularProgress, Flex, useColorModeValue } from '@chakra-ui/react';

export default function FallbackLoader() {
    const loaderColour = useColorModeValue('primary.500', 'primary.300');

    return (
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
            <CircularProgress isIndeterminate color={loaderColour} />
        </Flex>
    );
}
