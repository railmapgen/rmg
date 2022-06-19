import React from 'react';
import StripGZMTR from '../strip/strip-gzmtr';
import InfoGZMTR from './info-gzmtr';
import { useRootSelector } from '../../redux';
import { CanvasType, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';
import PlatformNumber from '../gzmtr/platform-number';

const RunInGZMTR = () => {
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const infoPanelType = useRootSelector(store => store.param.info_panel_type);
    const platformNumber = useRootSelector(store => store.param.platform_num);
    const psdNumber = useRootSelector(store => store.param.psd_num);

    const otisTransforms = {
        platform: `translate(${direction === ShortDirection.left ? 50 : -50},45)`,
    };
    return (
        <>
            <StripGZMTR
                variant={infoPanelType}
                isShowLight={infoPanelType !== PanelTypeGZMTR.gz2otis}
                isShowPSD={infoPanelType !== PanelTypeGZMTR.gz2otis && psdNumber}
            />

            <g transform={infoPanelType === PanelTypeGZMTR.gz2otis ? otisTransforms.platform : ''}>
                <PlatformNumber
                    num={platformNumber}
                    style={{
                        ['--translate-x' as any]: `${
                            direction === ShortDirection.left ? svgWidths[CanvasType.RunIn] - 100 : 100
                        }px`,
                        ['--translate-y' as any]: 'calc(var(--rmg-svg-height) / 2 - 30px)',
                        transform: 'translate(var(--translate-x, 100px), var(--translate-y))',
                    }}
                />
            </g>

            <InfoGZMTR />

            {infoPanelType === PanelTypeGZMTR.gz2otis && <OtisFrame />}
        </>
    );
};

export default RunInGZMTR;

const OtisFrame = () => {
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const svgHeight = useRootSelector(store => store.param.svg_height);
    return (
        <g id="otis_frame" strokeWidth={3} stroke="black">
            <line y2={svgHeight} transform={`translate(${svgWidths[CanvasType.RunIn] / 2},0)`} />
            <line x2={svgWidths[CanvasType.RunIn]} transform="translate(0,90)" />
        </g>
    );
};
