import { CanvasType } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { useMemo } from 'react';
import StationGroup from './station-group';
import { getLineXs, getLoopPath, getStationStates } from './loop-utils';

export default function LoopMain() {
    const { branches } = useRootSelector(store => store.helper);

    const {
        svgWidth: svgWidths,
        svg_height: svgH,
        y_pc: yPercentage,
        padding: paddingPercentage,
        branchSpacingPct,
        current_stn_idx: currentStation,
        loop_info: { midpoint_station: midpointStation, clockwise },
    } = useRootSelector(store => store.param);

    const stationsInScope = branches[0].slice(1, -1);
    const halfStationCount = Math.ceil(stationsInScope.length / 2);

    const xShares = useMemo(() => {
        console.log('computing x shares');
        return stationsInScope.reduce<Record<string, number>>((acc, cur, idx, arr) => {
            let share: number;
            if (idx < halfStationCount) {
                share = halfStationCount - idx - 1;
            } else {
                share = idx - halfStationCount;
                if (arr.length & 1) {
                    share += 0.5;
                }
            }
            return { ...acc, [cur]: share };
        }, {});
    }, [stationsInScope.toString()]);

    const yGap = (branchSpacingPct * svgH * 2) / 100;
    const lineXs = getLineXs(svgWidths[CanvasType.RailMap], paddingPercentage, halfStationCount, yGap);
    const xMultiplier = (lineXs[1] - lineXs[0]) / (halfStationCount - 1);
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: lineXs[0] + xShares[cur] * xMultiplier,
        }),
        {} as typeof xShares
    );

    const yShares = useMemo(() => {
        console.log('computing y shares');
        return stationsInScope.reduce<Record<string, number>>((acc, cur, idx) => {
            return { ...acc, [cur]: idx < halfStationCount ? 1 : -1 };
        }, {});
    }, [stationsInScope.toString()]);
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: (-yShares[cur] * yGap) / 2 }),
        {} as typeof yShares
    );

    const stnStates = getStationStates(stationsInScope, clockwise ?? false, currentStation, midpointStation);

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: yPercentage,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        >
            <path d={getLoopPath(xs, ys, xMultiplier)} fill="none" strokeWidth={6} stroke="var(--rmg-theme-colour)" />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
        </g>
    );
}
