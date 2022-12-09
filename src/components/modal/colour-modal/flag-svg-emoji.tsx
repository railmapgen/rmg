import React, { useEffect, useState } from 'react';
import { Image } from '@chakra-ui/react';

interface FlagSvgEmojiProps {
    countryCode: string;
    svgFilename?: string;
}

export default function FlagSvgEmoji(props: FlagSvgEmojiProps) {
    const { countryCode, svgFilename } = props;

    const [src, setSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (svgFilename) {
            import(`../../../../node_modules/@railmapgen/rmg-palette-resources/flags/${svgFilename.slice(0, -4)}.svg`)
                .then(module => module.default)
                .then(setSrc)
                .catch(err => console.error(`Failed to find SVG file ${svgFilename} as ${err?.message}`));
        }
    }, [svgFilename]);

    return src ? <Image src={src} alt={`Flag of ${countryCode}`} h={17} mr={1} /> : <></>;
}
