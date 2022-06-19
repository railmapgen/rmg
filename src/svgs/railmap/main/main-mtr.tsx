import React, { useMemo } from 'react';
import { adjacencyList, criticalPathMethod, getStnState, getXShareMTR } from '../methods/share';
import { leftWideFactor, rightWideFactor, StationsMTR } from '../methods/mtr';
import { CanvasType, RMGParam } from '../../../constants/constants';
import { useRootSelector } from '../../../redux';
import Station from '../../mtr/station/station';
import { getStationYShare } from '../../mtr/line-diagram-utils';

const getNamePos = (stnId: string, branches: string[][], { isStagger, isFlip }: RMGParam['namePosMTR']) => {
    if (!isStagger) return isFlip;
    let res: number;
    if (branches[0].includes(stnId)) {
        res = branches[0].indexOf(stnId) % 2;
    } else {
        let branchOfStn = branches.filter(branch => branch.includes(stnId))[0];
        res = (branches[0].indexOf(branchOfStn[0]) + branchOfStn.indexOf(stnId) + 1) % 2;
    }
    return res === 0 ? isFlip : !isFlip;
};

const MainMTR = () => {
    const { branches, routes, depsStr: deps } = useRootSelector(store => store.helper);

    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const yPercentage = useRootSelector(store => store.param.y_pc);
    const paddingPercentage = useRootSelector(store => store.param.padding);
    const branchSpacing = useRootSelector(store => store.param.branch_spacing);
    const direction = useRootSelector(store => store.param.direction);
    const namePosition = useRootSelector(store => store.param.namePosMTR);

    const currentStationIndex = useRootSelector(store => store.param.current_stn_idx);
    const stationList = useRootSelector(store => store.param.stn_list);

    const adjMat = adjacencyList(stationList, leftWideFactor, rightWideFactor);

    const criticalPath = useMemo(
        () => criticalPathMethod('linestart', 'lineend', adjMat),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(adjMat)]
    );
    const realCP = useMemo(
        () => criticalPathMethod(criticalPath.nodes[1], criticalPath.nodes.slice(-2)[0], adjMat),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(adjMat)]
    );

    const xShares = useMemo(
        () => {
            console.log('computing x shares');
            return Object.keys(stationList).reduce(
                (acc, cur) => ({ ...acc, [cur]: getXShareMTR(cur, adjMat, branches) }),
                {} as { [stnId: string]: number }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branches.toString(), JSON.stringify(adjMat)]
    );
    const lineXs: [number, number] = [
        (svgWidths[CanvasType.RailMap] * paddingPercentage) / 100,
        svgWidths[CanvasType.RailMap] * (1 - paddingPercentage / 100),
    ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const ys = useMemo(
        () =>
            Object.keys(stationList).reduce<Record<string, number>>(
                (acc, cur) => ({
                    ...acc,
                    [cur]: getStationYShare(cur, branches, stationList) * branchSpacing,
                }),
                {}
            ),
        [deps, branchSpacing]
    );

    const stnStates = useMemo(
        () => getStnState(currentStationIndex, routes, direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentStationIndex, direction, routes.toString()]
    );

    const namePoss = Object.keys(stationList).reduce<{ [stnId: string]: boolean }>(
        (acc, id) => ({ ...acc, [id]: getNamePos(id, branches, namePosition) }),
        {}
    );

    const linePaths = StationsMTR.drawLine(
        branches,
        stnStates,
        stationList,
        lineXs,
        xs,
        ys,
        branchSpacing,
        criticalPath
    );

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: yPercentage,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        >
            <Lines paths={linePaths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} namePoss={namePoss} />
        </g>
    );
};

export default MainMTR;

const Lines = React.memo(
    (props: { paths: { main: string[]; pass: string[]; sidingMain: string[]; sidingPass: string[] } }) => {
        return (
            <g fill="none" strokeWidth={9.68}>
                <g stroke="var(--rmg-grey)">
                    {props.paths.pass.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                    {props.paths.sidingPass.map((path, i) => (
                        <path key={i} d={path} strokeDasharray={path.match(/a/g)?.length === 4 ? '10 4' : undefined} />
                    ))}
                </g>

                <g stroke="var(--rmg-theme-colour)">
                    {props.paths.main.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                    {props.paths.sidingMain.map((path, i) => (
                        <path key={i} d={path} strokeDasharray={path.match(/a/g)?.length === 4 ? '10 4' : undefined} />
                    ))}
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.paths) === JSON.stringify(nextProps.paths)
);

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
    namePoss: { [stnId: string]: boolean };
}

const StationGroup = (props: StationGroupProps) => {
    const { xs, ys, stnStates, namePoss } = props;

    const stationList = useRootSelector(store => store.param.stn_list);

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
                        <Station stationId={stnId} stationState={stnStates[stnId]} isReversed={namePoss[stnId]} />
                    </g>
                ))}
        </g>
    );
};
