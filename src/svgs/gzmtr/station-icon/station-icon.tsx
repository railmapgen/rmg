import React, { memo } from 'react';

interface StationIconProps {
    passed?: boolean;
    large?: boolean;
}

export default memo(
    function StationIcon(props: StationIconProps) {
        const { passed, large } = props;

        const pathD = large
            ? 'M0,12.95 V-12.95 H-12.95 a12.95,12.95 0 0,0 0,25.9 h25.9 a12.95,12.95 0 0,0 0,-25.9 H0'
            : 'M0,9.25 V-9.25 H-9.25 a9.25,9.25 0 0,0 0,18.5 h18.5 a9.25,9.25 0 0,0 0,-18.5 H0';

        return <path d={pathD} fill="#fff" strokeWidth={2} stroke={passed ? '#aaa' : 'var(--rmg-theme-colour)'} />;
    },
    (prevProps, nextProps) => prevProps.passed === nextProps.passed && prevProps.large === nextProps.large
);
