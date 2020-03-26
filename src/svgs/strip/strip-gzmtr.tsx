import React from 'react';

interface Props {
    variant: PanelTypeGZMTR;
    isShowLight: boolean;
    isShowPSD: false | string;
}

const StripGZMTR = (props: Props) => {
    const stripHeight = (variant => {
        switch (variant) {
            case 'gz28':
            case 'gz6':
            case 'gzgf':
                return 60;
            case 'gz1':
            case 'gz3':
                return 40;
            case 'gz4':
            case 'gz5':
            case 'gz1421':
                return 20;
            default:
                return 0;
        }
    })(props.variant);

    const indicatorLight = React.useMemo(() => {
        switch (props.variant) {
            case 'gz1':
                return <circle cy={-58} r={16} fill="red" />;
            case 'gz28':
                return <ellipse cy={-30} rx={24} ry={12} fill="orange" />;
            case 'gz3':
                return <rect x={-15} y={-55} height={30} width={30} fill="red" />;
            case 'gz6':
                return <ellipse cy={-30} rx={24} ry={12} fill="white" />;
            case 'gz1421':
                return <ellipse cy={-38} rx={24} ry={12} fill="orange" />;
            case 'gz5':
                return <rect x={-30} y={-70} height={30} width={60} fill="orange" />;
            case 'gz4':
                return <rect x={-50} y={-50} height={25} width={100} fill="whitesmoke" />;
            case 'gzgf':
                return <rect x={-30} y={-58} height={30} width={60} fill="orange" />;
            default:
                return <></>;
        }
    }, [props.variant]);

    const stripDy = -20;

    return (
        <g transform={`translate(0,${props.variant === 'gz4' ? stripDy : 0})`}>
            <rect
                id="strip_gz"
                style={{
                    ['--height' as any]: `${stripHeight}px`,
                }}
            />
            <g
                style={{
                    transform: 'translate(calc(var(--rmg-svg-width) / 2),var(--rmg-svg-height))',
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
    (props: Props) => {
        /**
         * Flag of whether PSD number is stick within the strip area. If `true`, should fill with white, otherwise, fill with theme colour.
         */
        const isInStrip = ['gz28', 'gz6', 'gzgf'].includes(props.variant);
        const psdDy = ((variant: PanelTypeGZMTR) => {
            switch (variant) {
                case 'gz1':
                case 'gz3':
                    return '82px';
                case 'gz4':
                    return '65px';
                case 'gz5':
                    return '80px';
                case 'gz1421':
                    return '62px';
                default:
                    return '58px';
            }
        })(props.variant);

        return (
            <g
                textAnchor="middle"
                fill={isInStrip ? '#000' : 'var(--rmg-theme-fg)'}
                style={{
                    ['--psd-dy' as any]: psdDy,
                    transform: 'translate(var(--translate-x), var(--translate-y))',
                    ['--translate-x' as any]: 'calc(var(--rmg-svg-width) / 2 + 80px)',
                    ['--translate-y' as any]: 'calc(var(--rmg-svg-height) - var(--psd-dy, 58px))',
                }}
            >
                <rect height={40} width={40} rx={4} x={-20} fill={isInStrip ? '#fff' : 'var(--rmg-theme-colour)'} />
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
        );
    },
    (prevProps, nextProps) => prevProps.variant === nextProps.variant && prevProps.isShowPSD === nextProps.isShowPSD
);
