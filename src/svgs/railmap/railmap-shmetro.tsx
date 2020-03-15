import * as React from 'react';
import { ParamContext } from '../../context';
import MainSHMetro from './main/main-shmetro';

const RailMapSHMetro = (props: React.SVGProps<SVGSVGElement>) => {
    const { param } = React.useContext(ParamContext);
    return (
        <svg {...props}>
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
