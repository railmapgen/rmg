import { StationInfo } from '../../types';

export const reverseStations = (stnList: { [stnId: string]: StationInfo }) => {
    let newStnList = JSON.parse(JSON.stringify(stnList));
    Object.keys(stnList).forEach(stnId => {
        let stnInfo = {...stnList[stnId]};
        if (stnId === 'linestart') {
            newStnList.lineend.parents = stnInfo.children.reverse();
            newStnList.lineend.branch = {
                left: stnInfo.branch.right,
                right: []
            };
        } else if (stnId === 'lineend') {
            newStnList.linestart.children = stnInfo.parents.reverse();
            newStnList.linestart.branch = {
                left: [],
                right: stnInfo.branch.left
            }
        } else {
            var tmpArr = stnInfo.children.reverse().map(id => {
                switch (id) {
                    case 'linestart': return 'lineend';
                    case 'lineend': return 'linestart';
                    default: return id;
                }
            });
            newStnList[stnId].children = stnInfo.parents.reverse().map(id => {
                switch (id) {
                    case 'linestart': return 'lineend';
                    case 'lineend': return 'linestart';
                    default: return id;
                }
            });
            newStnList[stnId].parents = tmpArr;
            newStnList[stnId].branch.left = stnInfo.branch.right;
            newStnList[stnId].branch.right = stnInfo.branch.left;
        }
    });
    return newStnList;
};