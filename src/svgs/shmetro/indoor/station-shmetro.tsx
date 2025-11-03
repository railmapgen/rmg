import { ColourHex } from '@railmapgen/rmg-palette-resources';
import { Fragment, Ref, SVGProps, forwardRef, useEffect, useMemo, useRef, useState, SVGAttributes } from 'react';
import { ExtendedInterchangeInfo, InterchangeGroup, Services } from '../../../constants/constants';
import { useRootSelector } from '../../../redux';
import { Translation } from '@railmapgen/rmg-translate';

/**
 * Which direction to display station name. Currently shmetro only.
 */
export type NameDirection = 'upward' | 'downward' | 'left' | 'right';

interface Props {
    stnId: string;
    nameDirection: NameDirection;
    services: Services[];
    color?: ColourHex; // Control the station color if coline is in effect.
}

export const StationSHMetro = (props: Props) => {
    const { stnId, nameDirection, services, color } = props;
    const stnInfo = useRootSelector(store => store.param.stn_list[stnId]);

    const transfer = [...(stnInfo.transfer.groups[0]?.lines || []), ...(stnInfo.transfer.groups[1]?.lines || [])];
    let stationIconStyle: string;
    if (stnInfo.services.length === 3) stationIconStyle = 'direct_indoor_sh';
    else if (stnInfo.services.length === 2) stationIconStyle = 'express_indoor_sh';
    else if (stnInfo.transfer.groups[1]?.lines?.length ?? 0 > 0) stationIconStyle = 'osi_indoor_sh';
    else if (transfer.length > 0) stationIconStyle = 'int2_indoor_sh';
    else stationIconStyle = 'stn_indoor_sh';

    const dr = nameDirection === 'left' || nameDirection === 'right' ? 90 : 0;
    return (
        <>
            <StationNameGElement
                name={stnInfo.localisedName}
                groups={stnInfo.transfer.groups}
                nameDirection={nameDirection}
                services={services}
            />
            <use
                xlinkHref={`#${stationIconStyle}`}
                stroke={transfer.length > 0 ? 'var(--rmg-black)' : (color ?? 'var(--rmg-theme-colour)')}
                transform={`rotate(${dr})`}
            />
            {/* This should be in IntBoxGroupProps, put here because the station icon will cover this */}
            {stnInfo.services.length > 1 && (
                <text className="rmg-name__zh" writingMode="tb" fontSize="60%" dy="-12">
                    {`大站车${stnInfo.services.length > 2 ? ' 直达车' : ''}停靠`}
                </text>
            )}
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Translation;
    groups: InterchangeGroup[];
    nameDirection: NameDirection;
    services: Services[];
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, groups, nameDirection, services } = props;
    const dy = { upward: 60, downward: -30, left: 0, right: 0 }[nameDirection];
    const osysi_dx =
        // only compute when there is an out-of-system transfer
        groups[2]?.lines?.length
            ? {
                  upward: 0,
                  downward: 0,
                  left: (groups[0].lines?.length || 0) + (groups[1]?.lines?.length || 0) !== 0 ? 85 : 25,
                  right: (groups[0].lines?.length || 0) + (groups[1]?.lines?.length || 0) !== 0 ? -85 : -25,
              }[nameDirection]
            : 0;
    const osysi_dy =
        // only compute when there is an out-of-system transfer
        groups[2]?.lines?.length
            ? {
                  upward:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -210
                          : groups[0]?.lines?.length || groups[1]?.lines?.length
                            ? -177.5
                            : -145,
                  downward:
                      (groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? 185
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? 157.5
                            : 125) + (services.length === 3 ? 40 : 0),
                  left:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -67
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? -30
                            : 0,
                  right:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -67
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? -30
                            : 0,
              }[nameDirection]
            : 0;
    const nameRef = useRef<SVGGElement | null>(null);
    const MIN_NAME_LINE_LENGTH = 60;
    const [nameWidth, setNameWidth] = useState(MIN_NAME_LINE_LENGTH);
    useEffect(() => {
        if (nameRef?.current) setNameWidth(Math.max(MIN_NAME_LINE_LENGTH, nameRef.current.getBBox().width));
    }, [name.zh, name.en]);
    return (
        <g transform={`translate(0,${dy})`}>
            {nameDirection === 'upward' || nameDirection === 'downward' ? (
                <>
                    <line
                        x1={-nameWidth / 2}
                        x2={nameWidth / 2}
                        y1={nameDirection === 'upward' ? -23 : -10}
                        y2={nameDirection === 'upward' ? -23 : -10}
                        stroke="black"
                    />
                    <line
                        y1={nameDirection === 'upward' ? -23 : -10}
                        y2={nameDirection === 'upward' ? -23 - 25 : 20}
                        stroke="black"
                    />
                </>
            ) : (
                <>
                    <line
                        x1={nameDirection === 'left' ? -50 : 15}
                        x2={nameDirection === 'left' ? -15 : 50}
                        y1={0}
                        y2={0}
                        stroke="black"
                    />
                    <line
                        x1={nameDirection === 'left' ? -50 : 50}
                        x2={nameDirection === 'left' ? -50 : 50}
                        y1={-30}
                        y2={30}
                        stroke="black"
                    />
                </>
            )}

            {[...(groups[0].lines || []), ...(groups[1]?.lines || [])].length && (
                <IntBoxGroup
                    intInfos={[groups[0].lines || [], groups[1]?.lines || []]}
                    arrowDirection={nameDirection}
                    services={services}
                />
            )}

            <StationName ref={nameRef} stnName={name} nameDirection={nameDirection} fill="black" />

            {groups[2]?.lines?.length && (
                <g transform={`translate(${osysi_dx},${osysi_dy})`}>
                    <OSysIText osysiInfos={groups[2].lines} nameDirection={nameDirection} />
                </g>
            )}
        </g>
    );
};

const StationName = forwardRef(function StationName(
    props: { stnName: Translation; nameDirection: NameDirection } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { stnName, nameDirection, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = stnName;
    const name = zhName.split('\\');
    const nameENLn = enName.split('\\').length;
    const dx = { upward: 0, downward: 0, left: -60, right: 60 }[nameDirection];
    const dy = {
        upward: -2,
        downward: -30 - 12 * (nameENLn - 1),
        left: -10 * (nameENLn - 1),
        right: -10 * (nameENLn - 1),
    }[nameDirection];
    const anchor = (
        { upward: 'middle', downward: 'middle', left: 'end', right: 'start' } satisfies Record<
            string,
            SVGAttributes<SVGGElement>['textAnchor']
        >
    )[nameDirection];

    return (
        <g ref={ref} {...others} textAnchor={anchor} transform={`translate(${dx},${dy})`}>
            {useMemo(
                () => (
                    <>
                        {name.map((txt, i, array) => (
                            <text
                                key={i}
                                className="rmg-name__zh"
                                dy={nameDirection === 'upward' ? 16 * i : (array.length - 1 - i) * -16}
                            >
                                {txt}
                            </text>
                        ))}
                        <g fontSize={9.6}>
                            {enName.split('\\')?.map((txt, i) => (
                                <text
                                    key={i}
                                    className="rmg-name__en"
                                    dy={
                                        12 * (i + 1) +
                                        (nameDirection === 'upward' ? (name.length > 1 ? name.length * 7.5 : 0) : 0)
                                    }
                                >
                                    {txt}
                                </text>
                            ))}
                        </g>
                    </>
                ),
                [zhName, enName]
            )}
        </g>
    );
});

interface IntBoxGroupProps {
    intInfos: ExtendedInterchangeInfo[][];
    arrowDirection: NameDirection;
    services: Services[];
}

const IntBoxGroup = (props: IntBoxGroupProps & SVGProps<SVGGElement>) => {
    const { intInfos, arrowDirection, services } = props;

    // name each different linearGradient that will fill the arrow
    const intNameId = intInfos
        .flatMap(intInfo => intInfo.map(info => info.theme?.[2]))
        .reduce((name, color) => name + color, '');

    // get the interchange line names
    const lineNames = intInfos.map(intInfo =>
        [
            intInfo
                .filter(info => info.name[0].match(/^\d+.*$/))
                .map(info => info.name[0].replace(/^(\d+)(.*)$/, '$1'))
                .join('，')
                .concat('号线'),
            intInfo
                .filter(info => !info.name[0].match(/^\d+.*$/))
                .map(info => info.name[0])
                .join('，'),
        ]
            .filter(name => name && name !== '号线')
            .join('，')
    );
    const lineNamesEn = intInfos.map(intInfo =>
        [
            'Line '.concat(
                // contact number lines to Line 1,2,3...
                intInfo
                    .filter(info => /^(L|l)ine \d+$/.test(info.name[1]))
                    .map(info => info.name[1].replace('Line', '').replace('line', '').trim())
                    .join(',')
            ),
            // and then add text lines without any change
            intInfo
                .filter(info => !/^(L|l)ine \d+$/.test(info.name[1]))
                .map(info => info.name[1])
                .join(', '),
        ]
            .filter(name => name && name !== 'Line ')
            .join(', ')
    );

    // for services contains three level (normal, express, direct)
    // additional length is required on transfer arrow otherwise
    // the station icon will be longer than the arrow itself
    const arrowLength = services.length === 3 ? 80 : 45;
    const transfer_dy = { upward: -145, downward: 125 + (services.length === 3 ? 40 : 0), left: 7, right: 7 }[
        arrowDirection
    ];

    // bunch of constants for all four directions
    const arrow_dx = { upward: 0, downward: 0, left: 20, right: -20 }[arrowDirection];
    const arrow_dy = { upward: -74, downward: 44, left: 0, right: 0 }[arrowDirection];
    const arrow_dr = { upward: 0, downward: 180, left: 90, right: -90 }[arrowDirection];
    const transfer_dx = { upward: 0, downward: 0, left: 85, right: -85 }[arrowDirection];
    const transfer_anchor = (
        { upward: 'middle', downward: 'middle', left: 'start', right: 'end' } satisfies Record<
            string,
            SVGAttributes<SVGGElement>['textAnchor']
        >
    )[arrowDirection];

    const osi_dx = transfer_dx;
    const osi_dy = {
        upward: (intInfos.at(0)?.length ?? 0) ? -177.5 : -145,
        downward: ((intInfos.at(0)?.length ?? 0) ? 157.5 : 125) + (services.length === 3 ? 40 : 0),
        left: (intInfos.at(0)?.length ?? 0) ? -30 : 7,
        right: (intInfos.at(0)?.length ?? 0) ? -30 : 7,
    }[arrowDirection];

    return (
        <g>
            <path
                id="int_indoor_arrow_sh"
                stroke="var(--rmg-black)"
                strokeWidth={1}
                transform={`translate(${arrow_dx},${arrow_dy})rotate(${arrow_dr})`}
                fill={intInfos.flat().length === 1 ? intInfos.flat()[0].theme?.[2] : `url(#grad${intNameId})`}
                d={`M -7.5,0 v -${arrowLength} h -7.5 l 15,-15 l 15,15 h -7.5 v ${arrowLength} Z`}
            />

            {intInfos.flat().length > 1 && (
                <linearGradient
                    id={`grad${intNameId}`}
                    y1="0"
                    y2="0"
                    x1={arrowDirection === 'upward' ? '25%' : '75%'}
                    x2={arrowDirection === 'upward' ? '75%' : '25%'}
                >
                    {intInfos.flat().map((intInfo, i) => (
                        <Fragment key={i}>
                            {/* more about React.Fragment on https://stackoverflow.com/a/59390967 */}
                            <stop // start from
                                offset={`${(100 / intInfos.flat().length) * i}%`}
                                stopColor={intInfo.theme?.[2]}
                            />
                            <stop // to
                                offset={`${(100 / intInfos.flat().length) * (i + 1)}%`}
                                stopColor={intInfo.theme?.[2]}
                            />
                        </Fragment>
                    ))}
                </linearGradient>
            )}

            {(intInfos.at(0)?.length ?? 0) > 0 && (
                <g transform={`translate(${transfer_dx},${transfer_dy})`} textAnchor={`${transfer_anchor}`}>
                    <text className="rmg-name__zh" dy={-7}>
                        {`换乘${lineNames[0]}`}
                    </text>
                    <text className="rmg-name__en" dy={5} fontSize={9.6}>
                        {`Interchange ${lineNamesEn[0]}`}
                    </text>
                </g>
            )}
            {(intInfos.at(1)?.length ?? 0) > 0 && (
                <g transform={`translate(${osi_dx},${osi_dy})`} textAnchor={`${transfer_anchor}`}>
                    <text className="rmg-name__zh" dy={-7}>
                        {`出站换乘${lineNames[1]}`}
                    </text>
                    <text className="rmg-name__en" dy={5} fontSize={9.6}>
                        {`Out-of-station Transfer ${lineNamesEn[1]}`}
                    </text>
                </g>
            )}
        </g>
    );
};

const OSysIText = (props: { osysiInfos: ExtendedInterchangeInfo[]; nameDirection: NameDirection }) => {
    const anchor = (
        { upward: 'middle', downward: 'middle', left: 'start', right: 'end' } satisfies Record<
            string,
            SVGAttributes<SVGGElement>['textAnchor']
        >
    )[props.nameDirection];
    return useMemo(
        () => (
            <g textAnchor={`${anchor}`}>
                <text className="rmg-name__zh" dy={-5}>
                    {`转乘${props.osysiInfos.map(info => info.name[0]).join('，')}`}
                </text>
                <text className="rmg-name__en" dy={7.5} fontSize={9.6}>
                    {`To ${props.osysiInfos.map(info => info.name[1]).join(', ')}`}
                </text>
            </g>
        ),
        [JSON.stringify(props.osysiInfos), props.nameDirection]
    );
};
