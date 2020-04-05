import * as React from 'react';

import { ParamContext } from '../../context';
import StripGZMTR from '../strip/strip-gzmtr';
import InfoGZMTR from './info-gzmtr';

const RunInGZMTR = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <>
            <StripGZMTR variant={param.info_panel_type} isShowLight={true} isShowPSD={param.psd_num} />

            <PlatformNum
                num={param.platform_num}
                style={{
                    ['--translate-x' as any]: `${param.direction === 'l' ? param.svgWidth.runin - 100 : 100}px`,
                }}
            />

            <InfoGZMTR />
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
