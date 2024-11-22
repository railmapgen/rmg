import { useRootSelector } from '../../../redux';
import { Fragment, SVGProps } from 'react';
import { ShortDirection } from '../../../constants/constants';
import { isSafari } from '../../../util/utils';

interface DoubleDestinationsProps extends SVGProps<SVGGElement> {
    destIds: string[];
}

export function DoubleDestinations(props: DoubleDestinationsProps) {
    const { destIds, textAnchor, ...others } = props;

    const direction = useRootSelector(store => store.param.direction);
    const stationList = useRootSelector(store => store.param.stn_list);

    const charCounts = destIds.map(stnId => stationList[stnId].localisedName.zh?.length ?? 0);
    const minCharCounts = Math.min(...charCounts);
    const charSpacing =
        minCharCounts > 1 && charCounts[0] !== charCounts[1]
            ? Math.abs(charCounts[0] - charCounts[1]) / (minCharCounts - 1)
            : 0;

    return (
        <g textAnchor={textAnchor} {...others}>
            {destIds.map((id, i) => {
                const isLonger = charCounts[i] > charCounts[1 - i];
                const offsetRequired = !isSafari() && textAnchor === 'end' && !isLonger;
                return (
                    <Fragment key={id}>
                        <text
                            className="rmg-name__zh"
                            fontSize={25}
                            x={direction === ShortDirection.left ? 0 : -75}
                            y={-21 + 42 * i}
                            letterSpacing={isLonger ? '0em' : `${charSpacing}em`}
                            dx={!offsetRequired ? '0em' : `${charSpacing}em`}
                        >
                            {stationList[id].localisedName.zh}
                        </text>
                        <text
                            className="rmg-name__en"
                            fontSize={11.5}
                            x={direction === ShortDirection.left ? 0 : -75}
                            y={-1 + 42 * i}
                        >
                            {'Towards ' + stationList[id].localisedName.en?.replace('\\', ' ')}
                        </text>
                    </Fragment>
                );
            })}
            <text
                className="rmg-name__zh"
                fontSize={28}
                x={direction === ShortDirection.left ? 25 * (Math.max(...charCounts) + 1) : 0}
                y={5}
            >
                方向
            </text>
        </g>
    );
}
