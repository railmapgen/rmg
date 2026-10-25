// 上海地铁 SVG 画布：上海地铁车站。
import { ColourHex } from '@railmapgen/rmg-palette-resources';
import { ExtendedInterchangeInfo, Facilities, InterchangeGroup } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { forwardRef, JSX, memo, Ref, SVGProps, useEffect, useMemo, useRef, useState } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    color?: ColourHex; // Control the station color if coline is in effect.
    bank?: -1 | 0 | 1; // Loopline requires station element to be horizontal. Default to 0 (no bank to other side).
    direction?: 'l' | 'r'; // Loopline requires station element to change direction. Default to current param.
}

const StationSHMetro = (props: Props) => {
    const { stnId, stnState, color, bank: bank_, direction: direction_override } = props;
    const { direction: direction_param, info_panel_type, stn_list, loop } = useRootSelector(store => store.param);
    const stnInfo = stn_list[stnId];
    const direction = direction_override ?? direction_param;

    // 线路在此分叉时偏移站名
    // 环线没有覆盖车站的竖线，因此不偏移
    const branchNameDX = loop
        ? 0
        : (stnInfo.parents.length > 1 || stnInfo.children.length > 1
              ? 8 + 12 * (stnInfo.localisedName.en?.split('\\')?.length ?? 1)
              : 0) * (direction === 'r' ? -1 : 1);

    let stationIconStyle: string;
    const stationIconColor: { [pos: string]: string } = {};
    if (info_panel_type === 'sh2020') {
        if (stnInfo.services.length === 3) stationIconStyle = 'stn_sh_2020_direct';
        else if (stnInfo.services.length === 2) stationIconStyle = 'stn_sh_2020_express';
        else stationIconStyle = 'stn_sh_2020';
        stationIconColor.fill = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    } else {
        // param.info_panel_type === 'sh' or others (from other styles)
        if (stnInfo.services.length === 3) stationIconStyle = 'direct_sh';
        else if (stnInfo.services.length === 2) stationIconStyle = 'express_sh';
        else if ([...(stnInfo.transfer.groups[0].lines || []), ...(stnInfo.transfer.groups[1]?.lines || [])].length > 0)
            stationIconStyle = 'int2_sh';
        else stationIconStyle = 'stn_sh';
        stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    }

    const bank = bank_ ?? 0;
    const dx = (direction === 'l' ? 6 : -6) + branchNameDX + bank * 30;
    const dy = (info_panel_type === 'sh2020' ? -20 : -6) + Math.abs(bank) * (info_panel_type === 'sh2020' ? 25 : 11);
    const dr = bank ? 0 : direction === 'l' ? -45 : 45;
    return (
        <>
            <use
                xlinkHref={`#${stationIconStyle}`}
                {...stationIconColor} // different styles use either `fill` or `stroke`
                // `sh` 与 `sh2020` 的 `int_sh` 朝向不同，因此乘以 -1 或 1
                transform={
                    `translate(${bank * (info_panel_type === 'sh2020' ? 5 : 0)},0)` +
                    `rotate(${bank * 90 * (info_panel_type === 'sh2020' ? 1 : -1)})`
                }
            />
            <g transform={`translate(${dx},${dy})rotate(${dr})`}>
                <StationNameGElement
                    name={stnInfo.localisedName}
                    groups={stnInfo.transfer.groups}
                    stnState={stnState}
                    direction={direction}
                    facility={stnInfo.facility}
                    bank={bank}
                    oneLine={stnInfo.one_line}
                    intPadding={stnInfo.int_padding}
                />
            </g>
            {stnState === 0 ? <CurrentStationText /> : undefined}
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Translation;
    groups: InterchangeGroup[];
    stnState: -1 | 0 | 1;
    direction: 'l' | 'r';
    facility?: Facilities;
    bank: -1 | 0 | 1;
    oneLine: boolean;
    intPadding: number;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, groups, stnState, direction, facility, bank, oneLine, intPadding } = props;

    // 使用旧引用获取站名精确宽度
    const stnNameEl = useRef<SVGGElement | null>(null);

    // 简化重复计算
    const directionPolarity = direction === 'l' ? 1 : -1;

    // 是否显示设施图标会影响主图标的 `dx`
    const mainDx = facility ? 30 : 0;

    // 换乘名称下方会绘制线条，在环线中水平放置时需要拉伸
    const lineDx = bank ? -12 : 0;

    const intEl = useRef<SVGGElement | null>(null);
    const [intWidth, setIntWidth] = useState(0);
    useEffect(() => setIntWidth(intEl.current?.getBBox().width ?? 0), [JSON.stringify(groups)]);
    const intDx = intPadding - intWidth;

    return (
        <>
            {groups.map(group => group.lines ?? []).flat().length > 0 && (
                <>
                    <line
                        x1={(lineDx + mainDx) * directionPolarity}
                        x2={intDx * directionPolarity}
                        stroke={stnState === -1 ? 'gray' : 'black'}
                        strokeWidth={0.5}
                    />
                    <IntBoxGroup
                        ref={intEl}
                        groups={groups}
                        direction={direction}
                        transform={`translate(${intDx * directionPolarity},-10.75)`}
                    />
                </>
            )}

            {facility && <use xlinkHref={'#' + facility} x={10 * directionPolarity} y={-30} />}

            <g
                textAnchor={direction === 'l' ? 'start' : 'end'}
                transform={`translate(${mainDx * directionPolarity},-14)`}
            >
                <StationName
                    ref={stnNameEl}
                    stnName={name}
                    oneLine={oneLine}
                    directionPolarity={directionPolarity}
                    fill={stnState === -1 ? 'gray' : stnState === 0 ? 'red' : 'black'}
                />

                {/* 显示在 `IntBoxGroup` 上方的出站换乘文字 */}
                {groups[1]?.lines?.length && (
                    <g transform={`translate(${(intDx + intWidth / 2) * directionPolarity},-30)`}>
                        <OSIText osiInfos={groups[1].lines} />
                    </g>
                )}

                {/* 出站换乘在此处理，因为其 `dx` 固定，与 `IntBoxGroup` 无关 */}
                {groups[2]?.lines?.length && (
                    <g transform={`translate(${(intPadding + 5) * directionPolarity},0)`}>
                        <OSysIText osysiInfos={groups[2].lines} direction={props.direction} />
                    </g>
                )}
            </g>
        </>
    );
};

const StationName = forwardRef(function StationName(
    props: { stnName: Translation; oneLine: boolean; directionPolarity: 1 | -1 } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { stnName, oneLine, directionPolarity, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = stnName;

    const zhEl = useRef<SVGGElement | null>(null);
    const [enDx, setEnDx] = useState(0);
    useEffect(() => {
        if (oneLine && zhEl.current) setEnDx(zhEl.current.getBBox().width + 5);
        else setEnDx(0);
    }, [stnName.zh, stnName.en, oneLine]);

    const [ZH_HEIGHT, EN_HEIGHT] = [20, 8];

    return (
        <g ref={ref} {...others}>
            {useMemo(
                () => (
                    <>
                        <g ref={zhEl}>
                            {zhName.split('\\').map((txt, i, arr) => (
                                <text
                                    key={i}
                                    className="rmg-name__zh rmg-outline"
                                    dy={
                                        (arr.length - 1 - i) * -ZH_HEIGHT +
                                        (oneLine ? EN_HEIGHT : (enName.split('\\').length - 1) * -EN_HEIGHT)
                                    }
                                >
                                    {txt}
                                </text>
                            ))}
                        </g>
                        <g fontSize={8} transform={`translate(${enDx * directionPolarity},0)`}>
                            {enName.split('\\').map((txt, i, arr) => (
                                <text
                                    key={i}
                                    className="rmg-name__en rmg-outline"
                                    dy={(arr.length - 2 - i) * -EN_HEIGHT + 2}
                                >
                                    {txt}
                                </text>
                            ))}
                        </g>
                    </>
                ),
                [zhName, enName, oneLine, enDx, directionPolarity]
            )}
        </g>
    );
});

const CurrentStationText = () => {
    const { stn_list } = useRootSelector(store => store.param);
    const servicesPresent = new Set(
        Object.values(stn_list)
            .map(stn => stn.services)
            .flat()
    );
    const dy = [-1, 35, 50, 75][servicesPresent.size];

    return (
        <g transform={`translate(0, ${dy})`}>
            <text className="rmg-name__zh" fill="red" textAnchor="middle">
                本站
            </text>
        </g>
    );
};

const IntBoxGroup = forwardRef(function IntBoxGroup(
    props: { groups: InterchangeGroup[]; direction: 'l' | 'r' } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { groups, direction, ...others } = props;

    // 也称为非出站换乘
    const boxInfos: ExtendedInterchangeInfo[] = [
        ...(groups[0].lines || []),
        ...(groups[1]?.lines || []),
        // 上海地铁在跨系统换乘时仍显示磁浮图标，因此此处采用兼容性处理
        // 在 `boxInfos` 中显示磁浮图标比在 `OSysIText` 中更简单
        ...(groups[2]?.lines?.filter(info => Boolean(info.name[0].match(/^磁(悬)*浮/))) || []),
    ];

    let dx = 0; // update in every boxInfos

    return (
        <g ref={ref} fontSize={14} textAnchor="middle" {...others}>
            {boxInfos.map((info, i) => {
                const isLineNumber = Boolean(info.name[0].match(/^\w+(号)?线/));
                const isMaglev = Boolean(info.name[0].match(/^磁(悬)*浮/));

                if (direction === 'r') {
                    dx -= (isLineNumber || isMaglev ? 20 : info.name[0].length * 14 + 12) + (i === 0 ? 0 : 5);
                }

                let el: JSX.Element;
                if (isMaglev) {
                    el = (
                        <g transform={`translate(${dx},-16)scale(0.1428571429)`} key={i}>
                            <IntBoxMaglev info={info} />
                        </g>
                    );
                } else if (isLineNumber) {
                    el = (
                        <g transform={`translate(${dx},0)`} key={i}>
                            <IntBoxNumber info={info} />
                        </g>
                    );
                } else {
                    el = (
                        <g transform={`translate(${dx},0)`} key={i}>
                            <IntBoxLetter info={info} />
                        </g>
                    );
                }

                if (direction === 'l') {
                    dx += isLineNumber || isMaglev ? 20 + 5 : info.name[0].length * 14 + 12 + 5;
                }
                return el;
            })}
        </g>
    );
});

const IntBoxMaglev = memo(
    function IntBoxMaglev(props: { info: ExtendedInterchangeInfo }) {
        return (
            <>
                <use xlinkHref="#intbox_maglev" fill={props.info.theme?.[2]} stroke={props.info.theme?.[2]} />
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

const IntBoxNumber = memo(
    function IntBoxNumber(props: { info: ExtendedInterchangeInfo }) {
        return (
            <>
                <use xlinkHref="#intbox_number" fill={props.info.theme?.[2]} />
                <text x={10} className="rmg-name__zh" fill={props.info.theme?.[3]} dominantBaseline="central">
                    {/* 线路名以数字开头 */}
                    {props.info.name[0].match(/(\d*)\w+/)?.[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

const IntBoxLetter = memo(
    function IntBoxLetter(props: { info: ExtendedInterchangeInfo }) {
        // 框宽：16 × 字符数 + 12
        const textCount = props.info.name[0].split('\\')[0].length;
        return (
            <>
                <rect height={22} width={textCount * 14 + 12} y={-11} fill={props.info.theme?.[2]} />
                <text
                    x={textCount * 7 + 6}
                    className="rmg-name__zh"
                    fill={props.info.theme?.[3]}
                    dominantBaseline="central"
                >
                    {props.info.name[0].split('\\')[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

const OSIText = (props: { osiInfos: ExtendedInterchangeInfo[] }) => {
    // 获取全部出站换乘线路名
    const lineNames = props.osiInfos.map(info => info.name[0]).join('，');
    return useMemo(
        () => (
            <g textAnchor="middle" fontSize="50%">
                <text className="rmg-name__zh" dy={-5}>
                    {`换乘${lineNames}`}
                </text>
                <text className="rmg-name__zh" dy={5}>
                    仅限公共交通卡
                </text>
                <text className="rmg-name__en" dy={12.5} fontSize="75%">
                    Only for Public Transportation Card
                </text>
            </g>
        ),
        [lineNames.toString()]
    );
};

const OSysIText = (props: { osysiInfos: ExtendedInterchangeInfo[]; direction: 'l' | 'r' }) => {
    // 获取全部跨系统换乘线路名
    const lineNames = props.osysiInfos.map(info => info.name[0]).join('，');
    const lineNamesEn = props.osysiInfos.map(info => info.name[1]).join(', ');

    return useMemo(
        () => (
            <g textAnchor={props.direction === 'l' ? 'start' : 'end'} fontSize="50%">
                <text className="rmg-name__zh" dy={3}>
                    转乘{lineNames}
                </text>
                <text className="rmg-name__en" dy={10} fontSize="75%">
                    To {lineNamesEn}
                </text>
            </g>
        ),
        [JSON.stringify(props.osysiInfos), props.direction]
    );
};
