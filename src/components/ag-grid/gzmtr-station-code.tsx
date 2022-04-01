import React from 'react';
import { ColourHex } from '../../constants/constants';
import { Flex } from '@chakra-ui/react';

interface GzmtrStationCodeProps {
    lineNumber: string;
    stationNumber: string;
    lineColour: ColourHex;
}

export default function GzmtrStationCode(props: GzmtrStationCodeProps) {
    const { lineNumber, stationNumber, lineColour } = props;

    return (
        <Flex h="28px">
            <Flex
                border="2px solid"
                borderColor={lineColour}
                borderRadius="14px 0 0 14px"
                justifyContent="center"
                alignItems="center"
                padding="4px"
                minW="28px"
            >
                {lineNumber}
            </Flex>
            <Flex
                border="2px solid"
                borderColor={lineColour}
                borderRadius="0 14px 14px 0"
                justifyContent="center"
                alignItems="center"
                padding="4px"
                minW="28px"
                marginLeft="-2px"
            >
                {stationNumber}
            </Flex>
        </Flex>
    );
}
