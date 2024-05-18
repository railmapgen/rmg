interface StationIconProps {
    length: number;
    isPassed?: boolean;
    isReversed?: boolean;
}

export default function StationIcon(props: StationIconProps) {
    const { length, isPassed, isReversed } = props;

    return (
        <path
            d={`M-8,0 v${length} a8,8 0 0,0 16,0 v-${length} a8,8 0 0,0 -16,0Z`}
            className="rmg-stn__mtr"
            stroke={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
            transform={`scale(1,${isReversed ? -1 : 1})`}
        />
    );
}
