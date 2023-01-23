import { SVGProps } from 'react';

export default function ArrowGzmtr(props: SVGProps<SVGPathElement>) {
    return <path d="M60,60 L0,0 L60,-60 H90 L40,-10 H150 V10 H40 L90,60z" fill="black" {...props} />;
}
