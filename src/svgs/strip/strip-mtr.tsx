import * as React from 'react';

interface Props {
    stripPc: number;
}

const StripMTR = React.memo((props: Props) => (
    <rect
        style={{
            fill: 'var(--rmg-theme-colour)',
            width: 'var(--rmg-svg-width)',
            height: 20,
            ['--strip-percentage' as any]: props.stripPc,
            transform: `translateY(calc(var(--strip-percentage, 95) * var(--rmg-svg-height) / 100 - 10px))`,
        }}
    />
));

export default StripMTR;
