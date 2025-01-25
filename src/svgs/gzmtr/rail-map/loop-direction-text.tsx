import { SVGProps } from 'react';

type LoopDirectionTextProps = {
    clockwise?: boolean;
} & SVGProps<SVGGElement>;

export default function LoopDirectionText({ clockwise, ...others }: LoopDirectionTextProps) {
    return (
        <g {...others}>
            <g textAnchor="middle" transform="translate(0,-4)">
                <text className="rmg-name__zh" fontSize={16}>
                    {clockwise ? '内环' : '外环'}
                </text>
                <text className="rmg-name__en" y={13} fontSize={9}>
                    {clockwise ? 'Inner Circle' : 'Outer Circle'}
                </text>
            </g>
        </g>
    );
}
