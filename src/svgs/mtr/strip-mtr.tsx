import React, { memo } from 'react';

export default memo(function StripMTR() {
    return (
        <rect
            fill="var(--rmg-theme-colour)"
            height={20}
            style={{
                width: 'var(--rmg-svg-width)',
                transform: `translateY(calc(var(--rmg-svg-height) - 20px))`,
            }}
        />
    );
});
