import * as React from 'react';
import { RMGParam } from '../types';

import Strip from './strip';

interface Props {
    param: RMGParam;
}

export default (props: Props) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="destination"
            style={{
                width: 'var(--rmg-svg-width)', 
                height: 'var(--rmg-svg-height)', 
                ['--rmg-svg-width' as any]: props.param.svg_dest_width + 'px', 
                ['--rmg-svg-height' as any]: props.param.svg_height + 'px', 
                ['--rmg-theme-colour' as any]: props.param.theme[2], 
            }} >

            <rect id="outer" x="0" y="0"/>
            <Strip stripPc={props.param.strip_pc} />

            <g id="dest_name">
                <use xlinkHref="#arrow"/>
                <g id="platform">
                    <circle cx="0" cy="0" r="75"/>
                    <text className="rmg-name__zh" dy="0"></text>
                </g>
                <g>
                    <text className="rmg-name__zh" fontSize="90px">往</text>
                    <text className="rmg-name__en" fontSize="45px" dy="80">to</text>
                </g>
            </g>

        </svg>
    )
}