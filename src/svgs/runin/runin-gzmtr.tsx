import * as React from 'react';

import { ParamContext } from '../../context';
import StripGZMTR from '../strip/strip-gzmtr';
import InfoGZMTR from './info-gzmtr';

const RunInGZMTR = () => {
    const { param } = React.useContext(ParamContext);

    const otisTransforms = {
        platform: `translate(${param.direction === 'l' ? 50 : -50},45)`,
    };
    return (
        <>
            <StripGZMTR
                variant={param.info_panel_type}
                isShowLight={param.info_panel_type !== 'gz2otis'}
                isShowPSD={param.info_panel_type !== 'gz2otis' && param.psd_num}
            />

            <g transform={param.info_panel_type === 'gz2otis' ? otisTransforms.platform : ''}>
                <PlatformNum
                    num={param.platform_num}
                    style={{
                        ['--translate-x' as any]: `${param.direction === 'l' ? param.svgWidth.runin - 100 : 100}px`,
                    }}
                />
            </g>

            <InfoGZMTR />

            {param.info_panel_type === 'gz2otis' && <OtisFrame />}
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
    const { param } = React.useContext(ParamContext);
    return (
        <g id="otis_frame" strokeWidth={3} stroke="black">
            <line y2={param.svg_height} transform={`translate(${param.svgWidth.runin / 2},0)`} />
            <line x2={param.svgWidth.runin} transform="translate(0,90)" />
        </g>
    );
};
