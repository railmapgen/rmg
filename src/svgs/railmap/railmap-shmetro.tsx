import * as React from 'react';
import { ParamContext } from '../../context';
import MainSHMetro from './main/main-shmetro';

const RailMapSHMetro = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <svg
            id="railmap"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{
                width: 'var(--rmg-svg-width)',
                height: 'var(--rmg-svg-height)',
                ['--rmg-svg-width' as any]: param.svg_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
            }}
        >
            <DefsSHMetro />
            <rect id="outer" x={0} y={0} />

            <MainSHMetro />
        </svg>
    );
};

export default RailMapSHMetro;

const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_sh" fill="#fff" stroke="var(--rmg-theme-colour)" strokeWidth={2} r={5} />
        <circle id="stn_sh_pass" fill="#fff" stroke="#aaa" strokeWidth={2} r={5} />
        <path
            id="int2_sh"
            fill="#fff"
            stroke="var(--rmg-theme-colour)"
            strokeWidth={2}
            d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"
        />
        <path
            id="int2_sh_pass"
            fill="#fff"
            stroke="#aaa"
            strokeWidth={2}
            d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"
        />
        <rect id="int_sh_number" height={30} width={20} />
        <rect id="int_sh_letter" height={30} width={60} />
    </defs>
));
