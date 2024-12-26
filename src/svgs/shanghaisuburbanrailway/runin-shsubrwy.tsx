import { memo } from 'react';
import { CanvasType } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';

const CANVAS_TYPE = CanvasType.RunIn;

const RunInSHSuburbanRailway = () => {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height, theme } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];
    // get the height
    const dh = svg_height - 300;

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svg_height}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsSHSuburbanRailway />
            <g transform={`translate(0,${dh})`}>
                <Station />
            </g>
        </SvgWrapper>
    );
};

export default RunInSHSuburbanRailway;

const DefsSHSuburbanRailway = memo(function DefsSHSuburbanRailway() {
    return (
        <defs>
            {/* An extension of the line/path. Remember to minus the stroke-width.  */}
            <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
                <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
            </marker>
        </defs>
    );
});

const Station = () => {
    const { svgWidth, stn_list, current_stn_idx } = useRootSelector(store => store.param);
    const { localisedName, character_spacing } = stn_list[current_stn_idx];
    const { zh: zhName = '', en: enName = '' } = localisedName;

    const middle = svgWidth.runin / 2;

    return (
        <g transform={`translate(${middle},160)`} textAnchor="middle">
            <text
                className="rmg-name__zh rmg-outline"
                fontSize={112}
                dx={character_spacing / 2}
                letterSpacing={character_spacing}
            >
                {zhName.replace('\\', '')}
            </text>
            <text className="rmg-name__en rmg-outline" fontSize={36} dy={75}>
                {enName.replace('\\', '')}
            </text>
        </g>
    );
};
