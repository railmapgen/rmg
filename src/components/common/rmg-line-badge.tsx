import React from 'react';
import { ColourHex, MonoColour, Name } from '../../constants/constants';
import { Badge } from '@chakra-ui/react';

interface RmgLineBadgeProps {
    name: Name | string;
    fg: MonoColour;
    bg: ColourHex;
    showShortName?: boolean;
}

export default function RmgLineBadge(props: RmgLineBadgeProps) {
    const { name, fg, bg, showShortName } = props;

    const getShortName = (name: Name | string): string => {
        if (typeof name === 'object') {
            return name[0].match(/^[\d\w]+/)?.[0] || name[0];
        } else {
            return name.match(/^[\d\w]+/)?.[0] || name;
        }
    };

    return (
        <Badge color={fg} bg={bg}>
            {showShortName ? getShortName(name) : typeof name === 'object' ? name[0] : name}
        </Badge>
    );
}
