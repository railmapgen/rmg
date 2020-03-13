import * as React from 'react';
import './i18n';
import SVGs from './svgs';
// import SVGs from './svgs';
import Panels from './panels';
import { getParams } from './utils';
import { getBranches, useTpo, getRoutes } from './methods';
import { ParamContext, paramReducer } from './context';

export default function App() {
    // const [param, setParam] = React.useState(getParams());
    const [param, dispatch] = React.useReducer(paramReducer, getParams());

    const deps = Object.keys(param.stn_list).reduce(
        (acc, cur) =>
            acc +
            cur +
            ((...k) => o => k.reduce((a, c) => a + JSON.stringify(o[c]), ''))(
                'parents',
                'children',
                'branch'
            )(param.stn_list[cur]),
        ''
    );

    const branches = React.useMemo(() => getBranches(param.stn_list), [deps]);
    const routes = React.useMemo(() => getRoutes(param.stn_list), [deps]);
    const tpo = useTpo(branches);

    const handleUpdate = (key, data) => dispatch({ type: 'ANY', key, data });

    return (
        // <React.Suspense fallback="loading">
        <ParamContext.Provider
            value={{
                param,
                dispatch,
                branches,
                routes,
                deps,
            }}
        >
            <SVGs />
            <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
        </ParamContext.Provider>
        // </React.Suspense>
    );
}
