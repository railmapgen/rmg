// 港铁样式辅助计算：根据拓扑关系估算车站图形的纵向位置。
import { StationDict } from './constants/constants';

/**
 * 港铁样式中车站图标的纵向份额，与 `RMGLine.newStnPossibleLoc()` 的布局规则保持一致。
 */
export const getYShareMTR = (stnId: string, stnList: StationDict): -1 | 0 | 1 => {
    if (
        ['linestart', 'lineend'].includes(stnId) ||
        stnList[stnId].parents.length > 1 ||
        stnList[stnId].children.length > 1
    ) {
        return 0;
    }
    const stnPred = stnList[stnId].parents[0];
    if (stnPred) {
        // 存在父车站
        if (stnList[stnPred].children.length === 1) {
            // 没有同级车站时，纵向位置与父车站相同
            return getYShareMTR(stnPred, stnList);
        } else {
            // 存在同级车站时，纵向位置取决于它在子车站中的索引
            return stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
        }
    } else {
        // 没有父车站时，该节点必须是线路起点
        return 0;
    }
};
