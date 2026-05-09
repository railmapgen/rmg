import { SVGProps } from 'react';

interface ServiceSuspendedTagProps extends SVGProps<SVGGElement> {
    passed?: boolean;
    temporary?: boolean;
}

export default function ServiceSuspendedTag(props: ServiceSuspendedTagProps) {
    const { passed, temporary, ...others } = props;

    return (
        <g textAnchor="middle" fill={passed ? '#aaa' : 'red'} {...others}>
            <text className="rmg-name__zh" fontSize={14}>
                停止对外服务
            </text>
            <text dy={14.5} className="rmg-name__en" fontSize={9.5}>
                Service Suspended
            </text>
            {temporary && <rect x={-43} y={-8} width={86} height={28} fill="none" stroke="#aaa" strokeWidth={0.5} />}
        </g>
    );
}
