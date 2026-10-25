// 线路图几何与拓扑算法：上海地铁共线工具。
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
 * 返回 `ColineInfo` 中 `from` 到 `to` 的全部车站，并保留共线颜色。
 */
export const calculateColineStations = (colineInfoList: ColineInfo[], branches: string[][]) =>
    colineInfoList
        .map(coLine => {
            const involvedBranches = branches.filter(
                branch => branch.includes(coLine.from) && branch.includes(coLine.to)
            );

            // 当前共线信息跨越两条独立支线，
            // 这在当前设计中不应出现。
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
 * 按主线与经过线的顺序返回共线车站区段。
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
