import * as React from 'react';
import { RMGParam } from '../../types';


import Strip from '../strip';
import Main from './main';
import { RMGLine } from '../../Line/RMGLine';

interface Props {
    // param: RMGParam;
    myLine: RMGLine;
}

export default (props: Props) => {
    return (
        <svg id="destination"
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{
                width: 'var(--rmg-svg-width)', 
                height: 'var(--rmg-svg-height)', 
                ['--rmg-svg-width' as any]: props.myLine.param.svg_width + 'px', 
                ['--rmg-svg-height' as any]: props.myLine.param.svg_height + 'px', 
                ['--rmg-theme-colour' as any]: props.myLine.param.theme[2], 
            }} >

            <defs>
                <circle id="stn_hk" r="8" className="rmg-stn__mtr"/>
            </defs>

            <rect id="outer" x="0" y="0"/>
            <Strip stripPc={props.myLine.param.strip_pc} />

            <Main {...props} />

        </svg>
    )
}