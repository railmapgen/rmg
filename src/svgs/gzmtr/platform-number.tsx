import React, { SVGProps } from 'react';

interface PlatformNumberProps extends SVGProps<SVGGElement> {
    num: string | false;
}

export default function PlatformNumber(props: PlatformNumberProps) {
    const { num, ...others } = props;

    return (
        <g textAnchor="middle" fill="var(--rmg-theme-fg)" {...others}>
            <circle cx={0} cy={0} r={30} fill="var(--rmg-theme-colour)" />
            <text className="rmg-name__en" fontSize={38} dy={-9.5}>
                {num}
            </text>
            <text className="rmg-name__zh" fontSize={13} dy={10}>
                站台
            </text>
            <text className="rmg-name__en" fontSize={9} dy={21}>
                Platform
            </text>
        </g>
    );
}
