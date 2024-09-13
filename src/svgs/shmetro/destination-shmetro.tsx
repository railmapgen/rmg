/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { forwardRef, Fragment, memo, Ref, useEffect, useMemo, useRef, useState } from 'react';
import { useRootSelector } from '../../redux';
import { isColineBranch } from '../../redux/param/coline-action';
import { CanvasType, ColineInfo, Name, ShortDirection } from '../../constants/constants';
import { get_pivot_stations } from '../methods/shmetro-loop';
import SvgWrapper from '../svg-wrapper';
import { ColourHex, MonoColour } from '@railmapgen/rmg-palette-resources';

const CANVAS_TYPE = CanvasType.Destination;

export default function DestinationSHMetro() {
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
            <DefsSHMetro />
            <DestSHMetro />
        </SvgWrapper>
    );
}

const DefsSHMetro = memo(function DefsSHMetro() {
    return (
        <defs>
            {/* An extension of the line/path. Remember to minus the stroke-width.  */}
            <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
                <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
            </marker>
        </defs>
    );
});

const DestSHMetro = () => {
    const { routes, branches } = useRootSelector(store => store.helper);
    const {
        line_name,
        theme,
        current_stn_idx: current_stn_id,
        direction,
        stn_list,
        info_panel_type,
        loop,
        coline,
    } = useRootSelector(store => store.param);

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
    // get the name from the destination id(s)
    const get_dest_names = (dest_ids: string[], one_line: boolean) =>
        !one_line
            ? dest_ids.map(id => stn_list[id].name.map(s => s.replace('\\', '')) as Name)
            : [
                  // only one line in `sh` type
                  [
                      dest_ids.map(id => stn_list[id].name[0]).join('，'),
                      dest_ids.map(id => stn_list[id].name[1]).join(', '),
                  ].map(s => s.replace('\\', '')) as Name,
              ];

    // get destination id(s)
    const valid_dest_ids = !loop
        ? get_valid_destinations(routes, direction, current_stn_id)
        : get_pivot_stations(branches, direction, stn_list, current_stn_id);
    // get coline destination id(s)
    // note that for loop, coline branches' destination id(s) are needed
    const coline_dest_ids = (!loop ? valid_dest_ids : get_valid_destinations(routes, direction, current_stn_id)).filter(
        valid_dest_id =>
            branches
                .slice(1)
                .filter(branch => isColineBranch(branch, stn_list))
                .some(branch => branch.includes(valid_dest_id))
    );
    // filter out coline destination id(s)
    const regular_dest_ids = valid_dest_ids.filter(valid_dest_id => !coline_dest_ids.includes(valid_dest_id));

    // destination names of loop line, `sh2020` type will always be two lines
    const dest_names = get_dest_names(regular_dest_ids, !loop && !(info_panel_type === 'sh2020'));
    console.log(dest_names);
    const coline_dest_names = get_dest_names(coline_dest_ids, true);

    // this will give the space for at most two lines of dest_names
    const coline_dy = 250;
    // get coline info from coline_dest_ids
    const colines = Object.fromEntries(
        coline_dest_ids
            .map(coline_dest_id => [
                coline_dest_id,
                Object.values(coline)
                    .filter(co => co.from === coline_dest_id || co.to === coline_dest_id)
                    .at(0),
            ])
            .filter(([, val]) => val)
    ) as {
        [k: string]: ColineInfo;
    };
    return (
        <>
            <Dest
                dest_names={dest_names}
                line_name={line_name}
                line_color={[theme[2], theme[3]]}
                coline={!!coline_dest_ids.length}
                upper={!!coline_dest_ids.length}
            />
            {coline_dest_ids.length &&
                // multiple coline dest is not supported yet
                coline_dest_ids.map(coline_dest_id => (
                    <g key={`coline_${coline_dest_id}`} transform={`translate(0,${-coline_dy})`}>
                        <Dest
                            dest_names={[coline_dest_names.at(0)!]}
                            line_name={colines[coline_dest_id]?.colors.at(0)!.slice(4) as Name}
                            line_color={[
                                colines[coline_dest_id]?.colors.at(0)![2],
                                colines[coline_dest_id]?.colors.at(0)![3],
                            ]}
                            coline
                            upper={false}
                        />
                    </g>
                ))}
        </>
    );
};

const Dest = (props: {
    dest_names: Name[];
    line_name: Name;
    line_color: [ColourHex, MonoColour]; // override coline color
    coline: boolean; // hide the marker if it is a coline
    upper: boolean; // coline needs the line in the upper position
}) => {
    const { dest_names, line_name, line_color, coline, upper } = props;
    const {
        current_stn_idx: current_stn_id,
        direction,
        platform_num,
        svgWidth,
        svg_height,
    } = useRootSelector(store => store.param);

    const terminalEl = useRef<SVGGElement | null>(null);
    const [terminalBBox, setTerminalBBox] = useState({ width: 0 } as SVGRect);
    useEffect(() => {
        if (terminalEl.current) setTerminalBBox(terminalEl.current.getBBox());
    }, [JSON.stringify(dest_names), JSON.stringify(current_stn_id)]);

    const [middle, MARGIN, PADDING, LINEBOX_WIDTH, PLATFORM_WIDTH] = [svgWidth.destination / 2, 10, 36, 264, 325];
    // Alignment Priority:
    // 1. Centre of canvas
    // 2. Centre of remaining
    const platformX =
        middle - MARGIN - PADDING - terminalBBox.width >= PLATFORM_WIDTH / 2 &&
        middle - MARGIN - PADDING - LINEBOX_WIDTH >= PLATFORM_WIDTH / 2
            ? middle
            : direction === 'l'
              ? (svgWidth.destination + terminalBBox.width - LINEBOX_WIDTH) / 2
              : (svgWidth.destination - terminalBBox.width + LINEBOX_WIDTH) / 2;

    // the platform screen doors flash light
    // #20
    // $('g#station_info_shmetro > rect').attr({ transform: `translate(${this._svgDestWidth / 2},${250 + dh})` })

    return (
        <g transform={`translate(0,${svg_height - 300})`}>
            <path
                stroke={line_color[0]}
                strokeWidth={12}
                d={
                    direction === 'l'
                        ? `M${svgWidth.destination - 24},16 H 36`
                        : `M24,16 H ${svgWidth.destination - 36}`
                }
                transform={`translate(0,${!upper ? 220 : -20})`}
                markerEnd={!coline ? 'url(#slope)' : undefined}
            />

            <Terminal ref={terminalEl} dest_names={dest_names} />
            {platform_num !== '' && (
                <g transform={`translate(${platformX},0)`}>
                    <PlatformNum />
                </g>
            )}

            {line_name[0].match(/^[\w\d]+(号)?线/) ? (
                <LineNameBoxNumber line_name={line_name} line_color={line_color} />
            ) : (
                <LineNameBoxText line_name={line_name} line_color={line_color} />
            )}
        </g>
    );
};

const Terminal = forwardRef(function Terminal(props: { dest_names: Name[] }, ref: Ref<SVGGElement>) {
    const { dest_names } = props;
    const { direction, svgWidth } = useRootSelector(store => store.param);

    return (
        <g ref={ref} transform={`translate(${direction === 'l' ? 36 : svgWidth.destination - 36},145)`}>
            {/* this is not a generalized implementation, only dest length of 1 and 2 are supported */}
            <g transform={`translate(0,${dest_names.length === 2 ? -20 : 20})`}>
                <path
                    d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                    fill="black"
                    transform={`rotate(${direction === 'l' ? 0 : 180})scale(0.8)`}
                />
            </g>
            <g
                textAnchor={direction === 'l' ? 'start' : 'end'}
                transform={`translate(${direction === 'l' ? 128 + 20 : -128 - 20},25)`}
            >
                {dest_names.map((name, i) => (
                    <Fragment key={i}>
                        <text className="rmg-name__zh rmg-outline" fontSize={70} dy={i * -100 + 7} key={`zh${i}`}>
                            {'往' + name[0]}
                        </text>
                        <text className="rmg-name__en rmg-outline" fontSize={25} dy={i * -100 + 40} key={`en${i}`}>
                            {'To ' + name[1]}
                        </text>
                    </Fragment>
                ))}
            </g>
        </g>
    );
});

const PlatformNum = () => {
    const { platform_num } = useRootSelector(store => store.param);

    // Total width: 325
    return useMemo(
        () => (
            <g transform={`translate(${-325 / 2 + 60},150)`}>
                <circle r={60} fill="none" stroke="black" strokeWidth={2} />
                <text
                    className="rmg-name__en rmg-outline"
                    dominantBaseline="central"
                    fontSize={120}
                    textAnchor="middle"
                >
                    {platform_num}
                </text>
                <text className="rmg-name__zh rmg-outline" fontSize={100} dominantBaseline="central" x={65}>
                    站台
                </text>
            </g>
        ),
        [platform_num]
    );
};

const LineNameBoxText = (props: { line_name: Name; line_color: [ColourHex, MonoColour] }) => {
    const { line_name, line_color } = props;
    const { direction, svgWidth } = useRootSelector(store => store.param);

    const boxX = direction === 'l' ? svgWidth.destination - 42 : 42;

    // get the exact station name width so that the
    // line color rectangle can be the right width.
    const stnNameEl = useRef<SVGGElement | null>(null);
    // the original name position
    const [bBox, setBBox] = useState({ width: 0 } as DOMRect);
    useEffect(() => {
        if (stnNameEl.current) setBBox(stnNameEl.current.getBBox());
    }, [...line_name]);

    const rectDx = (direction === 'l' ? -bBox.width : 0) - 6;
    const stnNameEnDx = ((direction === 'l' ? -1 : 1) * bBox.width) / 2;

    return useMemo(
        () => (
            <g transform={`translate(${boxX},92)`}>
                <rect fill={line_color[0]} x={rectDx} width={bBox.width + 10} height={120} />
                <g textAnchor={direction === 'r' ? 'start' : 'end'} transform="translate(0,68)" fill={line_color[1]}>
                    <g ref={stnNameEl}>
                        <text className="rmg-name__zh rmg-outline" fontSize={68}>
                            {line_name[0]}
                        </text>
                    </g>
                    <text
                        className="rmg-name__en rmg-outline"
                        fontSize={30}
                        textAnchor="middle"
                        x={stnNameEnDx}
                        dy={42}
                    >
                        {line_name[1]}
                    </text>
                </g>
            </g>
        ),
        [bBox, ...line_name, ...line_color, direction, svgWidth.destination]
    );
};

const LineNameBoxNumber = (props: { line_name: Name; line_color: [ColourHex, MonoColour] }) => {
    const { line_name, line_color } = props;
    const { direction, svgWidth } = useRootSelector(store => store.param);

    const [lineNumber, lineNameRes] = line_name[0].match(/^[\w\d]+|.+/g) as string[];

    // Number width: 108
    // Text width: 136
    // Gap: 20
    // Left: 108/2 + 20 + 136 = 210
    // Right: 108/2 = 54
    const boxX = direction === 'l' ? svgWidth.destination - 36 - 210 : 36 + 54;

    // Total width: 264
    return useMemo(
        () => (
            <g transform={`translate(${boxX},92)`}>
                <rect fill={line_color[0]} x={-54} width={108} height={120} />
                <text
                    className="rmg-name__zh rmg-outline"
                    fill={line_color[1]}
                    fontSize={96}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="translate(0,60)"
                    letterSpacing={-5}
                >
                    {lineNumber}
                </text>
                <g textAnchor="start" transform="translate(74,68)">
                    <text className="rmg-name__zh rmg-outline" fontSize={68}>
                        {lineNameRes}
                    </text>
                    <text className="rmg-name__en rmg-outline" fontSize={30} dy={42}>
                        {line_name[1]}
                    </text>
                </g>
            </g>
        ),
        [boxX, ...line_name, ...line_color, direction, svgWidth.destination]
    );
};
