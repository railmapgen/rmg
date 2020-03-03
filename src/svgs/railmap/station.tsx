import * as React from 'react';
import { StationInfo, RMGParam } from '../../types';
import { getYReal } from './methods';
import { RMGLine } from '../../Line/RMGLine';

interface Props {
    stnId: string;
    param: RMGParam;
    // myLine: RMGLine;
    isPass: boolean;
    isCurrent: boolean;
    x: number;
}

export default (props: Props) => {
    /**
     * Top (in pixels) of station's Chinese name. 
     */
    const NAME_ZH_TOP = -10.8125;
    /**
     * Height (in pixels) of station's Chinese name.
     */
    const NAME_ZH_HEIGHT = 21.625;
    /**
     * Top (in pixels) of station's English name (1 line).
     */
    const NAME_EN_TOP = -8;
    /**
     * Height (in pixels) of station's English name (1 line).
     */
    const NAME_EN_HEIGHT = 13.21875;
    /**
     * Difference of `y`s of station's Chinese name and English name (1 line). (This number should used as the `dy` of the English `text` element after Chinese `text` elements. )
     */
    const NAME_ZH_EN_GAP = 17;
    /**
     * Height (in pixels) from the top of station's Chinese name to the bottom of English name (1 line).
     */
    const NAME_FULL_HEIGHT = -NAME_ZH_TOP + NAME_ZH_EN_GAP + NAME_EN_HEIGHT + NAME_EN_TOP;
    /**
     * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name. 
     */
    const STN_NAME_LINE_GAP = 14;

    const myLine = new RMGLine(props.param);

    const x = React.useMemo(
        () => myLine._stnRealX(props.stnId), 
        [props.param.padding, props.param.svg_width, JSON.stringify(props.param.stn_list)])
    const y = React.useMemo(() => myLine._stnRealY(props.stnId), [props.param.branch_spacing, JSON.stringify(props.param.stn_list)]);

    return (
        <g id={props.stnId} style={{
            transform: `translate(${x}px,${y}px)`,
        }}>
            {props.isCurrent && <rect id="current_bg" x="0" y="0" width="100" height="20"/>}

            <use xlinkHref="#stn_hk"
                className={props.isPass ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future'} />
            <g id="stn_name" textAnchor="middle" transform="translate(0,20)"
                className={`Name ${props.isPass ? 'Pass' : (props.isCurrent ? 'Current' : 'Future')}`}>
                <text className='rmg-name__zh rmg-name__mtr--station'>{props.param.stn_list[props.stnId].name[0]}</text>
            </g>
        </g>
    )
}