type NextStationArrowProps = {
    currentStationX: number;
    currentStationY: number;
    stationGap: number;
    loopClockwise?: boolean;
};

const ARROW_MARKER_WIDTH = 6;

export default function NextStationArrow({
    currentStationX,
    currentStationY,
    stationGap,
    loopClockwise,
}: NextStationArrowProps) {
    const directionFactor = currentStationY > 0 ? (loopClockwise ? -1 : 1) : loopClockwise ? 1 : -1;
    const arrowLength = (stationGap / 3 - ARROW_MARKER_WIDTH) * directionFactor;
    const arrowStartX = currentStationX + arrowLength + ARROW_MARKER_WIDTH * directionFactor;
    const arrowY = (currentStationY - 12) * -directionFactor;

    return (
        <g transform={`scale(1,${-directionFactor})`}>
            <path
                d={`M${arrowStartX},${arrowY} h${arrowLength}`}
                strokeWidth={4}
                stroke="black"
                markerEnd="url(#loop_arrow)"
            />
        </g>
    );
}
