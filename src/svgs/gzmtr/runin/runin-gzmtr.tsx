import StripGZMTR from '../strip-gzmtr';
import InfoGZMTR from '../info-gzmtr';
import { useRootSelector } from '../../../redux';
import { CanvasType, PanelTypeGZMTR, ShortDirection } from '../../../constants/constants';
import PlatformNumber from '../platform-number';
import SvgWrapper from '../../svg-wrapper';
import OtisFrame from '../otis-frame';
import CoachNumber from './coach-number';
import { COACH_NUMBER_X_PERCENTAGE } from './runin-utils';

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
        psdLabel,
        coachNum,
        theme,
    } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    const post2022 = [PanelTypeGZMTR.gz7w, PanelTypeGZMTR.gz11].includes(infoPanelType as PanelTypeGZMTR);
    const platformNumY = post2022 ? svgHeight - 78 : svgHeight / 2 - 30;
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
                psdLabel={psdLabel}
            />

            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.platform : ''}>
                <PlatformNumber
                    num={platformNumber}
                    style={{
                        ['--translate-x' as any]: `${direction === ShortDirection.left || infoPanelType === PanelTypeGZMTR.gz11 ? svgWidth - 100 : 100}px`,
                        ['--translate-y' as any]: platformNumY + 'px',
                        ['--scale' as any]: post2022 ? 1.15 : 1,
                        transform: 'translate(var(--translate-x, 100px), var(--translate-y))scale(var(--scale))',
                    }}
                />
            </g>

            {post2022 && (
                <CoachNumber
                    coachNumber={coachNum}
                    transform={`translate(${svgWidth * COACH_NUMBER_X_PERCENTAGE},${svgHeight * 0.58})`}
                />
            )}

            <InfoGZMTR />

            {infoPanelType === PanelTypeGZMTR.gz2otis && <OtisFrame canvasType={CANVAS_TYPE} />}
        </SvgWrapper>
    );
}
