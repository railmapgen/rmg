import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { adjacencyList, criticalPathMethod, drawLine, getStnState } from '../methods/share';
import { CanvasType, ShortDirection, StationDict } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { LineIcon } from '@railmapgen/svg-assets/gzmtr';
import { ColourHex, MonoColour } from '@railmapgen/rmg-palette-resources';
import StationGroup from './station-group';

const wideFactor = (stnList: StationDict, stnId: string) =>
    stnList[stnId].parents.length === 2 || stnList[stnId].children.length === 2 ? 0.25 : 0;

const getXShare = (stnId: string, adjMat: ReturnType<typeof adjacencyList>, branches: string[][]): number => {
    const criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    if (criticalPath.nodes.includes(stnId)) {
        return criticalPathMethod(criticalPath.nodes[1], stnId, adjMat).len;
    } else {
        // must have 1 parent and 1 child only
        const branchOfStn = branches.filter(branch => branch.includes(stnId))[0];
        let partSource = stnId;
        while (!criticalPath.nodes.includes(partSource)) {
            partSource = branchOfStn[branchOfStn.indexOf(partSource) - 1];
        }
        let partSink = stnId;
        while (!criticalPath.nodes.includes(partSink)) {
            partSink = branchOfStn[branchOfStn.indexOf(partSink) + 1];
        }

        const leftOpenJaw = partSource === 'linestart';
        const rightOpenJaw = partSink === 'lineend';

        if (branchOfStn.toString() === branches[0].toString()) {
            // station on main line, expand to fit
            const lens = [];
            if (!leftOpenJaw && !rightOpenJaw) {
                lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
                lens[1] = criticalPathMethod(partSource, partSink, adjMat).len;
                lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
                lens[3] = criticalPathMethod(stnId, partSink, adjMat).len;
            } else if (leftOpenJaw) {
                lens[0] = 0;
                lens[1] = criticalPathMethod(criticalPath.nodes[1], partSink, adjMat).len;
                lens[2] = criticalPathMethod(branchOfStn[1], stnId, adjMat).len;
                lens[3] = criticalPathMethod(stnId, partSink, adjMat).len;
            } else {
                // right open jaw
                lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
                lens[1] = criticalPathMethod(partSource, criticalPath.nodes.slice(-2)[0], adjMat).len;
                lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
                lens[3] = criticalPathMethod(stnId, branchOfStn.slice(-2)[0], adjMat).len;
            }
            return lens[0] + (lens[2] * lens[1]) / (lens[2] + lens[3]);
        } else {
            if (!leftOpenJaw && !rightOpenJaw) {
                const lens = [];
                lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
                lens[1] = criticalPathMethod(partSource, partSink, adjMat).len;
                lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
                lens[3] = criticalPathMethod(stnId, partSink, adjMat).len;
                return lens[0] + (lens[2] * lens[1]) / (lens[2] + lens[3]);
            } else if (leftOpenJaw) {
                return (
                    criticalPathMethod(criticalPath.nodes[1], partSink, adjMat).len -
                    criticalPathMethod(stnId, partSink, adjMat).len
                );
            } else {
                // right open jaw
                return (
                    criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len +
                    criticalPathMethod(partSource, stnId, adjMat).len
                );
            }
        }
    }
};

const MainGZMTR = () => {
    const { branches, routes, depsStr: deps } = useRootSelector(store => store.helper);
    const [lineBoxWidth, setLineBoxWidth] = useState(45);

    const {
        svgWidth: svgWidths,
        svg_height: svgH,
        y_pc: yPercentage,
        padding: paddingPercentage,
        branchSpacingPct,
        direction,
        line_name: lineName,
        spanLineNum,
        current_stn_idx: currentStationIndex,
        stn_list: stationList,
    } = useRootSelector(store => store.param);

    const lineIconRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (lineIconRef.current) {
                setLineBoxWidth(lineIconRef.current.getBBox().width);
            }
        }, 100);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [lineIconRef.current, lineName[0], lineName[1], spanLineNum]);

    const adjMat = adjacencyList(stationList, wideFactor, wideFactor);

    const xShares = useMemo(() => {
        console.log('computing x shares');
        return Object.keys(stationList).reduce(
            (acc, cur) => ({ ...acc, [cur]: getXShare(cur, adjMat, branches) }),
            {} as { [stnId: string]: number }
        );
    }, [branches.toString(), JSON.stringify(adjMat)]);

    const criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    const realCP = criticalPathMethod(criticalPath.nodes[1], criticalPath.nodes.slice(-2)[0], adjMat);

    const lineXs: [number, number] =
        direction === ShortDirection.right
            ? [
                  (svgWidths[CanvasType.RailMap] * paddingPercentage) / 100 + 65,
                  svgWidths[CanvasType.RailMap] * (1 - paddingPercentage / 100) - 20,
              ]
            : [
                  (svgWidths[CanvasType.RailMap] * paddingPercentage) / 100,
                  svgWidths[CanvasType.RailMap] * (1 - paddingPercentage / 100) - 65,
              ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const yShares = useMemo(() => {
        console.log('computing y shares');
        return Object.keys(stationList).reduce(
            (acc, cur) => {
                if (branches[0].includes(cur)) {
                    return { ...acc, [cur]: 0 };
                } else {
                    const branchOfStn = branches.slice(1).filter(branch => branch.includes(cur))[0];
                    return { ...acc, [cur]: stationList[branchOfStn[0]].children.indexOf(branchOfStn[1]) ? -2 : 2 };
                }
            },
            {} as { [stnId: string]: number }
        );
    }, [deps]);
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: (-yShares[cur] * branchSpacingPct * svgH) / 200 }),
        {} as typeof yShares
    );

    const stnStates = useMemo(
        () => getStnState(currentStationIndex, routes, direction),
        [currentStationIndex, direction, routes.toString()]
    );

    const linePaths = branches
        .map(branch => drawLine(branch, stnStates))
        .reduce(
            (acc, cur) => {
                acc.main.push(cur.main);
                acc.pass.push(cur.pass);
                return acc;
            },
            { main: [], pass: [] } as { main: string[][]; pass: string[][] }
        );

    const paths = (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: linePaths[cur].map(stns => _linePath(stns, xs, ys)),
        }),
        {} as { [key in keyof ReturnType<typeof drawLine>]: string[] }
    );

    const lineBoxOffset = lineBoxWidth + 20; // default is 65

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: yPercentage,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        >
            <Line paths={paths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
            <g
                className="line_name"
                style={{
                    ['--translate-x' as any]:
                        direction === ShortDirection.right
                            ? `${lineXs[0] - lineBoxOffset}px`
                            : `${lineXs[1] + lineBoxOffset}px`,
                }}
            >
                <LineIcon
                    ref={lineIconRef}
                    zhName={lineName[0]}
                    enName={lineName[1]}
                    foregroundColour={'var(--rmg-theme-fg)' as MonoColour}
                    backgroundColour={'var(--rmg-theme-colour)' as ColourHex}
                    zhClassName="rmg-name__zh"
                    enClassName="rmg-name__en"
                    spanDigits={spanLineNum}
                />
            </g>
        </g>
    );
};

export default MainGZMTR;

const Line = memo(
    function Line(props: { paths: { main: string[]; pass: string[] } }) {
        return (
            <g fill="none" strokeWidth={4}>
                <g stroke="#aaa" strokeDasharray={4}>
                    {props.paths.pass.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                </g>
                <g stroke="var(--rmg-theme-colour)">
                    {props.paths.main.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.paths) === JSON.stringify(nextProps.paths)
);

const _linePath = (stnIds: string[], realXs: { [stnId: string]: number }, realYs: { [stnId: string]: number }) => {
    let prevY: number;
    const path = [] as string[];

    stnIds.forEach(stnId => {
        const x = realXs[stnId];
        const y = realYs[stnId];
        if (!prevY && prevY !== 0) {
            prevY = y;
            path.push(`M ${x},${y}`);
            return;
        }
        if (y === 0) {
            if (y < prevY) path.push(`H ${x - 40}`, 'a 40,40 0 0,0 40,-40', `V ${y}`);
            if (y > prevY) path.push(`H ${x - 40}`, 'a 40,40 0 0,1 40,40', `V ${y}`);
        } else {
            if (y < prevY) path.push(`V ${y + 40}`, 'a 40,40 0 0,1 40,-40', `H ${x}`);
            if (y > prevY) path.push(`V ${y - 40}`, 'a 40,40 0 0,0 40,40', `H ${x}`);
        }
        path.push(`H ${x}`);
        prevY = y;
    });

    // simplify path
    return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
};
