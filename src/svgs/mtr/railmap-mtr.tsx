import StripMTR from './strip-mtr';
import MainMTR from './main-mtr';
import { CanvasType } from '../../constants/constants';
import SvgWrapper from '../svg-wrapper';
import { useRootSelector } from '../../redux';
import { memo, SVGProps } from 'react';
import { AirportIcon, DisneyIcon, HsrIcon, Np360Icon } from '@railmapgen/svg-assets/mtr';

const CANVAS_TYPE = CanvasType.RailMap;

export default function RailMapMTR() {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, theme } = useRootSelector(state => state.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsMTR />

            <StripMTR />
            <MainMTR />
        </SvgWrapper>
    );
}

const ICON_WIDTH = 34.03125;
const extraProps: SVGProps<SVGSVGElement> = {
    width: ICON_WIDTH,
    height: ICON_WIDTH,
    x: -ICON_WIDTH / 2,
    fill: undefined,
};

const DefsMTR = memo(function DefsMTR() {
    return (
        <defs>
            <AirportIcon id="airport" {...extraProps} />
            <DisneyIcon id="disney" {...extraProps} />
            <HsrIcon id="hsr" {...extraProps} />
            <Np360Icon id="np360" {...extraProps} />

            <path id="inttick" d="M0,0v17" strokeLinecap="round" />
        </defs>
    );
});
