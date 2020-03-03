

import * as React from 'react';
import { RMGParam } from '../types';
import Destination from './destination';
import RailMap from './railmap';
import { RMGLine } from '../Line/RMGLine';

interface Props {
    // param: RMGParam;
    myLine: RMGLine;
}

export default (props) => {
    return (
        <div>
            <Destination {...props} />
            <RailMap {...props} />
        </div>
    )
}