import React, { useMemo } from 'react';
import { ParamContext } from '../../../context';
import { adjacencyList, criticalPathMethod, getXShareMTR, getStnState } from '../methods/share';
import { StationsMTR } from '../methods/mtr';
import StationMTR from './station/station-mtr';
import { RMGParam, StationDict } from '../../../constants/constants';

const leftWideFactor = (stnList: StationDict, stnId: string) => {
    var res = 0;
    let { transfer } = stnList[stnId];
    let ls = transfer.info.map(val => val.length);
    if (transfer.tick_direc === 'l') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.8;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        // osi22 not end
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'l' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    // if (type === 'osi22') res += 0.8;
    if (stnList[stnId].parents.length === 2) res += 0.4;
    if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 0.4;
    return res;
};

const rightWideFactor = (stnList: StationDict, stnId: string) => {
    var res = 0;
    let { transfer } = stnList[stnId];
    let ls = transfer.info.map(val => val.length);
    if (transfer.tick_direc === 'r') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.8;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'r' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    // if (type === 'osi22') res += 0.8;
    if (stnList[stnId].children.length === 2) res += 0.4;
    if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 0.4;
    return res;
};

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
    const { param, branches, routes, deps } = React.useContext(ParamContext);

    const adjMat = adjacencyList(param.stn_list, leftWideFactor, rightWideFactor);

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
            return Object.keys(param.stn_list).reduce(
                (acc, cur) => ({ ...acc, [cur]: getXShareMTR(cur, adjMat, branches) }),
                {} as { [stnId: string]: number }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branches.toString(), JSON.stringify(adjMat)]
    );
    const lineXs: [number, number] = [
        (param.svgWidth.railmap * param.padding) / 100,
        param.svgWidth.railmap * (1 - param.padding / 100),
    ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const yShares = useMemo(
        () => StationsMTR.getYShares(param.stn_list, branches),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]:
                -yShares[cur] * param.branch_spacing +
                (branches[0].includes(cur) ? 0 : yShares[cur] > 0 ? -9.68 : 9.68),
        }),
        {} as typeof yShares
    );

    const stnStates = useMemo(
        () => getStnState(param.current_stn_idx, routes, param.direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.current_stn_idx, param.direction, routes.toString()]
    );

    const namePoss = Object.keys(param.stn_list).reduce(
        (acc, id) => ({ ...acc, [id]: getNamePos(id, branches, param.namePosMTR) }),
        {} as { [stnId: string]: boolean }
    );

    const linePaths = StationsMTR.drawLine(
        branches,
        stnStates,
        param.stn_list,
        lineXs,
        xs,
        ys,
        param.branch_spacing,
        criticalPath
    );

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: param.y_pc,
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
    (props: { paths: { main: string[]; pass: string[] } }) => {
        return (
            <g fill="none" strokeWidth={9.68}>
                <g stroke="var(--rmg-grey)">
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

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
    namePoss: { [stnId: string]: boolean };
}

const StationGroup = (props: StationGroupProps) => {
    const { param } = React.useContext(ParamContext);

    return (
        <g id="stn_icons">
            {Object.keys(param.stn_list)
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .map(stnId => (
                    <g
                        key={stnId}
                        style={{
                            transform: `translate(${props.xs[stnId]}px,${props.ys[stnId]}px)`,
                        }}
                    >
                        <StationMTR stnId={stnId} stnState={props.stnStates[stnId]} namePos={props.namePoss[stnId]} />
                    </g>
                ))}
        </g>
    );
};
