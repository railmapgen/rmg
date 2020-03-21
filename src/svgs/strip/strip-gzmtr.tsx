import * as React from 'react';

interface Props {
    variant: 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf';
    isShowLight: boolean;
    isShowPSD: false | string;
}

const StripGZMTR = (props: Props) => {
    const stripHeight = (variant => {
        switch (variant) {
            case 'gz28':
            case 'gzgf':
                return 60;
            case 'gz1':
            case 'gz3':
                return 40;
            case 'gz1421':
                return 20;
            default:
                return 0;
        }
    })(props.variant);

    const indicatorLight = React.useMemo(() => {
        switch (props.variant) {
            case 'gz1':
                return <circle cy={-28} r={16} fill="red" />;
            case 'gz28':
                return <ellipse rx={24} ry={12} fill="orange" />;
            case 'gz3':
                return <rect x={-15} y={-25} height={30} width={30} fill="red" />;
            case 'gzgf':
                return <ellipse rx={24} ry={12} fill="white" />;
            case 'gz1421':
                return <ellipse cy={-8} rx={24} ry={12} fill="orange" />;
            default:
                return <></>;
        }
    }, [props.variant]);

    return (
        <g>
            <rect
                id="strip_gz"
                style={{
                    ['--height' as any]: `${stripHeight}px`,
                }}
            />
            <g
                style={{
                    transform: 'translate(calc(var(--rmg-svg-width) / 2),calc(var(--rmg-svg-height) - 30px))',
                }}
            >
                {props.isShowLight && indicatorLight}
            </g>
            {props.isShowPSD && <PSD {...props} />}
        </g>
    );
};

export default StripGZMTR;

const PSD = React.memo(
    (props: Props) => (
        <g
            id="big_psd"
            fill={['gz3', 'gz1421', 'gz1'].includes(props.variant) ? 'var(--rmg-theme-fg)' : '#000'}
            style={{
                ['--psd-dy' as any]: ['gz1', 'gz3'].includes(props.variant)
                    ? '82px'
                    : props.variant === 'gz1421'
                    ? '62px'
                    : '58px',
            }}
        >
            <rect
                height={40}
                width={40}
                rx={4}
                x={-20}
                fill={['gz3', 'gz1421', 'gz1'].includes(props.variant) ? 'var(--rmg-theme-colour)' : '#fff'}
            />
            <text className="rmg-name__en" fontSize={20} dy={12}>
                {props.isShowPSD}
            </text>
            <text className="rmg-name__zh" fontSize={12} dy={26}>
                屏蔽门
            </text>
            <text className="rmg-name__en" fontSize={6.5} dy={36}>
                Screen Door
            </text>
        </g>
    ),
    (prevProps, nextProps) => prevProps.variant === nextProps.variant && prevProps.isShowPSD === nextProps.isShowPSD
);
