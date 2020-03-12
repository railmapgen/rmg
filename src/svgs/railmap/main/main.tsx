import * as React from 'react';

import { ParamContext } from '../../../context';
import MainMTR from './main-mtr';
import MainGZMTR from './main-gzmtr';

const Main = () => {
    const { param } = React.useContext(ParamContext);

    return (
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: param.y_pc,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        >
            {window.urlParams.get('style') === 'mtr' && <MainMTR />}
            {window.urlParams.get('style') === 'gzmtr' && <MainGZMTR />}
        </g>
    );
};

export default Main;
