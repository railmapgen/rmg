import * as React from 'react';

import { getYReal } from './methods';

import Station from './station';
import { ParamContext } from '../../context';
import { Stations } from '../../methods';

export default () => {
    const { param } = React.useContext(ParamContext);

    const xs = Stations.getXShares(param.stn_list);
    const ys = Stations.getYShares(param.stn_list);

    return (
        <g id="main" style={{
            ['--y-percentage' as any]: param.y_pc,
            transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
        }}>

            <g id="stn_icons">
                {Object.keys(param.stn_list).map((stnId, i) => {
                    if (['linestart', 'lineend'].includes(stnId)) return;
                    return <g id={stnId} style={{
                        transform: `translate(${xs[stnId]}px,${ys[stnId]}px)`,
                    }}>
                        <Station stnId={stnId}
                            isPass={false} isCurrent={false} />
                    </g>
                })}
            </g>
        </g>
    )
}