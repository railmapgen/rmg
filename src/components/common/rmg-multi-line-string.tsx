import { Kbd } from '@chakra-ui/react';
import React from 'react';

interface RmgMultiLineStringProps {
    text: string;
    delimiter?: string;
}

export default function RmgMultiLineString(props: RmgMultiLineStringProps) {
    const { text, delimiter } = props;
    return <span>{text.split(delimiter || '\\').map((t, i) => (i ? [<Kbd>⏎</Kbd>, t] : t))}</span>;
}
