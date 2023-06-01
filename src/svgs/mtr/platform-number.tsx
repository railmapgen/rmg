import { memo } from 'react';

interface PlatformNumberProps {
    num: string | false;
}

export default memo(
    function PlatformNumber(props: PlatformNumberProps) {
        const { num } = props;
        return (
            <>
                <circle cx={0} cy={0} r={60} fill="var(--rmg-theme-colour)" />
                <text className="rmg-name__zh" dy={0} textAnchor="middle" fontSize={100} fill="#fff">
                    {num}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => prevProps.num === nextProps.num
);
