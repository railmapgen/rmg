import React, { useContext, useMemo } from 'react';
import { ParamContext } from '../../../context';
import { adjacencyList, criticalPathMethod, getXShareMTR } from '../methods/share';
import { StationDict } from '../../../constants/constants';

const MainTemplate = () => {
    const { param, branches } = useContext(ParamContext);

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
                (acc, cur) => ({ ...acc, [cur]: getXShare(cur, adjMat, branches) }),
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

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: param.y_pc,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        ></g>
    );
};

export default MainTemplate;

const leftWideFactor = (stnList: StationDict, stnId: string) => 1;
const rightWideFactor = (stnList: StationDict, stnId: string) => 1;

const getXShare = getXShareMTR;
