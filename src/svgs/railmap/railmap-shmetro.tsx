import * as React from 'react';
import MainSHMetro, { DirectionElements } from './main/main-shmetro';
import LoopSHMetro from './main/loop/loop-shmetro';
import { useAppSelector } from '../../redux';

const RailMapSHMetro = React.memo(() => {
    const { loop } = useAppSelector(store => store.param);
    return (
        <>
            <DefsSHMetro />

            {loop ? <LoopSHMetro bank_angle={true} /> : <MainSHMetro />}

            <DirectionElements />
        </>
    );
});

export default RailMapSHMetro;

const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_sh" fill="var(--rmg-white)" strokeWidth={2} r={5} />
        <path id="int2_sh" fill="var(--rmg-white)" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z" />
        <path
            id="express_sh"
            fill="var(--rmg-white)"
            strokeWidth={2}
            d="M -5,0 a 5,5 0 1 1 10,0 V25 a 5,5 0 1 1 -10,0Z"
        />
        <path
            id="direct_sh"
            fill="var(--rmg-white)"
            strokeWidth={2}
            d="M -5,0 a 5,5 0 1 1 10,0 V50 a 5,5 0 1 1 -10,0Z"
        />
        <rect id="stn_sh_2020" stroke="none" height={24} width={12} x={-6} y={-18} />
        <rect id="stn_sh_2020_express" stroke="none" height={49} width={12} x={-6} y={-18} />
        <rect id="stn_sh_2020_direct" stroke="none" height={74} width={12} x={-6} y={-18} />

        <rect id="intbox_number" height={22} width={20} y={-11} />

        <g id="intbox_maglev" transform="translate(-25,0)">
            <rect id="maglev_5" height={144} width={130} y="40" x="30" strokeWidth={10} />
            <path
                id="maglev_3"
                fill="var(--rmg-white)"
                d="m90,55a40,5 0 0 0 -40,3a5,5 0 0 0 -5,5a5,60 0 0 0 -3,60a5,5 0 0 0 5,5l96,0a5,5 0 0 0 5,-5a5,60 0 0 0 -3,-60a5,5 0 0 0 -5,-5a40,5 0 0 0 -40,-3l-5,-10l-5,10"
            />
            <path
                id="maglev_4"
                fill="var(--rmg-white)"
                d="m90,140l-40,0a10,5 0 0 1 -10,-5l0,25a10,15 0 0 0 10,15l15,0l0,-10l-15,0l0,-15l90,0l0,15l-15,0l0,10l15,0a10,15 0 0 0 10,-15l0,-25a10,5 0 0 1 -10,5l-50,0"
            />
            <rect id="maglev_1" height="25" width="40" y="80" x="50" />
            <rect id="maglev_2" height="25" width="40" y="80" x="100" />
        </g>

        <g id="airport" transform="scale(0.5)">
            <circle cx="0" cy="29.33899" r="29.33899" fill="var(--rmg-grey)" />
            <path
                id="airport"
                d="M28.9769,6.60134c1.711.013,3.111,2.53205,3.111,4.241v10.337s17.106,15.435,17.358,15.666a1.145,1.145,0,0,1,.488,1.152v2.833c0,.651-.451.61-.695.467-.334-.119-17.151-8.863-17.151-8.863-.004,1.458-.797,9.006-1.326,13.304,0,0,4.61,2.457,4.699,2.521.334.268.352.359.352.852v2.001c0,.477-.352.428-.51.324-.183-.062-5.693-1.921-5.693-1.921a2.56018,2.56018,0,0,0-.633-.127,2.31654,2.31654,0,0,0-.666.127s-5.477,1.859-5.672,1.921c-.185.104-.523.153-.523-.324v-2.001c0-.493.029-.584.367-.852.086-.064,4.678-2.521,4.678-2.521-.524-4.298-1.307-11.846-1.325-13.304,0,0-16.822,8.744-17.148,8.863-.217.143-.69.184-.69-.467v-2.833a1.16206,1.16206,0,0,1,.473-1.152c.276-.231,17.365-15.666,17.365-15.666v-10.337c0-1.709,1.403-4.228,3.14105-4.241"
                transform="translate(-28.9697,0.14347)"
                fill="var(--rmg-white)"
            />
        </g>
        <g id="disney" transform="scale(0.5)">
            <circle cx="0" cy="29.33899" r="29.33899" fill="var(--rmg-grey)" />
            <path
                fill="var(--rmg-white)"
                d="M45.6152,7.85015a9.80248,9.80248,0,0,0-9.79907,9.801,9.70059,9.70059,0,0,0,.342,2.582c.002.026.002.055.002.093a.31815.31815,0,0,1-.31494.318.67741.67741,0,0,1-.12806-.02,15.71521,15.71521,0,0,0-13.498,0,.61.61,0,0,1-.122.02.31841.31841,0,0,1-.322-.318v-.067a9.62553,9.62553,0,0,0,.35608-2.608,9.803,9.803,0,1,0-9.797,9.8,10.10364,10.10364,0,0,0,2.308-.271h.05493a.31113.31113,0,0,1,.31409.318.32433.32433,0,0,1-.019.12,15.72588,15.72588,0,1,0,29.703,7.216,15.83676,15.83676,0,0,0-1.746-7.23.18417.18417,0,0,1-.0271-.106.31612.31612,0,0,1,.32007-.318h.057a10.15953,10.15953,0,0,0,2.316.271,9.80051,9.80051,0,0,0,0-19.601"
                transform="translate(-28.9697 0.13398)"
            />
        </g>
        {/* Special thanks to Wikimedia Commons, see https://commons.wikimedia.org/wiki/File:China_Railways.svg */}
        <g id="railway">
            <circle cx="0" cy="29.33899" r="29.33899" fill="var(--rmg-grey)" transform="translate(0,-2)scale(0.5)" />
            <path
                fill="var(--rmg-white)"
                d="M169,273.5c0-19,14.7-34.8,33.7-36.3c18.9-1.5,38.1-2.2,57.4-2.2c19.3,0,38.4,0.8,57.3,2.2  c19,1.5,33.7,17.3,33.7,36.3v47.3l-51.3,14.7c-11.2,3.2-18.9,13.4-18.9,25v147.8c0,17.4,12.2,32.3,29.3,35.7l110.6,22.1  c4.9,1,8.4,5.2,8.4,10.2V599H91v-22.7c0-5,3.5-9.2,8.4-10.2L209.9,544c17-3.4,29.3-18.3,29.3-35.7V360.5c0-11.6-7.7-21.8-18.9-25  L169,320.8V273.5z M309.4,31.7c0.2-1.2,0.3-2.4,0.3-3.6c0-14-11.1-25.4-24.9-26C276.6,1.4,268.3,1,260,1c-8.3,0-16.6,0.4-24.7,1.1  c-13.9,0.6-24.9,12-24.9,26c0,1.2,0.1,2.5,0.3,3.6C90.6,54.8,0,160.3,0,287c0,97.2,53.4,182,132.4,226.6l36.8-48.1  C104.3,432.4,59.8,364.9,59.8,287c0-110.6,89.6-200.2,200.2-200.2S460.2,176.4,460.2,287c0,77.9-44.5,145.4-109.4,178.5  c15,19.6,25.6,33.5,36.8,48.1C466.6,469,520,384.2,520,287C520,160.3,429.4,54.8,309.4,31.7z"
                transform="translate(-10,0)scale(0.04)"
            />
        </g>

        {/* An extension of the line/path. Remember to minus the stroke-width.  */}
        <marker id="arrow_gray" viewBox="-1.5 0 3 1.5" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="var(--rmg-grey)" />
        </marker>
        <marker id="arrow_theme_left" refX={1} refY={0.5}>
            <path d="M1,0L0,1H1z" fill="var(--rmg-theme-colour)" />
        </marker>
        <marker id="arrow_theme_right" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
        </marker>

        {/* Contrast filters for lines. */}
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

        <filter
            id="pujiang_outline_railmap"
            colorInterpolationFilters="sRGB"
            // TODO: remove the absolute value while make the filter works correctly
            filterUnits="userSpaceOnUse"
            x="0"
            y="-1000"
            width="5000"
            height="2000"
        >
            {/* Replace pass gray color with white.
                https://stackoverflow.com/questions/41639049/replace-one-color-using-svg-filters */}
            <feComponentTransfer in="SourceGraphic">
                <feFuncR
                    type="discrete"
                    tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                />
                <feFuncG
                    type="discrete"
                    tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                />
                <feFuncB
                    type="discrete"
                    tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                />
            </feComponentTransfer>
            <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                                                 0 1 0 0 0
                                                 0 0 1 0 0
                                                 1 1 1 1 -3"
                result="selectedColor1"
            />

            {/* Draw an outline line around the pass line.
                https://stackoverflow.com/questions/49693471/svg-border-outline-for-group-of-elements
                Also see #181 why we do not simply outline the pass line element. */}
            <feMorphology operator="erode" in="selectedColor1" radius="0" result="e1" />
            <feMorphology operator="erode" in="selectedColor1" radius="1" result="e2" />
            <feComposite in="e1" in2="e2" operator="xor" result="uncoloredOutline" />
            {/* As the pass line is colored in white, we need to recolor the outline with black. */}
            <feFlood floodColor="rgb(0,0,0)" />
            <feComposite operator="in" in2="uncoloredOutline" result="outline" />
            {/* Put the outline on the white not gray pass line. */}
            <feComposite in="outline" in2="selectedColor1" operator="over" result="result" />
            {/* Put the white pass line with outline on the original line. */}
            <feComposite in="result" in2="SourceGraphic" operator="over" />
        </filter>
    </defs>
));
