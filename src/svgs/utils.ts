import { StationInfo } from "../types";
import * as React from "react";

interface StationDict {
    [stnId: string]: StationInfo;
}


/**
 * Getter of routes (行車交路) of the line. The first route must be the main line. 
 */
export const routes = (stnList: StationDict) => React.useMemo(() => {
    var stack = ['linestart'];
    var branches = [['linestart']];
    var branchCount = 0;
    
    while (stack.length) {
        var curId = stack.shift();
        var prevId = branches[branchCount].slice().reverse()[0] || null;
        if (prevId && curId !== 'linestart') {
            branches[branchCount].push(curId);
        } else {
            branches[branchCount] = [curId];
        }
        while (curId !== 'lineend') {
            prevId = curId;
            var children = stnList[prevId].children;
            switch (children.length) {
                case 1:
                    curId = children[0];
                    break;
                case 2:
                    var branchNextId = stnList[prevId].branch.right[1];
                    // if (branchCount === 0) {
                    if (stnList[prevId].branch.right[0] === 'through') {
                        branches.push(branches[branchCount].slice());
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                        }
                        // branches.push([prevId]);
                    }
                        // stack.push(branchNextId);
                    // }
                    curId = children.filter(stnId => stnId != branchNextId)[0];
                    break;
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch.left[1] && stnList[curId].branch.left[0] === 'nonthrough') {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
}, [stnList]);

/**
 * Outdegree of a station node. 
 */
export const _stnOutdegree = (stnId: string, stnList: StationDict) => (
    stnList[stnId].children.length
);

/**
 * Indegree of a station node.
 */
export const _stnIndegree = (stnId: string, stnList: StationDict) => (
    stnList[stnId].parents.length
);
