import { SVGProps } from 'react';
import { COACH_NUMBER_R } from './runin-utils';

const R = COACH_NUMBER_R;

type CoachNumberProps = {
    coachNumber: string;
} & SVGProps<SVGSVGElement>;

export default function CoachNumber({ coachNumber, ...others }: CoachNumberProps) {
    return (
        <g {...others}>
            <path
                d={`M-${R},-${R} a${R},${R} 0 0,0 0,${2 * R} h${2 * R} a${R},${R}, 0 0,0 0,-${2 * R}Z`}
                fill="whitesmoke"
                stroke="lightgrey"
            />
            <g textAnchor="middle" transform="translate(-20,-10)">
                <text className="rmg-name__zh" fontSize={25}>
                    车厢
                </text>
                <text className="rmg-name__en" fontSize={20} y={28}>
                    Car
                </text>
            </g>
            <g textAnchor="middle" transform="translate(30,0)">
                <text className="rmg-name__zh" fontSize={36}>
                    {coachNumber}
                </text>
            </g>
        </g>
    );
}
