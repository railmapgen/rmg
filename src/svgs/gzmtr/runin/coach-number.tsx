import { SVGProps } from 'react';

type CoachNumberProps = {
    coachNumber: string;
} & SVGProps<SVGSVGElement>;

export default function CoachNumber({ coachNumber, ...others }: CoachNumberProps) {
    return (
        <g {...others}>
            <path d="M-24,-24 a24,24 0 0,0 0,48 h48 a24,24, 0 0,0 0,-48Z" fill="whitesmoke" stroke="lightgrey" />
            <g textAnchor="middle" transform="translate(-15,-7)">
                <text className="rmg-name__zh" fontSize={20}>
                    车厢
                </text>
                <text className="rmg-name__en" fontSize={16} y={20}>
                    Car
                </text>
            </g>
            <g textAnchor="middle" transform="translate(25,0)">
                <text className="rmg-name__zh" fontSize={28}>
                    {coachNumber}
                </text>
            </g>
        </g>
    );
}
