import { SVGProps } from 'react';

export const ARROW_WIDTH = 150;

export default function ArrowGzmtr(props: SVGProps<SVGPathElement>) {
    return <path d={`M60,60 L0,0 L60,-60 H90 L40,-10 H${ARROW_WIDTH} V10 H40 L90,60z`} fill="black" {...props} />;
}
