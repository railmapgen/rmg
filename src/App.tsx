import * as React from 'react';
import './i18n';
import SVGs from './svgs';
// import SVGs from './svgs';
import Panels from './panels';
import { RMGLine } from './Line/RMGLine';
import { getParams } from './utils';
import { StationInfo } from './types';
import { cpm, getBranches, useTpo, getYShares } from './methods';

export default function App() {
    const [param, setParam] = React.useState(getParams());

    const branches = React.useMemo(() => getBranches(param.stn_list), [JSON.stringify(param.stn_list)]);
    const tpo = useTpo(branches);

    const handleUpdate = (key, data) => {
        setParam(prevParam => ({
            ...prevParam, 
            [key]: data,
        }));
    };

    return (
        <>
            <SVGs myLine={new RMGLine(param)} />
            <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
        </>
    );
}

