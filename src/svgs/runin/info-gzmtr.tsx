import React, { useState, useEffect, useRef } from 'react';
import { ParamContext } from '../../context';
import StationNumberText from '../station-num-gzmtr';

const InfoGZMTR = () => {
    const { param } = React.useContext(ParamContext);
    const curStnInfo = param.stn_list[param.current_stn_idx];

    const curNameEl = React.useRef<SVGGElement | null>(null);
    const [nameBBox, setNameBBox] = useState({ width: 0 } as DOMRect);
    useEffect(
        () => setNameBBox(curNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [curStnInfo.name[0], curStnInfo.name[1]]
    );

    const nextStnId = curStnInfo[param.direction === 'l' ? 'parents' : 'children'];

    return (
        <g>
            <BigName
                ref={curNameEl}
                curName={curStnInfo.name}
                style={{
                    ['--translate-y' as any]: `${0.5 * param.svg_height -
                        50 -
                        (curStnInfo.name[1].split('\\').length - 1) * 18}px`,
                }}
            />

            <BigStnNum
                lineNum={param.line_num}
                stnNum={curStnInfo.num}
                style={{
                    ['--translate-x' as any]: `${(param.svgWidth.runin + nameBBox.width) / 2 + 55}px`,
                    ['--translate-y' as any]: `${0.5 * param.svg_height -
                        30 -
                        (curStnInfo.name[1].split('\\').length - 1) * 18}px`,
                }}
            />

            {nextStnId.includes('linestart') || nextStnId.includes('lineend') ? (
                <></>
            ) : nextStnId.length === 1 ? (
                <BigNext nextId={nextStnId[0]} nameBBox={nameBBox} />
            ) : (
                <BigNext2 nextIds={nextStnId} nameBBox={nameBBox} />
            )}
        </g>
    );
};

export default InfoGZMTR;

const BigName = React.forwardRef(
    (props: { curName: Name } & React.SVGProps<SVGGElement>, ref: React.Ref<SVGGElement>) => {
        const { curName, ...others } = props;

        return (
            <g id="big_name" ref={ref} {...others}>
                {React.useMemo(
                    () => (
                        <>
                            <text className="rmg-name__zh" fontSize={90}>
                                {curName[0]}
                            </text>
                            <g fontSize={36} className="rmg-name__en">
                                {curName[1].split('\\').map((txt, i) => (
                                    <text key={i} dy={70 + i * 36}>
                                        {txt}
                                    </text>
                                ))}
                            </g>
                        </>
                    ),
                    [curName]
                )}
            </g>
        );
    }
);

const BigStnNum = (props: { lineNum: string; stnNum: string } & React.SVGProps<SVGGElement>) => {
    const { lineNum, stnNum, ...others } = props;

    return (
        <g id="big_stn_num" {...others}>
            {React.useMemo(
                () => (
                    <>
                        <path
                            className="rmg-stn rmg-stn--future"
                            d="M 0,12.95 V -12.95 H -12.95 a 12.95,12.95 0 0,0 0,25.9 h 25.9 a 12.95,12.95 0 0,0 0,-25.9 H 0 "
                        />
                        <StationNumberText transform="scale(1.4)" {...{ lineNum, stnNum }} />
                    </>
                ),
                [lineNum, stnNum]
            )}
        </g>
    );
};

const BigNext = (props: { nextId: string; nameBBox: DOMRect }) => {
    const { param } = React.useContext(ParamContext);

    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEl = React.useRef<SVGGElement | null>(null);
    useEffect(() => setNextBBox(nextNameEl.current!.getBBox()), []);

    const nextNameZHCount = param.stn_list[props.nextId].name[0].length;
    const nameBcrX = (param.svgWidth.runin - props.nameBBox.width) / 2;

    return (
        <>
            <g id="big_next">
                <g
                    textAnchor="middle"
                    style={{
                        ['--translate-x' as any]:
                            param.direction === 'l'
                                ? '80px'
                                : nextNameZHCount <= 2
                                ? `${param.svgWidth.runin - 45 - nextBBox.width - 70}px`
                                : `${param.svgWidth.runin - 45 - nextBBox.width - 35 * 1.5}px`,
                    }}
                >
                    <text className="rmg-name__zh">下站</text>
                    <text className="rmg-name__en" dy={30}>
                        Next
                    </text>
                </g>
                <g
                    textAnchor="start"
                    ref={nextNameEl}
                    style={{
                        ['--translate-x' as any]:
                            param.direction === 'l'
                                ? nextNameZHCount <= 2
                                    ? `${115 + 35}px`
                                    : `${115 + 35 / 2}px`
                                : `${param.svgWidth.runin - 45 - nextBBox.width}px`,
                    }}
                >
                    <text className="rmg-name__zh">{param.stn_list[props.nextId].name[0]}</text>
                    {param.stn_list[props.nextId].name[1].split('\\').map((txt: string, i: number) => (
                        <text className="rmg-name__en" dy={30 + i * 17} key={i}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
            <path
                id="arrow"
                d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
                fill="black"
                style={{
                    ['--translate-x' as any]:
                        param.direction === 'l'
                            ? `${(115 + 35 * ((nextNameZHCount <= 2 ? 1 : 0.5) + nextNameZHCount) + nameBcrX) / 2 -
                                  20}px`
                            : `${(param.svgWidth.runin -
                                  45 -
                                  nextBBox.width -
                                  (nextNameZHCount <= 2 ? 70 + 35 : 35 * 2.5) +
                                  nameBcrX +
                                  props.nameBBox.width +
                                  55 +
                                  18.5 * 1.4) /
                                  2 +
                                  20}px`,
                    ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg',
                }}
            />
        </>
    );
};

const BigNext2 = (props: { nextIds: string[]; nameBBox: DOMRect }) => {
    const { param, routes } = React.useContext(ParamContext);

    const nextNames = props.nextIds.map(id => param.stn_list[id].name);
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
                              .slice(param.direction === 'l' ? 0 : -1)[0]
                      )
                    : acc,
            [] as string[]
        )
    );

    const nextNameZHCount = Math.max(...nextNames.map(names => names[0].length));
    const nameBcrX = (param.svgWidth.runin - props.nameBBox.width) / 2;

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
                                        param.direction === 'l'
                                            ? '72px'
                                            : `${param.svgWidth.runin - 45 - nextBBox.width - 41}px`,
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
                                        param.direction === 'l'
                                            ? '113px'
                                            : `${param.svgWidth.runin - 45 - nextBBox.width}px`,
                                }}
                            >
                                <text className="rmg-name__zh">{name[0]}</text>
                                {name[1].split('\\').map((txt, j) => (
                                    <text key={j} className="rmg-name__en" y={22 + j * 13}>
                                        {txt}
                                    </text>
                                ))}
                                <text className="rmg-name__zh" y={-35}>
                                    {validEnds[i].map(s => param.stn_list[s].name[0]).join('/') + '方向'}
                                </text>
                                <text className="rmg-name__en rmg-name__gzmtr--next2-dest" y={-20}>
                                    {'Towards ' +
                                        validEnds[i]
                                            .map(s => param.stn_list[s].name[1])
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
                        param.direction === 'l'
                            ? `${(99 + 27 * (1 + nextNameZHCount) + nameBcrX) / 2 - 20}px`
                            : `${(param.svgWidth.runin -
                                  45 -
                                  nextBBox.width -
                                  41 -
                                  27 +
                                  nameBcrX +
                                  props.nameBBox.width +
                                  55 +
                                  18.5 * 1.4) /
                                  2 +
                                  20}px`,
                    ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg',
                }}
            />
        </>
    );
};
