import * as React from 'react';
import { InterchangeInfo } from '../../../types';

const LineBox = React.memo(
    (props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) => {
        const nameZHs = props.info[4].match(/[\d]+|[\D]+/g) || [''];
        let intNameSplitOk = false;
        if (nameZHs.length == 2) {
            if (!isNaN(Number(nameZHs[0])) && isNaN(Number(nameZHs[1]))) {
                intNameSplitOk = true;
            }
        }

        return (
            <g textAnchor="middle" fill={props.stnState === -1 ? '#fff' : props.info[3]}>
                <use xlinkHref="#intbox" fill={props.stnState === -1 ? '#aaa' : props.info[2]} />
                <text y={2.5} className="rmg-name__zh rmg-name__gzmtr--int">
                    <tspan fontSize="16px" dominantBaseline="hanging">
                        {intNameSplitOk ? nameZHs[0] : ''}
                    </tspan>
                    <tspan dominantBaseline="hanging" dy={0.5}>
                        {intNameSplitOk ? nameZHs[1] : nameZHs.join('')}
                    </tspan>
                </text>
                <text
                    y={19.5}
                    className={
                        'rmg-name__en ' +
                        (props.info[5].length > 10 ? 'rmg-name__gzmtr--int-small' : 'rmg-name__gzmtr--int')
                    }
                >
                    {props.info[5]}
                </text>
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.info.toString() === nextProps.info.toString() && prevProps.stnState === nextProps.stnState
);

export default LineBox;
