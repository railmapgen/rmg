// 上海地铁 SVG 画布：上海地铁目的地信息。
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
            {/* 线路路径的延伸段；计算时需减去描边宽度。  */}
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

    // 获取每条支线的有效目的地
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
    // 根据目的地 ID 获取站名
    const get_dest_names = (dest_ids: string[], one_line: boolean): Name[] =>
        !one_line
            ? dest_ids.map(id => {
                  const { zh = '', en = '' } = stn_list[id].localisedName;
                  return [zh.replace('\\', ''), en.replace('\\', '')];
              })
            : [
                  // `sh` 类型中只有一条线路
                  [
                      dest_ids.map(id => stn_list[id].localisedName.zh).join('，'),
                      dest_ids.map(id => stn_list[id].localisedName.en).join(', '),
                  ].map(s => s.replace('\\', '')) as Name,
              ];

    // 获取目的地 ID
    const valid_dest_ids = !loop
        ? get_valid_destinations(routes, direction, current_stn_id)
        : get_pivot_stations(branches, direction, stn_list, current_stn_id);
    // 获取共线目的地 ID
    // 环线需要共线支线的目的地 ID
    const coline_dest_ids = (!loop ? valid_dest_ids : get_valid_destinations(routes, direction, current_stn_id)).filter(
        valid_dest_id =>
            branches
                .slice(1)
                .filter(branch => isColineBranch(branch, stn_list))
                .some(branch => branch.includes(valid_dest_id))
    );
    // 筛选共线目的地 ID
    const regular_dest_ids = valid_dest_ids.filter(valid_dest_id => !coline_dest_ids.includes(valid_dest_id));

    // 环线目的地名称；`sh2020` 类型始终使用两行
    const dest_names = get_dest_names(regular_dest_ids, !loop && !(info_panel_type === 'sh2020'));
    const coline_dest_names = get_dest_names(coline_dest_ids, true);

    // 最多为两行目的地名称预留空间
    const coline_dy = 250;
    // 从 `coline_dest_ids` 获取共线信息
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
                // 暂不支持多个共线目的地
                coline_dest_ids
                    .filter(coline_dest_id =>
                        Object.values(coline).some(co => co.from === coline_dest_id || co.to === coline_dest_id)
                    )
                    .map(coline_dest_id => (
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
    // 对齐优先级：
    // 1. 画布中心
    // 2. 剩余空间中心
    const platformX =
        middle - MARGIN - PADDING - terminalBBox.width >= PLATFORM_WIDTH / 2 &&
        middle - MARGIN - PADDING - LINEBOX_WIDTH >= PLATFORM_WIDTH / 2
            ? middle
            : direction === 'l'
              ? (svgWidth.destination + terminalBBox.width - LINEBOX_WIDTH) / 2
              : (svgWidth.destination - terminalBBox.width + LINEBOX_WIDTH) / 2;

    // 屏蔽门闪灯
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
            {/* 这不是通用实现，仅支持目的地数量为 1 或 2 */}
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

    // 总宽度：325
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

    // 获取站名精确宽度，使
    // 线路色矩形保持正确宽度
    const stnNameEl = useRef<SVGGElement | null>(null);
    // 站名原始位置
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

    // 编号宽度：108
    // 文字宽度：136
    // 间距：20
    // 左侧：108/2 + 20 + 136 = 210
    // 右侧：108/2 = 54
    const boxX = direction === 'l' ? svgWidth.destination - 36 - 210 : 36 + 54;

    // 总宽度：264
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
