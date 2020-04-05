import * as React from 'react';
import MainSHMetro from './main/main-shmetro';

const RailMapSHMetro = React.memo(() => (
    <>
        <DefsSHMetro />

        <MainSHMetro />
    </>
));

export default RailMapSHMetro;

const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_sh" fill="#fff" strokeWidth={2} r={5} />
        <path id="int2_sh" fill="#fff" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z" />

        <rect id="intbox_number" height={22} width={20} y={-11} />
    </defs>
));
