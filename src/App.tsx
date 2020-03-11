import * as React from 'react';
import './i18n';
import SVGs from './svgs';
// import SVGs from './svgs';
import Panels from './panels';
import { RMGLine } from './Line/RMGLine';
import { getParams } from './utils';
import { getBranches, useTpo, getRoutes } from './methods';
import { ParamContext, paramReducer } from './context';

export default function App() {
    // const [param, setParam] = React.useState(getParams());
    const [param, dispatch] = React.useReducer(paramReducer, getParams());

    let deps = {};
    Object.keys(param.stn_list).forEach(stnId => {
        let { parents, children, branch } = param.stn_list[stnId];
        deps[stnId] = { parents, children, branch };
    });

    const branches = React.useMemo(() => getBranches(param.stn_list), [JSON.stringify(deps)]);
    const routes = React.useMemo(() => getRoutes(param.stn_list), [JSON.stringify(deps)]);
    const tpo = useTpo(branches);

    const handleUpdate = (key, data) => dispatch({ type: 'ANY', key, data });

    return (
        // <React.Suspense fallback="loading">
        <ParamContext.Provider value={{
            param,
            dispatch, 
            branches, 
            routes,
        }}>
            <SVGs />
            <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
        </ParamContext.Provider>
        // </React.Suspense>
    );
}

