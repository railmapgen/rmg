import * as React from 'react';

import { RMGParam } from '../../types';
import { getYReal } from './methods';

import Station from './station';
import { RMGLine } from '../../Line/RMGLine';

interface Props {
    param: RMGParam;
    // myLine: RMGLine;
}

export default (props: Props) => {
    return (
        <g id="main" style={{
            ['--y-percentage' as any]: props.param.y_pc, 
            transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
        }}>

            <g id="stn_icons">
                {Object.keys(props.param.stn_list).map((stnId, i) => {
                    if (['linestart', 'lineend'].includes(stnId)) return;
                    return <Station stnId={stnId}
                        param={props.param}
                        isPass={false} isCurrent={false} 
                        x={i*10} />
                })}
            </g>
        </g>
    )
}