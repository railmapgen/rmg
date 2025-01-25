import StripGZMTR from './strip-gzmtr';
import InfoGZMTR from './info-gzmtr';
import { useRootSelector } from '../../redux';
import { CanvasType, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';
import PlatformNumber from './platform-number';
import SvgWrapper from '../svg-wrapper';
import OtisFrame from './otis-frame';
import CoachNumber from './runin/coach-number';

const CANVAS_TYPE = CanvasType.RunIn;

export default function RunInGZMTR() {
    const { canvasScale } = useRootSelector(state => state.app);
    const {
        svgWidth: svgWidths,
        svg_height: svgHeight,
        direction,
        info_panel_type: infoPanelType,
        platform_num: platformNumber,
        psd_num: psdNumber,
        coachNum,
        theme,
    } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    const post2022 = [PanelTypeGZMTR.gz7w, PanelTypeGZMTR.gz11].includes(infoPanelType as PanelTypeGZMTR);
    const platformNumY = post2022 ? svgHeight - 60 : svgHeight / 2 - 30;
    const otisTransforms = {
        platform: `translate(${direction === ShortDirection.left ? 50 : -50},45)`,
    };
    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <StripGZMTR
                variant={infoPanelType}
                isShowLight={infoPanelType !== PanelTypeGZMTR.gz2otis}
                isShowPSD={infoPanelType !== PanelTypeGZMTR.gz2otis && psdNumber}
            />

            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.platform : ''}>
                <PlatformNumber
                    num={platformNumber}
                    style={{
                        ['--translate-x' as any]: `${direction === ShortDirection.left ? svgWidth - 100 : 100}px`,
                        ['--translate-y' as any]: platformNumY + 'px',
                        transform: 'translate(var(--translate-x, 100px), var(--translate-y))',
                    }}
                />
            </g>

            {post2022 && (
                <CoachNumber coachNumber={coachNum} transform={`translate(${svgWidth * 0.85},${svgHeight * 0.65})`} />
            )}

            <InfoGZMTR />

            {infoPanelType === PanelTypeGZMTR.gz2otis && <OtisFrame canvasType={CANVAS_TYPE} />}
        </SvgWrapper>
    );
}
