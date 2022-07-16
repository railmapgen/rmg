import React, { useEffect, useRef, useState } from 'react';
import StationNumber from '../gzmtr/station-icon/station-number';
import { CanvasType, Name, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import CurrentStationName, { CurrentStationSecondaryName } from '../gzmtr/current-station-name';

const InfoGZMTR = () => {
    const svgHeight = useRootSelector(store => store.param.svg_height);
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const infoPanelType = useRootSelector(store => store.param.info_panel_type);
    const lineNumber = useRootSelector(store => store.param.line_num);
    const currentStationIndex = useRootSelector(store => store.param.current_stn_idx);
    const curStnInfo = useRootSelector(store => store.param.stn_list[currentStationIndex]);

    const [nameBBox, setNameBBox] = useState({ width: 0 } as SVGRect);

    const nextStnId = curStnInfo[direction === ShortDirection.left ? 'parents' : 'children'];

    const otisTransforms = {
        name: `translate(${((direction === ShortDirection.left ? 1 : -1) * svgWidths[CanvasType.RunIn]) / 4},45)`,
        next: `translate(${((direction === ShortDirection.left ? 1 : -1) * svgWidths[CanvasType.RunIn]) / 10},45)`,
    };

    const transforms = {
        nameGroup: {
            x: svgWidths.runin / 2,
            y:
                0.5 * svgHeight -
                50 -
                (curStnInfo.name[1].split('\\').length - 1) * 18 -
                (curStnInfo.secondaryName ? 29 : 0),
        },
        secondaryName: {
            x: 0,
            y: 70 + curStnInfo.name[1].split('\\').length * 36,
        },
    };

    return (
        <g>
            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.name : ''}>
                <g textAnchor="middle" transform={`translate(${transforms.nameGroup.x},${transforms.nameGroup.y})`}>
                    <CurrentStationName stnName={curStnInfo.name} onUpdate={setNameBBox} />
                    {curStnInfo.secondaryName && (
                        <CurrentStationSecondaryName
                            secondaryName={curStnInfo.secondaryName}
                            transform={`translate(${transforms.secondaryName.x},${transforms.secondaryName.y})`}
                        />
                    )}
                </g>

                <StationNumber
                    lineNum={lineNumber}
                    stnNum={curStnInfo.num}
                    style={{
                        ['--translate-x' as any]: `${(svgWidths[CanvasType.RunIn] + nameBBox.width) / 2 + 55}px`,
                        ['--translate-y' as any]: `${
                            0.5 * svgHeight -
                            30 -
                            (curStnInfo.name[1].split('\\').length - 1) * 18 -
                            (curStnInfo.secondaryName ? 58 / 2 : 0)
                        }px`,
                        transform: 'translate(var(--translate-x, 800px), var(--translate-y, 145px))',
                    }}
                    large
                />
            </g>

            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.next : ''}>
                {nextStnId.includes('linestart') || nextStnId.includes('lineend') ? (
                    <></>
                ) : nextStnId.length === 1 ? (
                    <BigNext nextId={nextStnId[0]} nameBBox={nameBBox} />
                ) : (
                    <BigNext2 nextIds={nextStnId} nameBBox={nameBBox} />
                )}
            </g>
        </g>
    );
};

export default InfoGZMTR;

const BigNext = (props: { nextId: string; nameBBox: DOMRect }) => {
    const { nextId, nameBBox } = props;
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const nextInfo = useRootSelector(store => store.param.stn_list[nextId]);
    const { name, secondaryName } = nextInfo;

    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEl = React.useRef<SVGGElement | null>(null);
    useEffect(
        () => setNextBBox(nextNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [name.toString()]
    );

    const nextNameZHCount = name[0].length;
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
                        {name[0]}
                    </text>
                    <g fontSize={17}>
                        {name[1].split('\\').map((txt: string, i: number) => (
                            <text className="rmg-name__en" dy={30 + i * 17} key={i}>
                                {txt}
                            </text>
                        ))}
                    </g>
                </g>
                {secondaryName && (
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
                            secName={secondaryName}
                            transform={`translate(${nextBBox.width / 2},${30 + name[1].split('\\').length * 17 + 5})`}
                        />
                    </g>
                )}
            </g>
            <path
                id="arrow"
                d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
                fill="black"
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
                                      55 +
                                      18.5 * 1.4) /
                                      2 +
                                  20
                              }px`,
                    ['--rotate' as any]: direction === ShortDirection.left ? '0deg' : '180deg',
                }}
            />
        </>
    );
};

const BigNextSec = (props: { secName: Name } & React.SVGProps<SVGGElement>) => {
    const { secName, ...others } = props;

    const nameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as DOMRect);
    useEffect(
        () => setBBox(nameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.secName.toString()]
    );

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
                    {secName[0]}
                </text>
                <text className="rmg-name__en" fontSize={10} dy={15}>
                    {secName[1]}
                </text>
            </g>
        </g>
    );
};

const BigNext2 = (props: { nextIds: string[]; nameBBox: DOMRect }) => {
    const { nextIds, nameBBox } = props;
    const { routes } = useRootSelector(store => store.helper);
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const stationList = useRootSelector(store => store.param.stn_list);

    const nextNames = nextIds.map(id => stationList[id].name);
    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEls = useRef<(SVGGElement | null)[]>([]);
    useEffect(
        () => {
            setNextBBox(prevBBox => ({ ...prevBBox, width: 0 }));
            nextNameEls.current.forEach(el => {
                let nextBBox = el?.getBBox();
                setNextBBox(prevBBox => {
                    if (nextBBox) {
                        return prevBBox.width > nextBBox.width ? prevBBox : nextBBox;
                    } else {
                        return prevBBox;
                    }
                });
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [nextNames.toString()]
    );

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

    const nextNameZHCount = Math.max(...nextNames.map(names => names[0].length));
    const nameBcrX = (svgWidths[CanvasType.RunIn] - nameBBox.width) / 2;

    return (
        <>
            <g id="big_next_2">
                {nextNames.map((name, i) => {
                    return (
                        <React.Fragment key={i}>
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
                                <text className="rmg-name__zh">{name[0]}</text>
                                {name[1].split('\\').map((txt, j) => (
                                    <text key={j} className="rmg-name__en" y={22 + j * 13}>
                                        {txt}
                                    </text>
                                ))}
                                <text className="rmg-name__zh" y={-35}>
                                    {validEnds[i].map(s => stationList[s].name[0]).join('/') + '方向'}
                                </text>
                                <text className="rmg-name__en rmg-name__gzmtr--next2-dest" y={-20}>
                                    {'Towards ' +
                                        validEnds[i]
                                            .map(s => stationList[s].name[1])
                                            .join('/')
                                            .replace('\\', ' ')}
                                </text>
                            </g>
                        </React.Fragment>
                    );
                })}
            </g>
            <path
                id="arrow"
                d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
                fill="black"
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
                                      55 +
                                      18.5 * 1.4) /
                                      2 +
                                  20
                              }px`,
                    ['--rotate' as any]: direction === ShortDirection.left ? '0deg' : '180deg',
                }}
            />
        </>
    );
};
