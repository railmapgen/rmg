import React from 'react';
import { InterchangeInfo, Name, Services } from '../../constants/constants';
import { useAppSelector } from '../../redux';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    nameDirection: 'upward' | 'downward';
    services: Services[];
}

const StationSHMetro = (props: Props) => {
    const param = useAppSelector(store => store.param);
    const stnInfo = param.stn_list[props.stnId];

    let stationIconStyle = '';
    if (stnInfo.services.length === 3) stationIconStyle = 'direct_indoor_sh';
    else if (stnInfo.services.length === 2) stationIconStyle = 'express_indoor_sh';
    else if ([...stnInfo.transfer.info[0], ...(stnInfo.transfer.info[1] || [])].length > 0)
        stationIconStyle = 'int2_indoor_sh';
    else stationIconStyle = 'stn_indoor_sh';

    return (
        <>
            <StationNameGElement
                name={stnInfo.name}
                infos={stnInfo.transfer.info}
                stnState={props.stnState}
                direction={param.direction}
                nameDirection={props.nameDirection}
                services={props.services}
            />
            <use xlinkHref={`#${stationIconStyle}`} stroke="var(--rmg-theme-colour)" />
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
    name: Name;
    infos: InterchangeInfo[][];
    stnState: -1 | 0 | 1;
    direction: 'l' | 'r';
    nameDirection: 'upward' | 'downward';
    services: Services[];
}

const StationNameGElement = (props: StationNameGElementProps) => {
    return (
        <g transform={`translate(0,${props.nameDirection === 'upward' ? 60 : -30})`}>
            <line
                x1={-30}
                x2={30}
                y1={props.nameDirection === 'upward' ? -23 : -10}
                y2={props.nameDirection === 'upward' ? -23 : -10}
                stroke="black"
            />
            <line
                y1={props.nameDirection === 'upward' ? -23 : -10}
                y2={props.nameDirection === 'upward' ? -23 - 25 : 20}
                stroke="black"
            />

            {[...props.infos[0], ...(props.infos[1] || [])].length > 0 && (
                <IntBoxGroup
                    intInfos={[...props.infos[0], ...(props.infos[1] || [])]}
                    arrowDirection={props.nameDirection}
                    services={props.services}
                />
            )}

            <StationName stnName={props.name} nameDirection={props.nameDirection} fill="black" />

            {props.infos[1]?.length > 0 && (
                <g transform={`translate(0,${props.nameDirection === 'upward' ? -185 : 150})`}>
                    <OSIText osiInfos={props.infos[1]} />
                </g>
            )}

            {props.infos[2]?.length > 0 && (
                <g
                    transform={`translate(0,${
                        props.nameDirection === 'upward'
                            ? props.infos[1]?.length
                                ? -210
                                : props.infos[0].length
                                ? -180
                                : -100
                            : (props.infos[1]?.length ? 190 : props.infos[0].length ? 160 : 75) +
                              (props.services.length === 3 ? 40 : 0)
                    })`}
                >
                    <OSysIText osysiInfos={props.infos[2]} />
                </g>
            )}
        </g>
    );
};

const StationName = React.forwardRef(
    (
        props: { stnName: Name; nameDirection: 'upward' | 'downward' } & React.SVGProps<SVGGElement>,
        ref: React.Ref<SVGGElement>
    ) => {
        const { stnName, nameDirection, ...others } = props;
        const name = stnName[0].split('\\');
        const nameENLn = stnName[1].split('\\').length;

        return (
            <g
                ref={ref}
                {...others}
                textAnchor="middle"
                transform={`translate(0,${nameDirection === 'upward' ? -2 : -30 - 12 * (nameENLn - 1)})`}
            >
                {React.useMemo(
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
                                {stnName[1].split('\\').map((txt, i) => (
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
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    [...stnName]
                )}
            </g>
        );
    }
);

interface IntBoxGroupProps {
    intInfos: InterchangeInfo[];
    arrowDirection: 'upward' | 'downward';
    services: Services[];
}

const IntBoxGroup = (props: IntBoxGroupProps & React.SVGProps<SVGGElement>) => {
    const { intInfos, arrowDirection, services } = props;

    // name each different linearGradient that will fill the arrow
    const intNameId = intInfos.map(intInfo => intInfo[2]).reduce((name, color) => name + color, '');

    // get the interchange line names
    const lineNames = [
        intInfos
            .filter(intInfo => intInfo[4].match(/^\d+.*$/))
            .map(intInfo => intInfo[4].replace(/^(\d+)(.*)$/, '$1'))
            .join('，')
            .concat('号线'),
        intInfos
            .filter(intInfo => !intInfo[4].match(/^\d+.*$/))
            .map(intInfo => intInfo[4])
            .join('，'),
    ]
        .filter(name => name && name !== '号线')
        .join('，');
    const lineNamesEn = [
        'Line '.concat(
            intInfos
                .filter(intInfo => intInfo[5].match(/^L|line$/))
                .map(intInfo => intInfo[5].replace('Line', '').replace('line', '').trim())
                .join(',')
        ),
        intInfos
            .filter(intInfo => !intInfo[5].match(/^L|line$/))
            .map(intInfo => intInfo[5])
            .join('，'),
    ]
        .filter(name => name && name !== 'Line ')
        .join(',');

    // for services contains three level (normal, express, direct)
    // additional length is required on transfer arrow otherwise
    // the station icon will be longer than the arrow itself
    const arrowLength = services.length === 3 ? 80 : 45;
    const transferDy = arrowDirection === 'upward' ? -145 : 125 + (services.length === 3 ? 40 : 0);

    return (
        <g>
            <path
                id="int_indoor_arrow_sh"
                stroke="var(--rmg-black)"
                strokeWidth={1}
                transform={`translate(0,${arrowDirection === 'upward' ? -74 : 44})rotate(${
                    arrowDirection === 'upward' ? 0 : 180
                })`}
                fill={intInfos.length === 1 ? intInfos[0][2] : `url(#grad${intNameId})`}
                d={`M -7.5,0 v -${arrowLength} h -7.5 l 15,-15 l 15,15 h -7.5 v ${arrowLength} Z`}
            />

            {intInfos.length > 1 && (
                <>
                    <linearGradient
                        id={`grad${intNameId}`}
                        y1="0"
                        y2="0"
                        x1={arrowDirection === 'upward' ? '25%' : '75%'}
                        x2={arrowDirection === 'upward' ? '75%' : '25%'}
                    >
                        {intInfos.map((intInfo, i) => (
                            <React.Fragment key={i}>
                                {/* more about React.Fragment on https://stackoverflow.com/a/59390967 */}
                                <stop // start from
                                    offset={`${(100 / intInfos.length) * (i + 0)}%`}
                                    stopColor={intInfo[2]}
                                />
                                <stop // to
                                    offset={`${(100 / intInfos.length) * (i + 1)}%`}
                                    stopColor={intInfo[2]}
                                />
                            </React.Fragment>
                        ))}
                    </linearGradient>

                    {/* a range inplementation [0, 1, 2 ... intInfos.length - 1] */}
                    {/* {[...Array(intInfos.length - 1).keys()].map(i => (<line
                x1={-7.5 + (15 / intInfos.length) * (i + 1)}
                x2={-7.5 + (15 / intInfos.length) * (i + 1)}
                y1="-74"
                y2={-104 - 7.5 - 7.5 / (intInfos.length - 1) * (i+1)}
                stroke="black"
            />))} */}
                </>
            )}

            <g transform={`translate(0,${transferDy})`} textAnchor="middle">
                <text className="rmg-name__zh" dy={-7}>
                    {`换乘${lineNames}`}
                </text>
                <text className="rmg-name__en" dy={5} fontSize={9.6}>
                    {`Interchange ${lineNamesEn}`}
                </text>
            </g>
        </g>
    );
};

const OSIText = (props: { osiInfos: InterchangeInfo[] }) => {
    return React.useMemo(
        () => (
            <g textAnchor="middle" fontSize="50%">
                <text className="rmg-name__zh" dy={-5}>
                    {`换乘${props.osiInfos.map(info => info[4]).join('，')}`}
                </text>
                <text className="rmg-name__zh" dy={5}>
                    仅限公共交通卡
                </text>
                <text className="rmg-name__en" dy={12.5} fontSize="75%">
                    Only for Public Transportation Card
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.osiInfos.toString()]
    );
};

const OSysIText = (props: { osysiInfos: InterchangeInfo[] }) => {
    return React.useMemo(
        () => (
            <g textAnchor="middle">
                <text className="rmg-name__zh" dy={-5}>
                    {`转乘${props.osysiInfos.map(info => info[4]).join('，')}`}
                </text>
                <text className="rmg-name__en" dy={7.5} fontSize={9.6}>
                    {`To ${props.osysiInfos.map(info => info[5]).join(', ')}`}
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.osysiInfos.toString()]
    );
};
