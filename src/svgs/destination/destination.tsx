import * as React from 'react';

import { ParamContext } from '../../context';
import StripMTR from '../strip/strip-mtr';
import InfoMTR from './info-mtr';

const Destination = () => {
    const { param } = React.useContext(ParamContext);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="destination"
            style={{
                width: 'var(--rmg-svg-width)',
                height: 'var(--rmg-svg-height)',
                ['--rmg-svg-width' as any]: param.svg_dest_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
            }} >

            <DefsMTR />

            <rect id="outer" x={0} y={0} />

            {window.urlParams.get('style') === 'mtr' && <StripMTR stripPc={param.strip_pc} />}

            <InfoMTR />

        </svg>
    )
};

export default Destination;

const DefsMTR = React.memo(() => (
    <defs>
        <path id="arrow" d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z" fill="var(--rmg-black,#000)" />
    </defs>
));