import { useRootSelector } from '../../redux';
import Station from './station';
import { StationState } from '../../constants/constants';

interface StationGroupProps {
    xs: Record<string, number>;
    ys: Record<string, number>;
    stnStates: Record<string, StationState>;
}

export default function StationGroup(props: StationGroupProps) {
    const { xs, ys, stnStates } = props;

    const { stn_list: stationList, loop } = useRootSelector(store => store.param);
    const { branches } = useRootSelector(store => store.helper);

    const stationsInScope = loop ? branches[0].slice(1, -1) : Object.keys(stationList);

    return (
        <g id="stn_icons">
            {stationsInScope
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .map(stnId => (
                    <g
                        key={stnId}
                        style={{
                            transform: `translate(${xs[stnId]}px,${ys[stnId]}px)`,
                        }}
                    >
                        <Station stnId={stnId} stnState={stnStates[stnId]} stnY={ys[stnId]} />
                    </g>
                ))}
        </g>
    );
}
