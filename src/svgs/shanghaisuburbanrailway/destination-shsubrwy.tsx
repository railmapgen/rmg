import { memo, useRef, useState, useEffect } from 'react';
import { CanvasType, Name, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';

const CANVAS_TYPE = CanvasType.Destination;

export default function DestinationSHSuburbanRailway() {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, theme } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsSHSuburbanRailway />
            <DestSHSuburbanRailway />
        </SvgWrapper>
    );
}

const DefsSHSuburbanRailway = memo(function DefsSHSuburbanRailway() {
    return (
        <defs>
            {/* An extension of the line/path. Remember to minus the stroke-width.  */}
            <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
                <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
            </marker>
        </defs>
    );
});

const DestSHSuburbanRailway = () => {
    const { routes } = useRootSelector(store => store.helper);
    const { current_stn_idx: current_stn_id, direction, stn_list } = useRootSelector(store => store.param);

    // get valid destination of each branch
    const get_valid_destinations = (routes: string[][], direction: ShortDirection, current_stn_id: string) => [
        ...new Set(
            routes
                .filter(route => route.includes(current_stn_id))
                .map(route => {
                    const res = route.filter(stn_id => !['linestart', 'lineend'].includes(stn_id));
                    return direction === 'l' ? res[0] : res.reverse()[0];
                })
        ),
    ];

    // get destination id(s)
    const dest_ids = get_valid_destinations(routes, direction, current_stn_id);

    // turn destination id into name
    const dest_name = dest_ids
        .map(
            id =>
                [stn_list[id].localisedName.zh, stn_list[id].localisedName.en]
                    .filter(s => s !== undefined)
                    .map(s => s.replace('\\', '')) as Name
        )
        .at(0) ?? ['', ''];

    return <Dest dest_name={dest_name} />;
};

const Dest = (props: { dest_name: Name }) => {
    const { dest_name } = props;
    const { direction, svgWidth, svg_height, theme } = useRootSelector(store => store.param);

    return (
        <g transform={`translate(0,${svg_height - 300})`}>
            <path
                stroke={theme[2]}
                strokeWidth={12}
                d={
                    direction === 'l'
                        ? `M${svgWidth.destination - 24},16 H 36`
                        : `M24,16 H ${svgWidth.destination - 36}`
                }
                transform="translate(0,220)"
                markerEnd="url(#slope)"
            />

            <Terminal dest_name={dest_name} />
        </g>
    );
};

const Terminal = (props: { dest_name: Name }) => {
    const { dest_name } = props;
    const { direction, svgWidth } = useRootSelector(store => store.param);

    const stnNameZhEl = useRef<SVGGElement | null>(null);
    const stnNameEnEl = useRef<SVGGElement | null>(null);
    // the original name position
    const [nameWidth, setNameWidth] = useState(0);
    useEffect(() => {
        if (stnNameZhEl.current && stnNameEnEl.current) {
            const w = Math.max(stnNameZhEl.current.getBBox().width, stnNameEnEl.current.getBBox().width);
            setNameWidth(w);
        }
    }, [...dest_name]);

    const LINE_PADDING = 24;
    const ARROW_PADDING = 20;
    const ARROW_WIDTH = 128;
    const arrowDX = nameWidth + LINE_PADDING + ARROW_PADDING + ARROW_WIDTH;

    return (
        <g transform={`translate(0,145)`}>
            <g transform={`translate(${direction === 'l' ? svgWidth.destination - arrowDX : arrowDX},20)`}>
                <path
                    d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                    fill="black"
                    transform={`rotate(${direction === 'l' ? 0 : 180})scale(0.8)`}
                />
            </g>
            <g
                ref={stnNameZhEl}
                transform={`translate(${direction === 'l' ? svgWidth.destination - LINE_PADDING : LINE_PADDING},25)`}
                textAnchor={direction === 'l' ? 'end' : 'start'}
            >
                <text className="rmg-name__zh rmg-outline" fontSize={70} dy={7}>
                    {'往' + dest_name[0]}
                </text>
            </g>
            <g
                ref={stnNameEnEl}
                transform={`translate(${direction === 'l' ? svgWidth.destination - LINE_PADDING : LINE_PADDING},25)`}
            >
                <text
                    className="rmg-name__en rmg-outline"
                    fontSize={25}
                    dx={direction === 'l' ? -nameWidth : 0}
                    dy={40}
                >
                    {'To ' + dest_name[1]}
                </text>
            </g>
        </g>
    );
};
