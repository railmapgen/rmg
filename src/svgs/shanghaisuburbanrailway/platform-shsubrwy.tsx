import { CanvasType } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';

const CANVAS_TYPE = CanvasType.Platform;

const PlatformSHSuburbanRailway = () => {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height, theme } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svg_height}
            canvasScale={canvasScale}
            theme={theme}
        >
            <Platform />
        </SvgWrapper>
    );
};

export default PlatformSHSuburbanRailway;

const Platform = () => {
    const { svgWidth, svg_height, platform_num } = useRootSelector(store => store.param);

    const middle = svgWidth.platform / 2;

    return (
        <g transform={`translate(${middle},${svg_height - 140})`}>
            <text className="rmg-name__en rmg-outline" dominantBaseline="central" fontSize={120} textAnchor="end">
                {platform_num}
            </text>
            <text className="rmg-name__zh rmg-outline" fontSize={50} x={10} dy={10}>
                站台
            </text>
            <text className="rmg-name__zh rmg-outline" fontSize={30} x={10} dy={50}>
                Platform
            </text>
        </g>
    );
};
