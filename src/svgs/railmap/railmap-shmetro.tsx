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
        <path id="express_sh" fill="#fff" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V25 a 5,5 0 1 1 -10,0Z" />
        <path id="direct_sh" fill="#fff" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V50 a 5,5 0 1 1 -10,0Z" />

        <rect id="intbox_number" height={22} width={20} y={-11} />

        <g id="intbox_maglev">
            <rect id="maglev_5" height="140" width="130" y="40" x="30" strokeWidth={10}/>
            <path id="maglev_3" fill="white" d="m90,55a40,5 0 0 0 -40,3a5,5 0 0 0 -5,5a5,60 0 0 0 -3,60a5,5 0 0 0 5,5l96,0a5,5 0 0 0 5,-5a5,60 0 0 0 -3,-60a5,5 0 0 0 -5,-5a40,5 0 0 0 -40,-3l-5,-10l-5,10"/>
            <path id="maglev_4" fill="white" d="m90,140l-40,0a10,5 0 0 1 -10,-5l0,25a10,15 0 0 0 10,15l15,0l0,-10l-15,0l0,-15l90,0l0,15l-15,0l0,10l15,0a10,15 0 0 0 10,-15l0,-25a10,5 0 0 1 -10,5l-50,0"/>
            <rect id="maglev_1" height="25" width="40" y="80" x="50"/>
            <rect id="maglev_2" height="25" width="40" y="80" x="100" />
        </g>

        {/* An extension of the line/path. Remember to minus the stroke-width.  */}
        <marker id="arrow_gray" viewBox="-1.5 0 3 1.5" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="gray" />
        </marker>
        <marker id="arrow_theme_left" refX={1} refY={0.5}>
            <path d="M1,0L0,1H1z" fill="var(--rmg-theme-colour)" />
        </marker>
        <marker id="arrow_theme_right" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
        </marker>

        {/* Contrast filters for lines */}
        <filter id="contrast-direct" filterUnits="userSpaceOnUse">
            <feComponentTransfer>
                <feFuncR type="linear" slope={0.5} intercept={0.25} />
                <feFuncG type="linear" slope={0.5} intercept={0.25} />
                <feFuncB type="linear" slope={0.5} intercept={0.25} />
            </feComponentTransfer>
        </filter>
        <filter id="contrast-express" filterUnits="userSpaceOnUse">
            <feComponentTransfer>
                <feFuncR type="linear" slope={0.75} intercept={0.125} />
                <feFuncG type="linear" slope={0.75} intercept={0.125} />
                <feFuncB type="linear" slope={0.75} intercept={0.125} />
            </feComponentTransfer>
        </filter>
    </defs>
));
