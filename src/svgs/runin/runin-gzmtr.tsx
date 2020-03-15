import * as React from 'react';

import { ParamContext } from '../../context';
import StripGZMTR from '../strip/strip-gzmtr';
import InfoGZMTR from './info-gzmtr';

const RunInGZMTR = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <>
            <StripGZMTR variant={param.info_panel_type} isShowLight={true} isShowPSD={param.psd_num} />
            <InfoGZMTR />
        </>
    );
};

export default RunInGZMTR;
