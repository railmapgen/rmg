import React from 'react';
import StripGZMTR from '../strip/strip-gzmtr';
import InfoGZMTR from './info-gzmtr';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { CanvasType, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';

const RunInGZMTR = () => {
    const svgWidths = useSelector((store: RootState) => store.param.svgWidth);
    const direction = useSelector((store: RootState) => store.param.direction);
    const infoPanelType = useSelector((store: RootState) => store.param.info_panel_type);
    const platformNumber = useSelector((store: RootState) => store.param.platform_num);
    const psdNumber = useSelector((store: RootState) => store.param.psd_num);

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
                <PlatformNum
                    num={platformNumber}
                    style={{
                        ['--translate-x' as any]: `${
                            direction === ShortDirection.left ? svgWidths[CanvasType.RunIn] - 100 : 100
                        }px`,
                    }}
                />
            </g>

            <InfoGZMTR />

            {infoPanelType === PanelTypeGZMTR.gz2otis && <OtisFrame />}
        </>
    );
};

export default RunInGZMTR;

const PlatformNum = (props: { num: string | false } & React.SVGProps<SVGGElement>) => {
    const { num, ...others } = props;

    return (
        <g id="platform" {...others}>
            {React.useMemo(
                () => (
                    <>
                        <circle cx={0} cy={0} r={30} fill="var(--rmg-theme-colour)" />
                        <text className="rmg-name__en" fontSize={38} dy={-9.5}>
                            {num}
                        </text>
                        <text className="rmg-name__zh" fontSize={13} dy={10}>
                            站台
                        </text>
                        <text className="rmg-name__en" fontSize={9} dy={21}>
                            Platform
                        </text>
                    </>
                ),
                [num]
            )}
        </g>
    );
};

const OtisFrame = () => {
    const svgWidths = useSelector((store: RootState) => store.param.svgWidth);
    const svgHeight = useSelector((store: RootState) => store.param.svg_height);
    return (
        <g id="otis_frame" strokeWidth={3} stroke="black">
            <line y2={svgHeight} transform={`translate(${svgWidths[CanvasType.RunIn] / 2},0)`} />
            <line x2={svgWidths[CanvasType.RunIn]} transform="translate(0,90)" />
        </g>
    );
};
