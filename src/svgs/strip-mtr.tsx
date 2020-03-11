import * as React from 'react';

interface Props {
    stripPc: number;
}

const StripMTR = React.memo((props: Props) => (
    <rect id="strip" style={{['--strip-percentage' as any]: props.stripPc}} />
));

export default StripMTR;