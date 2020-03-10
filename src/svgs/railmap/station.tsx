import * as React from 'react';
import { ParamContext } from '../../context';

interface Props {
    stnId: string;
    isPass: boolean;
    isCurrent: boolean;
}

export default (props: Props) => {
    const { param } = React.useContext(ParamContext);
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

    return (
        <>
            {props.isCurrent && <rect id="current_bg" x="0" y="0" width="100" height="20" />}

            <use xlinkHref="#stn_hk"
                className={props.isPass ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future'} />
            <g id="stn_name" textAnchor="middle" transform="translate(0,20)"
                className={`Name ${props.isPass ? 'Pass' : (props.isCurrent ? 'Current' : 'Future')}`}>
                <text className='rmg-name__zh rmg-name__mtr--station'>{param.stn_list[props.stnId].name[0]}</text>
            </g>
        </>
    )
}