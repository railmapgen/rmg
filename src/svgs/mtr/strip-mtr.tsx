import React, { memo } from 'react';

export default memo(function StripMTR(props: { stripPc: number }) {
    return (
        <rect
            fill="var(--rmg-theme-colour)"
            height={20}
            style={{
                width: 'var(--rmg-svg-width)',
                ['--strip-percentage' as any]: props.stripPc,
                transform: `translateY(calc(var(--strip-percentage, 95) * var(--rmg-svg-height) / 100 - 10px))`,
            }}
        />
    );
});
