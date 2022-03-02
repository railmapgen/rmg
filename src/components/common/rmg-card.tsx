import React, { ReactNode } from 'react';
import { Flex, FlexProps, useColorModeValue } from '@chakra-ui/react';

interface RmgCardProps extends FlexProps {
    children: ReactNode;
}

export default function RmgCard(props: RmgCardProps) {
    const { children, ...others } = props;

    const cardBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Flex bg={cardBg} boxShadow="lg" p={1} my={1} w="100%" borderRadius={2} {...others}>
            {children}
        </Flex>
    );
}
