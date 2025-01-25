import { Fragment, SVGProps, useEffect, useRef, useState } from 'react';
import { StationNumber } from '@railmapgen/svg-assets/gzmtr';
import { CanvasType, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import CurrentStationName, { CurrentStationSecondaryName } from './current-station-name';
import ArrowGzmtr from './arrow-gzmtr';
import { Translation } from '@railmapgen/rmg-translate';

const NAME_NUM_GAP = 55;
const NUM_WIDTH = 18.5 * 1.4;

const InfoGZMTR = () => {
    const {
        svg_height: svgHeight,
        svgWidth: svgWidths,
        theme,
        direction,
        info_panel_type: infoPanelType,
        line_num: lineNumber,
        current_stn_idx: currentStationIndex,
        stn_list: stationList,
    } = useRootSelector(store => store.param);
    const curStnInfo = stationList[currentStationIndex];
    const { localisedName, localisedSecondaryName } = curStnInfo;

    const [nameBBox, setNameBBox] = useState({ width: 0 } as SVGRect);

    const enNameRows = localisedName.en?.split('\\')?.length ?? 1;
    const nextStnId = curStnInfo[direction === ShortDirection.left ? 'parents' : 'children'];

    const post2022 = [PanelTypeGZMTR.gz7w, PanelTypeGZMTR.gz11].includes(infoPanelType as PanelTypeGZMTR);

    const otisTransforms = {
        name: `translate(${((direction === ShortDirection.left ? 1 : -1) * svgWidths[CanvasType.RunIn]) / 4},45)`,
        next: `translate(${((direction === ShortDirection.left ? 1 : -1) * svgWidths[CanvasType.RunIn]) / 10},45)`,
    };

    const stationNumberX = (svgWidths[CanvasType.RunIn] + nameBBox.width) / 2 + NAME_NUM_GAP;
    const transforms = {
        nameGroup: {
            x: svgWidths.runin / 2,
            y: 0.5 * svgHeight - 50 - (enNameRows - 1) * 18 - (localisedSecondaryName ? 29 : 0),
        },
        secondaryName: {
            x: 0,
            y: 70 + enNameRows * 36,
        },
        stationNumber: {
            x: stationNumberX,
            y: 0.5 * svgHeight - 30 - (enNameRows - 1) * 18 - (localisedSecondaryName ? 58 / 2 : 0),
        },
        stationNumberPost2022: {
            x:
                direction === ShortDirection.left
                    ? stationNumberX
                    : (svgWidths[CanvasType.RunIn] - nameBBox.width) / 2 - NAME_NUM_GAP,
            y: 0.5 * svgHeight - (enNameRows - 1) * 18 - (localisedSecondaryName ? 58 / 2 : 0),
        },
    };

    return (
        <g>
            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.name : ''}>
                <g textAnchor="middle" transform={`translate(${transforms.nameGroup.x},${transforms.nameGroup.y})`}>
                    <CurrentStationName stnName={localisedName} onUpdate={setNameBBox} />
                    {localisedSecondaryName && (
                        <CurrentStationSecondaryName
                            secondaryName={localisedSecondaryName}
                            transform={`translate(${transforms.secondaryName.x},${transforms.secondaryName.y})`}
                        />
                    )}
                </g>

                <StationNumber
                    lineNum={lineNumber}
                    stnNum={curStnInfo.num}
                    strokeColour={theme[2]}
                    textClassName="rmg-name__zh"
                    transform={
                        post2022
                            ? `translate(${transforms.stationNumberPost2022.x},${transforms.stationNumberPost2022.y})`
                            : `translate(${transforms.stationNumber.x},${transforms.stationNumber.y})`
                    }
                    size="lg"
                />
            </g>

            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.next : ''}>
                {!nextStnId || nextStnId.includes('linestart') || nextStnId.includes('lineend') ? (
                    <></>
                ) : nextStnId.length === 1 ? (
                    <BigNext nextId={nextStnId[0]} nameBBox={nameBBox} ignoreNumWidth={post2022} />
                ) : (
                    <BigNext2 nextIds={nextStnId} nameBBox={nameBBox} ignoreNumWidth={post2022} />
                )}
            </g>
        </g>
    );
};

export default InfoGZMTR;

const BigNext = (props: { nextId: string; nameBBox: DOMRect; ignoreNumWidth?: boolean }) => {
    const { nextId, nameBBox, ignoreNumWidth } = props;
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const nextInfo = useRootSelector(store => store.param.stn_list[nextId]);
    const { localisedName, localisedSecondaryName } = nextInfo;
    const { zh: zhName = '', en: enName = '' } = localisedName;

    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEl = useRef<SVGGElement | null>(null);
    useEffect(() => {
        if (nextNameEl.current) setNextBBox(nextNameEl.current.getBBox());
    }, [zhName, enName]);

    const nextNameZHCount = zhName.length;
    const nameBcrX = (svgWidths[CanvasType.RunIn] - nameBBox.width) / 2;

    return (
        <>
            <g id="big_next">
                <g
                    textAnchor="middle"
                    style={{
                        ['--translate-x' as any]:
                            direction === ShortDirection.left
                                ? '80px'
                                : nextNameZHCount <= 2
                                  ? `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width - 70}px`
                                  : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width - 35 * 1.5}px`,
                    }}
                >
                    <text className="rmg-name__zh" fontSize={35}>
                        下站
                    </text>
                    <text className="rmg-name__en" fontSize={17} dy={30}>
                        Next
                    </text>
                </g>
                <g
                    textAnchor="start"
                    ref={nextNameEl}
                    style={{
                        ['--translate-x' as any]:
                            direction === ShortDirection.left
                                ? nextNameZHCount <= 2
                                    ? `${115 + 35}px`
                                    : `${115 + 35 / 2}px`
                                : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width}px`,
                    }}
                >
                    <text className="rmg-name__zh" fontSize={35}>
                        {zhName}
                    </text>
                    <g fontSize={17}>
                        {enName.split('\\').map((txt: string, i: number) => (
                            <text className="rmg-name__en" dy={30 + i * 17} key={i}>
                                {txt}
                            </text>
                        ))}
                    </g>
                </g>
                {localisedSecondaryName && (
                    <g
                        textAnchor="middle"
                        style={{
                            ['--translate-x' as any]:
                                direction === ShortDirection.left
                                    ? nextNameZHCount <= 2
                                        ? `${115 + 35}px`
                                        : `${115 + 35 / 2}px`
                                    : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width}px`,
                        }}
                    >
                        <BigNextSec
                            secName={localisedSecondaryName}
                            transform={`translate(${nextBBox.width / 2},${30 + enName.split('\\').length * 17 + 5})`}
                        />
                    </g>
                )}
            </g>
            <ArrowGzmtr
                id="arrow"
                style={{
                    ['--translate-x' as any]:
                        direction === ShortDirection.left
                            ? `${
                                  (115 + 35 * ((nextNameZHCount <= 2 ? 1 : 0.5) + nextNameZHCount) + nameBcrX) / 2 - 20
                              }px`
                            : `${
                                  (svgWidths[CanvasType.RunIn] -
                                      45 -
                                      nextBBox.width -
                                      (nextNameZHCount <= 2 ? 70 + 35 : 35 * 2.5) +
                                      nameBcrX +
                                      props.nameBBox.width +
                                      (ignoreNumWidth ? 0 : NAME_NUM_GAP + NUM_WIDTH)) /
                                      2 +
                                  20
                              }px`,
                    ['--rotate' as any]: direction === ShortDirection.left ? '0deg' : '180deg',
                }}
            />
        </>
    );
};

const BigNextSec = (props: { secName: Translation } & SVGProps<SVGGElement>) => {
    const { secName, ...others } = props;
    const { zh, en } = secName;

    const nameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as DOMRect);
    useEffect(() => {
        if (nameEl.current) setBBox(nameEl.current.getBBox());
    }, [zh, en]);

    return (
        <g {...others}>
            <g transform="translate(0,2.5)" fontSize={25}>
                <text textAnchor="end" x={bBox.x - 3} className="rmg-name__zh">
                    {'('}
                </text>
                <text textAnchor="start" x={bBox.width + bBox.x + 3} className="rmg-name__zh">
                    {')'}
                </text>
            </g>
            <g ref={nameEl}>
                <text className="rmg-name__zh" fontSize={18}>
                    {zh}
                </text>
                <text className="rmg-name__en" fontSize={10} dy={15}>
                    {en}
                </text>
            </g>
        </g>
    );
};

const BigNext2 = (props: { nextIds: string[]; nameBBox: DOMRect; ignoreNumWidth?: boolean }) => {
    const { nextIds, nameBBox, ignoreNumWidth } = props;
    const { routes } = useRootSelector(store => store.helper);
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const stationList = useRootSelector(store => store.param.stn_list);

    const nextNames = nextIds.map(id => stationList[id].localisedName);
    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEls = useRef<(SVGGElement | null)[]>([]);
    useEffect(() => {
        setNextBBox(prevBBox => ({ ...prevBBox, width: 0 }));
        nextNameEls.current.forEach(el => {
            const nextBBox = el?.getBBox();
            setNextBBox(prevBBox => {
                if (nextBBox) {
                    return prevBBox.width > nextBBox.width ? prevBBox : nextBBox;
                } else {
                    return prevBBox;
                }
            });
        });
    }, [nextNames.toString()]);

    const validEnds = props.nextIds.map(stnId =>
        routes.reduce(
            (acc, route) =>
                // filter routes not containing next station's id
                route.includes(stnId)
                    ? acc.concat(
                          route
                              .filter(s => !['linestart', 'lineend'].includes(s))
                              // select first/last station's id
                              .slice(direction === ShortDirection.left ? 0 : -1)[0]
                      )
                    : acc,
            [] as string[]
        )
    );

    const nextNameZHCount = Math.max(...nextNames.map(names => names.zh?.length ?? 0));
    const nameBcrX = (svgWidths[CanvasType.RunIn] - nameBBox.width) / 2;

    return (
        <>
            <g id="big_next_2">
                {nextNames.map((name, i) => {
                    return (
                        <Fragment key={i}>
                            <g
                                textAnchor="middle"
                                style={{
                                    ['--translate-x' as any]:
                                        direction === ShortDirection.left
                                            ? '72px'
                                            : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width - 41}px`,
                                }}
                            >
                                <text className="rmg-name__zh">下站</text>
                                <text className="rmg-name__en" y={22}>
                                    Next
                                </text>
                            </g>
                            <g
                                ref={el => (nextNameEls.current[i] = el)}
                                textAnchor="start"
                                style={{
                                    ['--translate-x' as any]:
                                        direction === ShortDirection.left
                                            ? '113px'
                                            : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width}px`,
                                }}
                            >
                                <text className="rmg-name__zh">{name.zh}</text>
                                {name.en?.split('\\')?.map((txt, j) => (
                                    <text key={j} className="rmg-name__en" y={22 + j * 13}>
                                        {txt}
                                    </text>
                                ))}
                                <text className="rmg-name__zh" y={-35}>
                                    {validEnds[i].map(s => stationList[s].localisedName.zh).join('/') + '方向'}
                                </text>
                                <text className="rmg-name__en rmg-name__gzmtr--next2-dest" y={-20}>
                                    {'Towards ' +
                                        validEnds[i]
                                            .map(s => stationList[s].localisedName.en)
                                            .join('/')
                                            .replace('\\', ' ')}
                                </text>
                            </g>
                        </Fragment>
                    );
                })}
            </g>
            <ArrowGzmtr
                id="arrow"
                style={{
                    ['--translate-x' as any]:
                        direction === ShortDirection.left
                            ? `${(99 + 27 * (1 + nextNameZHCount) + nameBcrX) / 2 - 20}px`
                            : `${
                                  (svgWidths[CanvasType.RunIn] -
                                      45 -
                                      nextBBox.width -
                                      41 -
                                      27 +
                                      nameBcrX +
                                      props.nameBBox.width +
                                      (ignoreNumWidth ? 0 : NAME_NUM_GAP + NUM_WIDTH)) /
                                      2 +
                                  20
                              }px`,
                    ['--rotate' as any]: direction === ShortDirection.left ? '0deg' : '180deg',
                }}
            />
        </>
    );
};
