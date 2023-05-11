import { ColineColours, ColineInfo } from '../../constants/constants';
import { drawLine } from './share';

export interface ColineLinePath {
    main: {
        linePath: string[];
        colors: ColineColours[];
    }[];
    pass: {
        linePath: string[];
        colors: ColineColours[];
    }[];
}

/**
 * Return all stations from ColineInfo's `from` and `to` with coline color preserved.
 */
export const calculateColineStations = (colineInfoList: ColineInfo[], branches: string[][]) =>
    colineInfoList
        .map(coLine => {
            const involvedBranches = branches.filter(
                branch => branch.includes(coLine.from) && branch.includes(coLine.to)
            );

            // the current coLineInfo fall on two separate branches,
            // which should not be possible in current design.
            if (involvedBranches.length !== 1) return { linePath: [], colors: coLine.colors };

            const branch = involvedBranches.flat();
            const a = branch.indexOf(coLine.from);
            const b = branch.indexOf(coLine.to);
            const linePath = a < b ? branch.slice(a, b + 1) : branch.slice(b, a + 1);
            return {
                linePath: linePath,
                colors: coLine.colors,
            };
        })
        .filter(branchWithColine => branchWithColine.linePath.length !== 0);

/**
 * Return coline segments with stations in main/pass order.
 */
export const calculateColine = (
    branchWithColine: ReturnType<typeof calculateColineStations>,
    stnStates: {
        [stnId: string]: 0 | 1 | -1;
    }
) =>
    branchWithColine
        .map(branchWithColine => {
            const linePaths = drawLine(branchWithColine.linePath, stnStates);
            return {
                main: [
                    {
                        linePath: linePaths.main,
                        colors: branchWithColine.colors,
                    },
                ],
                pass: [
                    {
                        linePath: linePaths.pass,
                        colors: branchWithColine.colors,
                    },
                ],
            };
        })
        // .map(branchWithColine =>
        //     (
        //         Object.entries(drawLine(branchWithColine.linePath, stnStates)) as [
        //             keyof ReturnType<typeof drawLine>,
        //             string[]
        //         ][]
        //     )
        //         .map(([type, linePath]) => ({ [type]: { linePath: linePath, colors: branchWithColine.colors } }))
        //         .reduce((acc, cur) => ({ ...acc, ...cur }), { main: [], pass: [] } as ColineLinePath)
        // )
        .reduce(
            (acc, cur) => {
                acc.main = [...acc.main, ...cur.main];
                acc.pass = [...acc.pass, ...cur.pass];
                return acc;
            },
            { main: [], pass: [] } as ColineLinePath
        );
