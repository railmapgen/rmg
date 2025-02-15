import { PanelTypeGZMTR, PanelTypeShmetro } from '../../constants/constants';
import PsdNumber from './psd-number';
import { memo, useMemo } from 'react';

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
            case 'gz11':
            case 'gz1822':
            case 'gz7w':
                return 30;
            default:
                return 0;
        }
    })(props.variant);

    const indicatorLight = useMemo(() => {
        switch (props.variant) {
            case 'gz1':
                return <circle cy={-65} r={20} fill="red" />;
            case 'gz28':
            case 'gz2otis':
                return <ellipse cy={-30} rx={24} ry={12} fill="orange" />;
            case 'gz3':
                return <rect x={-18} y={-58} height={36} width={36} fill="red" />;
            case 'gz6':
                return <ellipse cy={-30} rx={24} ry={12} fill="white" />;
            case 'gz5':
                return <rect x={-30} y={-80} height={35} width={60} fill="whitesmoke" />;
            case 'gz4':
                return <rect x={-60} y={-68} height={30} width={120} fill="whitesmoke" />;
            case 'gzgf':
                return <rect x={-30} y={-58} height={30} width={60} fill="orange" />;
            case 'gz1421':
            case 'gz7w':
            case 'gz11':
                return <ellipse cy={-58} rx={36} ry={18} fill="darkorange" />;
            default:
                return <></>;
        }
    }, [props.variant]);

    const stripDy = -15;

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

const PSD = memo(
    function PSD(props: Props) {
        /**
         * Flag of whether PSD number is stick within the strip area. If `true`, should fill with white, otherwise, fill with theme colour.
         */
        const isInStrip = ['gz28', 'gz2otis', 'gz6', 'gzgf'].includes(props.variant);
        const psdDy = ((variant: PanelTypeGZMTR | PanelTypeShmetro) => {
            switch (variant) {
                case 'gz1':
                case 'gz3':
                    return '93px';
                case 'gz4':
                    return '86px';
                case 'gz5':
                    return '90px';
                case 'gz1421':
                case 'gz7w':
                case 'gz11':
                    return '96px';
                default:
                    return '56px';
            }
        })(props.variant);
        const scale = ((variant: PanelTypeGZMTR | PanelTypeShmetro) => {
            switch (variant) {
                case 'gz1':
                case 'gz3':
                case 'gz4':
                case 'gz5':
                    return 1.2;
                case 'gz1421':
                case 'gz7w':
                case 'gz11':
                    return 1.4;
                default:
                    return 1;
            }
        })(props.variant);

        const post2017 = [
            PanelTypeGZMTR.gz1,
            PanelTypeGZMTR.gz3,
            PanelTypeGZMTR.gz4,
            PanelTypeGZMTR.gz5,
            PanelTypeGZMTR.gz1421,
            PanelTypeGZMTR.gz7w,
            PanelTypeGZMTR.gz11,
        ].includes(props.variant as PanelTypeGZMTR);

        return (
            <PsdNumber
                num={props.isShowPSD as string}
                inStrip={isInStrip}
                showAsPlatformDoor={props.variant === PanelTypeGZMTR.gz11}
                style={{
                    ['--psd-dy' as any]: psdDy,
                    transform: 'translate(var(--translate-x), var(--translate-y))scale(var(--scale))',
                    ['--translate-x' as any]: post2017
                        ? 'calc(var(--rmg-svg-width) / 2 + 110px)'
                        : 'calc(var(--rmg-svg-width) / 2 + 80px)',
                    ['--translate-y' as any]: 'calc(var(--rmg-svg-height) - var(--psd-dy, 58px))',
                    ['--scale' as any]: scale,
                }}
            />
        );
    },
    (prevProps, nextProps) => prevProps.variant === nextProps.variant && prevProps.isShowPSD === nextProps.isShowPSD
);
