import { Name } from '../../constants/constants';
import { ColourHex, MonoColour } from '@railmapgen/rmg-palette-resources';
import { Badge } from '@mantine/core';

type RMLineBadgeProps = {
    name: Name | string;
    fg: MonoColour;
    bg: ColourHex;
    showShortName?: boolean;
};

export default function RMLineBadge({ name, fg, bg, showShortName }: RMLineBadgeProps) {
    const getShortName = (name: Name | string): string => {
        if (typeof name === 'object') {
            return name[0].match(/^\w+/)?.[0] || name[0];
        } else {
            return name.match(/^\w+/)?.[0] || name;
        }
    };

    return (
        <Badge radius="sm" color={fg} bg={bg}>
            {showShortName ? getShortName(name) : typeof name === 'object' ? name[0] : name}
        </Badge>
    );
}
