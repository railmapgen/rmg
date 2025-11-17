import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { SVGProps } from 'react';
import { PsdLabel } from '../../constants/constants';

interface PsdNumberProps extends SVGProps<SVGGElement> {
    num: string;
    psdLabel: PsdLabel;
    inStrip?: boolean;
}

export default function PsdNumber(props: PsdNumberProps) {
    const { num, psdLabel, inStrip, ...others } = props;

    return (
        <g textAnchor="middle" fill={inStrip ? MonoColour.black : 'var(--rmg-theme-fg)'} {...others}>
            <rect height={40} width={40} rx={4} x={-20} fill={inStrip ? '#fff' : 'var(--rmg-theme-colour)'} />
            <text className="rmg-name__en" fontSize={20} dy={12}>
                {num}
            </text>
            {psdLabel === PsdLabel.platform ? (
                <>
                    <text className="rmg-name__zh" fontSize={11} dy={26}>
                        站台门
                    </text>
                    <text className="rmg-name__en" fontSize={5.5} dy={36}>
                        Platform Door
                    </text>
                </>
            ) : (
                <>
                    <text className="rmg-name__zh" fontSize={12} dy={26}>
                        屏蔽门
                    </text>
                    <text className="rmg-name__en" fontSize={6.5} dy={36}>
                        Screen Door
                    </text>
                </>
            )}
        </g>
    );
}
