import React, { SVGProps } from 'react';

export default function InterchangeBox(props: SVGProps<SVGRectElement>) {
    return <rect x={-22.5} height={24} width={45} rx={4.5} {...props} />;
}
