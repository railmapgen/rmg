import * as React from 'react';
import './i18n';
// import SVGs from './svgs';
import Panels from './panels';
import { getParams } from './utils';
import { StationInfo } from './types';

/**
 * Memo of all branches (支線段) of the line (both ends included). The first branch must be the main line. 
 * @example MTREastRailLine.branches
 * /*
 * [0]: [LineStart, Lo Wu, ..., Hung Hom, LineEnd]
 * [1]: [LineStart, Lok Ma Chau, Sheung Shui]
 * [2]: [University, Racecourse, Sha Tin]
 * /
 */
const useBranches = (stnList: {[stnId: string]: StationInfo}) => React.useMemo(() => {
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
                        branches.push([curId]);
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                        }
                    }
                    curId = children.filter(stnId => stnId != branchNextId)[0];
                    break;
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch.left[1]) {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
}, [stnList]);

/**
 * Memo of topological ordering for all stations by stacking all branches into an one-dimensional array. 
 * @param branches Branches from `useBranches` memo
 */
const useTpo = (branches: string[][]) => React.useMemo(() => {
    if (branches.length === 1) return branches[0].slice(1,-1);
    return branches.reduce((acc, cur) => {
        let idx = acc.indexOf(cur.slice(-1)[0]);
        return acc
            .slice(0,idx)
            .concat(cur.slice(1), acc.slice(idx+1));
    }, ['lineend']).slice(0,-1);
}, [branches]);

export default function App() {
    const [param, setParam] = React.useState(getParams());

    const branches = useBranches(param.stn_list);
    const tpo = useTpo(branches);

    const handleUpdate = (key, data) => {
        setParam(prevParam => ({
            ...prevParam, 
            [key]: data,
        }));
    };

    return (
        // <React.Suspense fallback="loading">
        <>
            {/* <SVGs param={param}/> */}
            <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
        </>
        // </React.Suspense>
    );
}

