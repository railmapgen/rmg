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
