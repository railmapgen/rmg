// 港铁 SVG 画布：线路图布局工具。
import { StationDict } from '../../constants/constants';

/**
 * @return - negative: above main line, positive: below main line
 */
export const getStationYShare = (stationId: string, branches: string[][], stationList: StationDict): number => {
    const mainBranch = branches[0];

    if (mainBranch.includes(stationId)) {
        // 位于主线
        if (branches.slice(1).find(branch => branch.includes(stationId))) {
            // 多条支线共享的节点
            return 0;
        } else {
            const openJawSiblingBranch = branches.slice(1).find(branch => {
                const isLeftOpenJaw = branch[0] === 'linestart';
                const hasSiblingBranchOpenJawOnTheLeft =
                    mainBranch.indexOf(stationId) < mainBranch.indexOf(branch.slice(-1)[0]);

                const isRightOpenJaw = branch.slice(-1)[0] === 'lineend';
                const hasSiblingBranchOpenJawOnTheRight = mainBranch.indexOf(stationId) > mainBranch.indexOf(branch[0]);

                return (
                    (isLeftOpenJaw && hasSiblingBranchOpenJawOnTheLeft) ||
                    (isRightOpenJaw && hasSiblingBranchOpenJawOnTheRight)
                );
            });

            if (openJawSiblingBranch) {
                // 位于主线但属于开口支线
                // 注意：依据子站顺序确定节点纵向份额，不依据是否为支线（与广州地铁样式不同）
                // 待办：移除对 `stationList` 参数的依赖
                return stationList[openJawSiblingBranch[0]].children.indexOf(openJawSiblingBranch[1]) === 1 ? -1 : 1;
            } else {
                // 无同级站点的纯主线，或带侧线的主线
                return 0;
            }
        }
    } else {
        // 位于支线或侧线上
        const branchBelongsTo = branches.slice(1).find(branch => branch.includes(stationId));
        if (branchBelongsTo) {
            const isSiding = branchBelongsTo[0] !== 'linestart' && branchBelongsTo.slice(-1)[0] !== 'lineend';
            if (isSiding) {
                return stationList[branchBelongsTo[0]].children.indexOf(branchBelongsTo[1]) === 1 ? 1.2 : -1.2;
            } else {
                return stationList[branchBelongsTo[0]].children.indexOf(branchBelongsTo[1]) === 1 ? 1 : -1;
            }
        } else {
            // 回退方案
            return 0;
        }
    }
};

export const getSidingPath = (coords: [number, number][]): string => {
    const TURNING_RADIUS = 6;
    const RIGHT_DOWN_ARC = `a${TURNING_RADIUS},${TURNING_RADIUS},0,0,1,${TURNING_RADIUS},${TURNING_RADIUS}`;
    const DOWN_RIGHT_ARC = `a${TURNING_RADIUS},${TURNING_RADIUS},0,0,0,${TURNING_RADIUS},${TURNING_RADIUS}`;
    const RIGHT_UP_ARC = `a${TURNING_RADIUS},${TURNING_RADIUS},0,0,0,${TURNING_RADIUS},-${TURNING_RADIUS}`;
    const UP_RIGHT_ARC = `a${TURNING_RADIUS},${TURNING_RADIUS},0,0,1,${TURNING_RADIUS},-${TURNING_RADIUS}`;

    let prevCoord: [number, number] | undefined = undefined;
    const paths: string[] = [];

    for (const coord of coords) {
        if (!prevCoord) {
            paths.push('M' + coord.join(','));
        } else {
            if (coord[1] === prevCoord[1]) {
                // 水平方向
                paths.push('H' + coord[0]);
            } else {
                const midPointX = (coord[0] + prevCoord[0]) / 2 - (prevCoord[1] === 0 ? 0 : TURNING_RADIUS * 2);
                paths.push('H' + midPointX);

                if (coord[1] > prevCoord[1]) {
                    // 转向线路之下
                    paths.push(RIGHT_DOWN_ARC);
                    paths.push('V' + (coord[1] - TURNING_RADIUS));
                    paths.push(DOWN_RIGHT_ARC);
                } else {
                    // 转向线路之上
                    paths.push(RIGHT_UP_ARC);
                    paths.push('V' + (coord[1] + TURNING_RADIUS));
                    paths.push(UP_RIGHT_ARC);
                }

                paths.push('H' + coord[0]);
            }
        }
        // 更新上一坐标
        prevCoord = coord;
    }

    return paths.join(' ').replace(/( H([\d.]+))+/g, ' H$2');
};
