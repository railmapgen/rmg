import * as React from 'react';
import './i18n';
// import SVGs from './svgs';
import Panels from './panels';
import { getParams } from './utils';
import { StationInfo } from './types';
import { cpm, getBranches, useTpo, Stations } from './methods';

export default function App() {
    const [param, setParam] = React.useState(getParams());

    let deps = {};
    Object.keys(param.stn_list).forEach(stnId => {
        let { parents, children, branch } = param.stn_list[stnId];
        deps[stnId] = { parents, children, branch };
    });

    const yShares = React.useMemo(() => Stations.getYShares(param.stn_list), [JSON.stringify(deps)]);
    const xShares = React.useMemo(() => Stations.getXShares(param.stn_list), [JSON.stringify(deps)]);

    const branches = React.useMemo(() => getBranches(param.stn_list), [JSON.stringify(deps)]);
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

