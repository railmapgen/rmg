import { Flex } from '@chakra-ui/react';
import { ColourHex } from '@railmapgen/rmg-palette-resources';

interface GzmtrStationCodeProps {
    lineNumber: string;
    stationNumber: string;
    lineColour: ColourHex;
}

export default function GzmtrStationCode(props: GzmtrStationCodeProps) {
    const { lineNumber, stationNumber, lineColour } = props;

    const styles = {
        h: '24px',
        position: 'relative',
        color: 'black',

        '&::before': {
            content: "''",
            w: 'calc(100% + 2px)',
            h: '26px',
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            bg: 'white',
            borderRadius: '13px',
        },

        span: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3px',
            minWidth: '24px',
            border: '2px solid',
            borderColor: lineColour,
            zIndex: 1,

            '&:first-of-type': {
                borderRadius: '12px 0 0 12px',
            },

            '&:last-of-type': {
                borderRadius: '0 12px 12px 0',
                marginLeft: '-2px',
            },
        },
    };

    return (
        <Flex sx={styles}>
            <span>{lineNumber}</span>
            <span>{stationNumber}</span>
        </Flex>
    );
}
