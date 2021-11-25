import React, { SVGProps } from 'react';

interface ExpressTagProps extends SVGProps<SVGGElement> {
    passed?: boolean;
}

export default function ExpressTag(props: ExpressTagProps) {
    const { passed, ...others } = props;

    return (
        <g textAnchor="middle" fill={passed ? '#aaa' : 'var(--rmg-theme-colour)'} {...others}>
            <text className="rmg-name__zh" fontSize={13}>
                快车停靠站
            </text>
            <text dy={10} className="rmg-name__en" fontSize={6.5}>
                Express Station
            </text>
        </g>
    );
}
