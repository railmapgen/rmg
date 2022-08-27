import React from 'react';
import { PanelTypeGZMTR, PanelTypeShmetro } from '../../constants/constants';
import PsdNumber from './psd-number';

interface Props {
    variant: PanelTypeGZMTR | PanelTypeShmetro;
    isShowLight: boolean;
    isShowPSD: false | string;
}

const StripGZMTR = (props: Props) => {
    const stripHeight = (variant => {
        switch (variant) {
            case 'gz28':
            case 'gz2otis':
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
            case 'gz2otis':
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
            {props.isShowPSD !== false && <PSD {...props} />}
        </g>
    );
};

export default StripGZMTR;

const PSD = React.memo(
    (props: Props) => {
        /**
         * Flag of whether PSD number is stick within the strip area. If `true`, should fill with white, otherwise, fill with theme colour.
         */
        const isInStrip = ['gz28', 'gz2otis', 'gz6', 'gzgf'].includes(props.variant);
        const psdDy = ((variant: PanelTypeGZMTR | PanelTypeShmetro) => {
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
            <PsdNumber
                num={props.isShowPSD as string}
                inStrip={isInStrip}
                style={{
                    ['--psd-dy' as any]: psdDy,
                    transform: 'translate(var(--translate-x), var(--translate-y))',
                    ['--translate-x' as any]: 'calc(var(--rmg-svg-width) / 2 + 80px)',
                    ['--translate-y' as any]: 'calc(var(--rmg-svg-height) - var(--psd-dy, 58px))',
                }}
            />
        );
    },
    (prevProps, nextProps) => prevProps.variant === nextProps.variant && prevProps.isShowPSD === nextProps.isShowPSD
);
