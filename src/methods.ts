import { StationDict } from './constants/constants';

/**
 * Vertical position (in shares) of station icon if using MTR style (for consistency of method `RMGLine.newStnPossibleLoc()`).
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
        // parent exist
        if (stnList[stnPred].children.length === 1) {
            // no sibling, then y same as parent
            return getYShareMTR(stnPred, stnList);
        } else {
            // sibling exists, then y depends on its idx of being children
            return stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
        }
    } else {
        // no parent, must be linestart
        return 0;
    }
};
