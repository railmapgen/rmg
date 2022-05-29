import { StationDict } from '../../constants/constants';

/**
 * @return - negative: above main line, positive: below main line
 */
export const getStationYShare = (stationId: string, branches: string[][], stationList: StationDict): number => {
    const mainBranch = branches[0];

    if (mainBranch.includes(stationId)) {
        // on main branch
        if (branches.slice(1).find(branch => branch.includes(stationId))) {
            // node shared by multiple branches
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
                // on main branch but open jaw
                // NOTE: determine y share of node by children ordering, not by whether it's a branch or not (like GZMTR)
                // TODO: Remove requirement on stationList arg
                return stationList[openJawSiblingBranch[0]].children.indexOf(openJawSiblingBranch[1]) === 1 ? -1 : 1;
            } else {
                // pure main branch without siblings or main branch with sidings
                return 0;
            }
        }
    } else {
        // on branch/sidings
        const branchBelongsTo = branches.slice(1).find(branch => branch.includes(stationId));
        if (branchBelongsTo) {
            const isSiding = branchBelongsTo[0] !== 'linestart' && branchBelongsTo.slice(-1)[0] !== 'lineend';
            if (isSiding) {
                return stationList[branchBelongsTo[0]].children.indexOf(branchBelongsTo[1]) === 1 ? 1.2 : -1.2;
            } else {
                return stationList[branchBelongsTo[0]].children.indexOf(branchBelongsTo[1]) === 1 ? 1 : -1;
            }
        } else {
            // fallback
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

    let prevCoord: [number, number] | undefined;
    let paths: string[] = [];

    for (let coord of coords) {
        if (!prevCoord) {
            paths.push('M' + coord.join(','));
        } else {
            if (coord[1] === prevCoord[1]) {
                // horizontal
                paths.push('H' + coord[0]);
            } else {
                const midPointX = (coord[0] + prevCoord[0]) / 2 - (prevCoord[1] === 0 ? 0 : TURNING_RADIUS * 2);
                paths.push('H' + midPointX);

                if (coord[1] > prevCoord[1]) {
                    // turn to below
                    paths.push(RIGHT_DOWN_ARC);
                    paths.push('V' + (coord[1] - TURNING_RADIUS));
                    paths.push(DOWN_RIGHT_ARC);
                } else {
                    // turn to above
                    paths.push(RIGHT_UP_ARC);
                    paths.push('V' + (coord[1] + TURNING_RADIUS));
                    paths.push(UP_RIGHT_ARC);
                }

                paths.push('H' + coord[0]);
            }
        }
        // update prev coordinate
        prevCoord = coord;
    }

    return paths.join(' ').replace(/( H([\d.]+))+/g, ' H$2');
};
