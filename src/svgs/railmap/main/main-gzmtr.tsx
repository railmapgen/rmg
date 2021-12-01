import React, { useMemo } from 'react';
import StationGZMTR from './station/station-gzmtr';
import { adjacencyList, criticalPathMethod, drawLine, getStnState } from '../methods/share';
import { CanvasType, ColourHex, MonoColour, ShortDirection, StationDict } from '../../../constants/constants';
import { useAppSelector } from '../../../redux';
import LineIcon from '../../gzmtr/line-icon/line-icon';

const wideFactor = (stnList: StationDict, stnId: string) =>
    stnList[stnId].parents.length === 2 || stnList[stnId].children.length === 2 ? 0.25 : 0;

const getXShare = (stnId: string, adjMat: ReturnType<typeof adjacencyList>, branches: string[][]): number => {
    let criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    if (criticalPath.nodes.includes(stnId)) {
        return criticalPathMethod(criticalPath.nodes[1], stnId, adjMat).len;
    } else {
        // must has 1 parent and 1 child only
        let branchOfStn = branches.filter(branch => branch.includes(stnId))[0];
        if (!branchOfStn) return 0;
        let partSource = stnId;
        while (!criticalPath.nodes.includes(partSource)) {
            partSource = branchOfStn[branchOfStn.indexOf(partSource) - 1];
        }
        let partSink = stnId;
        while (!criticalPath.nodes.includes(partSink)) {
            partSink = branchOfStn[branchOfStn.indexOf(partSink) + 1];
        }

        let leftOpenJaw = partSource === 'linestart';
        let rightOpenJaw = partSink === 'lineend';

        if (branchOfStn.toString() === branches[0].toString()) {
            // station on main line, expand to fit
            let lens = [];
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
                let lens = [];
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
    const { branches, routes, depsStr: deps } = useAppSelector(store => store.helper);

    const svgWidths = useAppSelector(store => store.param.svgWidth);
    const yPercentage = useAppSelector(store => store.param.y_pc);
    const paddingPercentage = useAppSelector(store => store.param.padding);
    const branchSpacing = useAppSelector(store => store.param.branch_spacing);
    const direction = useAppSelector(store => store.param.direction);
    const lineName = useAppSelector(store => store.param.line_name);
    const currentStationIndex = useAppSelector(store => store.param.current_stn_idx);
    const stationList = useAppSelector(store => store.param.stn_list);

    const adjMat = adjacencyList(stationList, wideFactor, wideFactor);

    const xShares = useMemo(
        () => {
            console.log('computing x shares');
            return Object.keys(stationList).reduce(
                (acc, cur) => ({ ...acc, [cur]: getXShare(cur, adjMat, branches) }),
                {} as { [stnId: string]: number }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branches.toString(), JSON.stringify(adjMat)]
    );

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

    const yShares = useMemo(
        () => {
            console.log('computing y shares');
            return Object.keys(stationList).reduce((acc, cur) => {
                if (branches[0].includes(cur)) {
                    return { ...acc, [cur]: 0 };
                } else {
                    let branchOfStn = branches.slice(1).filter(branch => branch.includes(cur))[0];
                    if (branchOfStn) {
                        return { ...acc, [cur]: stationList[branchOfStn[0]].children.indexOf(branchOfStn[1]) ? -2 : 2 };
                    } else {
                        return { ...acc, [cur]: 0 };
                    }
                }
            }, {} as { [stnId: string]: number });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: -yShares[cur] * branchSpacing }),
        {} as typeof yShares
    );

    const stnStates = useMemo(
        () => getStnState(currentStationIndex, routes, direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentStationIndex, direction, routes.toString()]
    );

    const linePaths = drawLine(branches, stnStates);
    const paths = (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: linePaths[cur].map(stns => _linePath(stns, xs, ys)),
        }),
        {} as { [key in keyof ReturnType<typeof drawLine>]: string[] }
    );

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
                id="line_name"
                style={{
                    ['--translate-x' as any]:
                        direction === ShortDirection.right ? `${lineXs[0] - 65}px` : `${lineXs[1] + 65}px`,
                }}
            >
                <LineIcon
                    lineName={lineName}
                    foregroundColour={'var(--rmg-theme-fg)' as MonoColour}
                    backgroundColour={'var(--rmg-theme-colour)' as ColourHex}
                />
            </g>
        </g>
    );
};

export default MainGZMTR;

const Line = React.memo(
    (props: { paths: { main: string[]; pass: string[] } }) => (
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
    ),
    (prevProps, nextProps) => JSON.stringify(prevProps.paths) === JSON.stringify(nextProps.paths)
);

const _linePath = (stnIds: string[], realXs: { [stnId: string]: number }, realYs: { [stnId: string]: number }) => {
    let prevY: number;
    var path = [] as string[];

    stnIds.forEach(stnId => {
        let x = realXs[stnId];
        let y = realYs[stnId];
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

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

const StationGroup = (props: StationGroupProps) => {
    const { xs, ys, stnStates } = props;

    const stationList = useAppSelector(store => store.param.stn_list);

    return (
        <g id="stn_icons">
            {Object.keys(stationList)
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .map(stnId => (
                    <g
                        key={stnId}
                        style={{
                            transform: `translate(${xs[stnId]}px,${ys[stnId]}px)`,
                        }}
                    >
                        <StationGZMTR stnId={stnId} stnState={stnStates[stnId]} stnY={ys[stnId]} />
                    </g>
                ))}
        </g>
    );
};
