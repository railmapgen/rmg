import { SVGProps } from 'react';

interface UnderConstructionTagProps extends SVGProps<SVGGElement> {
    passed?: boolean;
    temporary?: boolean;
}

export default function UnderConstructionTag(props: UnderConstructionTagProps) {
    const { passed, temporary, ...others } = props;

    return (
        <g textAnchor="middle" fill={passed ? '#aaa' : 'black'} {...others}>
            <text className="rmg-name__zh" fontSize={9.5}>
                （未开通）
            </text>
            <text dy={9} className="rmg-name__en" fontSize={3.8}>
                (Under Construction)
            </text>
            {temporary && <rect x={-19} y={-6} width={38} height={18} fill="none" stroke="#aaa" strokeWidth={0.5} />}
        </g>
    );
}
