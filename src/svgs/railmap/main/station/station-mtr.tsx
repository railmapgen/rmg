import * as React from 'react';
import { ParamContext } from '../../../../context';
import { Name, InterchangeInfo, StationTransfer } from '../../../../types';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    namePos: boolean;
    stnY?: number;
}

const StationMTR = (props: Props) => {
    const { param } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    /**
     * Arrays of directions of the branches a station has.
     */
    const branchPos = React.useMemo(() => {
        let pos: ('SE' | 'NE' | 'SW' | 'NW')[] = [];
        if (stnInfo.children.length === 2) {
            pos.push(stnInfo.children.indexOf(stnInfo.branch.right[1]) === 1 ? 'SE' : 'NE');
        }
        if (stnInfo.parents.length === 2) {
            pos.push(stnInfo.parents.indexOf(stnInfo.branch.left[1]) === 1 ? 'SW' : 'NW');
        }
        return pos;
    }, [stnInfo.parents.toString(), stnInfo.children.toString(), JSON.stringify(stnInfo.branch)]);

    /**
     * Affix added to station icon's `href`.
     */
    const branchAffix = React.useMemo(() => {
        let pos = branchPos;
        if (pos.length === 0) {
            return '';
        }
        if (pos.includes('NW') && pos.includes('SE')) {
            return '_bb';
        }
        if (pos.includes('NE') && pos.includes('SW')) {
            return '_bb';
        }
        return '_b';
    }, [branchPos.toString()]);

    /**
     * Changes of vertical position of station icon due to branching shift (11px/line width). Icon rotation should also be applied when using this property.
     */
    const branchDy = React.useMemo(() => {
        let affix = branchAffix;
        if (affix === '') {
            return 0;
        } else if (affix === '_bb') {
            return props.namePos ? 9.68 : -9.68;
        } else {
            let pos = branchPos;
            if (pos.includes('SE') || pos.includes('SW')) {
                return props.namePos ? 9.68 : 0;
            }
            if (pos.includes('NE') || pos.includes('NW')) {
                return props.namePos ? 0 : -9.68;
            }
        }
    }, [branchPos.toString(), branchAffix, props.namePos]);

    /**
     * Changes of vertical position of other elements such as intTick or intName. The result of the ternary operator is the opposite of `this._branchDy`
     */
    const branchElDy = React.useMemo(() => {
        let affix = branchAffix;
        if (affix === '') {
            return 0;
        } else if (affix === '_bb') {
            return props.namePos ? -9.68 : 9.68;
        } else {
            let pos = branchPos;
            if (pos.includes('SE') || pos.includes('SW')) {
                return props.namePos ? 0 : 9.68;
            }
            if (pos.includes('NE') || pos.includes('NW')) {
                return props.namePos ? -9.68 : 0;
            }
        }
    }, [branchAffix, props.namePos, branchPos]);

    const stnIcon = (({ type }) => {
        switch (type) {
            case 'int3':
            case 'osi31':
                return 'int3';
            case 'osi11':
            case 'osi21':
                return 'osi11';
            case 'osi12':
            case 'osi13':
                return 'osi12';
            case 'osi22':
                if (stnInfo.parents[0] === 'linestart' || stnInfo.children[0] === 'lineend') {
                    return 'osi22end';
                } else {
                    return 'osi12';
                }
            default:
                return 'stn';
        }
    })(stnInfo.transfer);

    return (
        <>
            <g style={{ transform: `translateY(${branchElDy}px)` }}>
                <IntTickGroup
                    variant={
                        stnInfo.transfer.type === 'osi22' &&
                        (stnInfo.parents[0] === 'linestart' || stnInfo.children[0] === 'lineend')
                            ? 'osi22end'
                            : stnInfo.transfer.type
                    }
                    stnTrans={stnInfo.transfer}
                    stnState={props.stnState}
                    namePos={props.namePos}
                    end={stnIcon === 'osi22end' ? (stnInfo.parents[0] === 'linestart' ? 'left' : 'right') : null}
                />
                {stnIcon.includes('osi') && (
                    <OSIName
                        name={stnInfo.transfer.osi_names[0]}
                        stnState={props.stnState}
                        variant={
                            stnInfo.transfer.type === 'osi22' &&
                            (stnInfo.parents[0] === 'linestart' || stnInfo.children[0] === 'lineend')
                                ? 'osi22end'
                                : (stnInfo.transfer.type as any)
                        }
                        tickDirec={stnInfo.transfer.tick_direc}
                        namePos={props.namePos}
                        end={stnIcon === 'osi22end' ? (stnInfo.parents[0] === 'linestart' ? 'left' : 'right') : null}
                    />
                )}
            </g>
            <use
                xlinkHref={'#' + stnIcon + branchAffix}
                className={
                    (props.stnState === -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future') +
                    (stnInfo.transfer.paid_area ? ' rmg-stn__mtr--paid-osi' : ' rmg-stn__mtr--unpaid-osi')
                }
                style={{
                    transform:
                        `translateY(${branchDy}px)` +
                        `scale(${stnInfo.children[0] === 'lineend' ? 1 : -1},${props.namePos ? -1 : 1})`,
                }}
            />
            <g style={{ transform: `translateY(${branchDy}px)` }}>
                <StationNameGElement
                    name={stnInfo.name}
                    namePos={props.namePos}
                    stnState={props.stnState}
                    facility={stnInfo.facility}
                    nameDX={
                        stnInfo.transfer.type === 'osi22' && stnIcon === 'osi12'
                            ? stnInfo.transfer.tick_direc === 'l'
                                ? 3
                                : -3
                            : null
                    }
                />
            </g>
        </>
    );
};

export default StationMTR;

interface StationNameGElementProps {
    name: Name;
    namePos: boolean;
    stnState: -1 | 0 | 1;
    nameDX?: number;
    facility: '' | 'airport' | 'hsr' | 'disney';
}

const StationNameGElement = (props: StationNameGElementProps) => {
    /**
     * Top (in pixels) of station's Chinese name.
     */
    const NAME_ZH_TOP = -10.8125;
    /**
     * Height (in pixels) of station's Chinese name.
     */
    const NAME_ZH_HEIGHT = 21.625;
    /**
     * Top (in pixels) of station's English name (1 line).
     */
    const NAME_EN_TOP = -8;
    /**
     * Height (in pixels) of station's English name (1 line).
     */
    const NAME_EN_HEIGHT = 13.21875;
    /**
     * Difference of `y`s of station's Chinese name and English name (1 line). (This number should used as the `dy` of the English `text` element after Chinese `text` elements. )
     */
    const NAME_ZH_EN_GAP = 17;
    /**
     * Height (in pixels) from the top of station's Chinese name to the bottom of English name (1 line).
     */
    const NAME_FULL_HEIGHT = -NAME_ZH_TOP + NAME_ZH_EN_GAP + NAME_EN_HEIGHT + NAME_EN_TOP;
    /**
     * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name.
     */
    const STN_NAME_LINE_GAP = 14;

    const stnNameEl = React.createRef<SVGGElement>();
    const [bBox, setBBox] = React.useState({ width: 0, x: 0 } as DOMRect);
    React.useEffect(() => {
        if (props.stnState !== 0) return;
        setBBox(stnNameEl.current.getBBox());
    }, [props.stnState, props.name.toString()]);

    const dy = props.namePos
        ? STN_NAME_LINE_GAP - NAME_ZH_TOP
        : -STN_NAME_LINE_GAP - NAME_ZH_TOP - NAME_FULL_HEIGHT - (props.name[1].split('\\').length - 1) * 11;

    const textAnchor = !props.nameDX ? 'middle' : props.nameDX > 0 ? 'start' : 'end';
    const osi22DY = !props.nameDX ? 0 : props.namePos ? 11.515625 : -11.515625;

    const facilityX = !props.nameDX
        ? -(bBox.width + 3) / 2
        : props.nameDX > 0
        ? props.nameDX + (NAME_FULL_HEIGHT + 2) / 2
        : -(NAME_FULL_HEIGHT + 2) / 2 - bBox.width + props.nameDX;
    const facilityNameDX =
        props.facility === ''
            ? 0
            : !props.nameDX
            ? (NAME_FULL_HEIGHT + 2 + 3) / 2
            : props.nameDX < 0
            ? 0
            : NAME_FULL_HEIGHT + 2 + 3 + props.nameDX;

    return (
        <g
            textAnchor={textAnchor}
            style={{ transform: `translateY(${dy + osi22DY}px)` }}
            className={`Name ${props.stnState === -1 ? 'Pass' : props.stnState === 0 ? 'Current' : 'Future'}`}
        >
            {props.stnState === 0 && (
                <rect
                    id="current_bg"
                    x={bBox.x - 3 + (facilityNameDX === 0 ? 0 : facilityNameDX - 1)}
                    y={NAME_ZH_TOP - 1}
                    width={bBox.width + 6 + (facilityNameDX === 0 ? 0 : 1)}
                    height={NAME_FULL_HEIGHT + (props.name[1].split('\\').length - 1) * 11 + 2}
                />
            )}
            {props.facility !== '' && (
                <use
                    xlinkHref={'#' + props.facility}
                    fill={props.stnState === -1 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                    x={facilityX}
                    y={NAME_ZH_TOP - 1 + (props.name[1].split('\\').length - 1) * 5.5}
                />
            )}
            <g ref={stnNameEl} style={{ transform: `translateX(${facilityNameDX}px)` }}>
                <StationName name={props.name} nameGap={NAME_ZH_EN_GAP} />
            </g>
        </g>
    );
};

interface StationNameProps {
    name: Name;
    nameGap: number;
}

const StationName = React.memo(
    (props: StationNameProps) => {
        return (
            <>
                <text className="rmg-name__zh rmg-name__mtr--station">{props.name[0]}</text>
                {props.name[1].split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en rmg-name__mtr--station" dy={props.nameGap + i * 11}>
                        {txt}
                    </text>
                ))}
            </>
        );
    },
    (prevProps, nextProps) =>
        prevProps.name.toString() === nextProps.name.toString() && prevProps.nameGap === nextProps.nameGap
);

interface IntTickGroupProps {
    variant: 'int2' | 'int3' | 'osi11' | 'osi12' | 'osi22' | 'osi22end' | 'none' | 'osi13' | 'osi21' | 'osi31';
    stnTrans: StationTransfer;
    stnState: -1 | 0 | 1;
    namePos: boolean;
    end?: 'left' | 'right';
}

const IntTickGroup = (props: IntTickGroupProps) => {
    switch (props.variant) {
        case 'int2':
            return (
                <g>
                    <IntTick
                        intInfo={props.stnTrans.info[0][0]}
                        stnState={props.stnState}
                        rotation={props.namePos ? 180 : 0}
                    />
                </g>
            );
        case 'int3':
        case 'osi31':
            return (
                <>
                    {props.stnTrans.info[0].map((intInfo, i) => (
                        <g
                            key={i}
                            style={{
                                transform: `translateY(${
                                    !props.namePos ? 18 * (i + 1) : -18 * (props.stnTrans.info[0].length - i)
                                }px)`,
                            }}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={props.stnState}
                                rotation={props.stnTrans.tick_direc === 'r' ? -90 : 90}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi11':
        case 'osi21':
            return (
                <g
                    style={{
                        transform: `translateY(${props.namePos ? -26 : 26}px)`,
                    }}
                >
                    <IntTick
                        intInfo={props.stnTrans.info[1][0]}
                        stnState={props.stnState}
                        rotation={props.namePos ? 180 : 0}
                    />
                </g>
            );
        case 'osi12':
        case 'osi13':
            return (
                <>
                    {props.stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            style={{
                                transform: `translateY(${
                                    !props.namePos ? 8 + 18 * (i + 1) : -8 - 18 * (props.stnTrans.info[1].length - i)
                                }px)`,
                            }}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={props.stnState}
                                rotation={props.stnTrans.tick_direc === 'r' ? -90 : 90}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22':
            return (
                <>
                    <g>
                        <IntTick
                            intInfo={props.stnTrans.info[0][0]}
                            stnState={props.stnState}
                            rotation={props.namePos ? 0 : 180}
                            nameDX={props.stnTrans.tick_direc === 'r' ? 3 : -3}
                        />
                    </g>
                    {props.stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            style={{
                                transform: `translateY(${
                                    !props.namePos ? 8 + 18 * (i + 1) : -8 - 18 * (props.stnTrans.info[1].length - i)
                                }px)`,
                            }}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={props.stnState}
                                rotation={props.stnTrans.tick_direc === 'r' ? -90 : 90}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22end':
            return (
                <>
                    <g>
                        <IntTick
                            intInfo={props.stnTrans.info[0][0]}
                            stnState={props.stnState}
                            rotation={props.namePos ? 180 : 0}
                        />
                    </g>
                    {props.stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            style={{
                                transform: `translate(${props.end === 'left' ? -41 : 41}px,${
                                    props.namePos ? 18 * i : -18 * (props.stnTrans.info[1].length - 1 - i)
                                }px)`,
                            }}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={props.stnState}
                                rotation={props.end === 'left' ? 90 : -90}
                            />
                        </g>
                    ))}
                </>
            );
        default:
            return <></>;
    }
};

interface IntTickProps {
    intInfo: InterchangeInfo;
    stnState: -1 | 0 | 1;
    rotation: 0 | 90 | 180 | -90;
    nameDX?: number;
}

const IntTick = (props: IntTickProps) => {
    const nameZHLns = props.intInfo[4].split('\\').length;
    const nameENLns = props.intInfo[5].split('\\').length;

    const x = (rotation => {
        switch (rotation) {
            case 90:
                return -24;
            case -90:
                return 24;
            default:
                return 0;
        }
    })(props.rotation);

    const y = (rotation => {
        switch (rotation) {
            case 0:
                return 25 + 5.953125;
            case 180:
                return -25 + 5.953125 - 18.65625 - 10 * (nameZHLns - 1) - 7 * (nameENLns - 1);
            default:
                return 5.953125 - (19.65625 + 10 * (nameZHLns - 1) + 7 * (nameENLns - 1) - 1) / 2;
        }
    })(props.rotation);

    const textAnchor = (rotation => {
        switch (rotation) {
            case 90:
                return 'end';
            case -90:
                return 'start';
            default:
                if (!props.nameDX) {
                    return 'middle';
                } else if (props.nameDX > 0) {
                    return 'start';
                } else {
                    return 'end';
                }
        }
    })(props.rotation);

    return React.useMemo(
        () => (
            <>
                <use
                    xlinkHref="#inttick"
                    stroke={props.intInfo[2]}
                    style={{ transform: `rotate(${props.rotation}deg)` }}
                    className={
                        'rmg-line rmg-line__mtr rmg-line__change' + (props.stnState === -1 ? ' rmg-line__pass' : '')
                    }
                />
                <g
                    textAnchor={textAnchor}
                    style={{
                        transform: `translate(${x + (props.nameDX || 0)}px,${y}px)`,
                    }}
                    className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}
                >
                    {props.intInfo[4].split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__zh IntName" dy={10 * i}>
                            {txt}
                        </text>
                    ))}
                    {props.intInfo[5].split('\\').map((txt, i) => (
                        <text key={nameZHLns + i} className="rmg-name__en IntName" dy={nameZHLns * 10 - 1 + 7 * i}>
                            {txt}
                        </text>
                    ))}
                </g>
            </>
        ),
        [props.intInfo.toString(), props.rotation, props.stnState]
    );
};

interface OSINameProps {
    name: Name;
    stnState: -1 | 0 | 1;
    variant: 'osi11' | 'osi12' | 'osi13' | 'osi22' | 'osi22end' | 'osi31' | 'osi21';
    tickDirec: 'l' | 'r';
    namePos: boolean;
    end?: 'left' | 'right';
}

const OSIName = (props: OSINameProps) => {
    const textAnchor = (variant => {
        switch (variant) {
            case 'osi11':
            case 'osi21':
                return props.tickDirec === 'l' ? 'end' : 'start';
            case 'osi22':
                return props.tickDirec === 'l' ? 'start' : 'end';
            default:
                return 'middle';
        }
    })(props.variant);

    const x = (variant => {
        switch (variant) {
            case 'osi11':
            case 'osi21':
                return props.tickDirec === 'l' ? -13 : 13;
            case 'osi22':
                return props.tickDirec === 'l' ? 13 : -13;
            case 'osi22end':
                return props.end === 'left' ? -41 : 41;
            default:
                return 0;
        }
    })(props.variant);

    const y = (variant => {
        switch (variant) {
            case 'osi11':
            case 'osi21':
                return (
                    (!props.namePos ? 26 : -26) +
                    8.34375 -
                    25.03125 / 2 -
                    (!props.namePos ? 0 : 10 * (props.name[1].split('\\').length - 1))
                );
            case 'osi12':
                return !props.namePos
                    ? 26 + 18 + 10 + 8.34375
                    : -(26 + 18 + 10) + 8.34375 - 25.03125 - 10 * (props.name[1].split('\\').length - 1);
            case 'osi22':
                return (
                    (!props.namePos ? 26 - 18 : -8) -
                    (props.namePos ? 18 + 9 : -27) +
                    8.34375 -
                    25.03125 / 2 -
                    5 * (props.name[1].split('\\').length - 1)
                );
            case 'osi22end':
                return !props.namePos
                    ? 10 + 8.34375
                    : -10 + 8.34375 - 25.03125 - 10 * (props.name[1].split('\\').length - 1);
            default:
                return 0;
        }
    })(props.variant);

    return (
        <g
            textAnchor={textAnchor}
            style={{ transform: `translate(${x}px,${y}px)` }}
            className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}
        >
            <text className="rmg-name__zh rmg-name__mtr--osi">{props.name[0]}</text>
            {props.name[1].split('\\').map((txt, i) => (
                <text key={i} className="rmg-name__en rmg-name__mtr--osi" dy={12 + 10 * i}>
                    {txt}
                </text>
            ))}
        </g>
    );
};
