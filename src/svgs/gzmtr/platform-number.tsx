import { SVGProps } from 'react';

interface PlatformNumberProps extends SVGProps<SVGGElement> {
    num: string | false;
}

export default function PlatformNumber(props: PlatformNumberProps) {
    const { num, ...others } = props;

    return (
        <g textAnchor="middle" fill="var(--rmg-theme-fg)" {...others}>
            <circle cx={0} cy={0} r={33} fill="var(--rmg-theme-colour)" />
            <text className="rmg-name__en" fontSize={41} dy={-9}>
                {num}
            </text>
            <text className="rmg-name__zh" fontSize={14} dy={11}>
                站台
            </text>
            <text className="rmg-name__en" fontSize={10} dy={24}>
                Platform
            </text>
        </g>
    );
}
