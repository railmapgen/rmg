import LoopDirectionText from './loop-direction-text';

type LoopDirectionProps = {
    cxLeft: number;
    cxRight: number;
    yGap: number;
    clockwise?: boolean;
};

const clockwiseRScale = 2 / 3;
const anticlockwiseRScale = 2 - clockwiseRScale;
const clockwiseTheta = (25 * Math.PI) / 180;
const anticlockwiseTheta = Math.asin(Math.sin((35 * Math.PI) / 180) / 2);

export default function LoopDirection({ cxLeft, cxRight, yGap, clockwise }: LoopDirectionProps) {
    const R = yGap / 2;
    const r = R * (clockwise ? clockwiseRScale : anticlockwiseRScale);
    const theta = clockwise ? clockwiseTheta : anticlockwiseTheta;
    const mx = r * Math.cos(theta);
    const clockwiseFactor = clockwise ? 1 : -1;
    const sweepFlag = clockwise ? 1 : 0;
    const my = r * Math.sin(theta) * clockwiseFactor;
    const dy = 2 * my;
    const rotationStyle = { rotate: clockwise ? '-4deg' : '2deg' };
    return (
        <>
            <g transform={`translate(${cxLeft},0)`}>
                <path
                    d={`M${-mx},${my} a${r},${r} 0 0,${sweepFlag} 0,${-dy}`}
                    fill="none"
                    strokeWidth={4}
                    stroke="black"
                    markerEnd="url(#loop_arrow)"
                    style={rotationStyle}
                />
                <LoopDirectionText transform={`translate(${clockwise ? 0 : -2 * R},0)`} clockwise={clockwise} />
            </g>
            <g transform={`translate(${cxRight},0)`}>
                <path
                    d={`M${mx},${-my} a${r},${r} 0 0,${sweepFlag} 0,${dy}`}
                    fill="none"
                    strokeWidth={4}
                    stroke="black"
                    markerEnd="url(#loop_arrow)"
                    style={rotationStyle}
                />
                <LoopDirectionText transform={`translate(${clockwise ? 0 : 2 * R},0)`} clockwise={clockwise} />
            </g>
        </>
    );
}
