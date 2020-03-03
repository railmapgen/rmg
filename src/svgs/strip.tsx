import * as React from 'react';
import { RMGParam } from '../types';

interface Props {
    stripPc: number;
}

export default (props: Props) => (
    <rect id="strip" style={{['--strip-percentage' as any]: props.stripPc}} />
)