import * as React from 'react';
import { ParamContext } from '../../../../context';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
}

const StationSHMetro = (props: Props) => {
    const { param } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    return (
        <>
            <use
                xlinkHref={
                    '#' + (stnInfo.transfer.info.reduce((acc, cur) => acc + cur.length, 0) ? 'int2_sh' : 'stn_sh')
                }
                stroke={props.stnState === -1 ? '#aaa' : 'var(--rmg-theme-colour)'}
                className="rmg-stn"
            />
            <g transform={`translate(${[...stnInfo.branch.left, ...stnInfo.branch.right].length ? 30 : 0},0)`}>
                <StationNameGElement name={stnInfo.name} infos={stnInfo.transfer.info} stnState={props.stnState} />
            </g>
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Name;
    infos: InterchangeInfo[][];
    stnState: -1 | 0 | 1;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameENLn = props.name[1].split('\\').length;

    // get the exact station name width so that the
    // interchange station icon can be right after the station name
    const stnNameEl = React.useRef<SVGGElement | null>(null);
    // the original name position
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(stnNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.name.toString()]
    );
    // the original name position's right x
    const x = bBox.width + 5;

    // rotate the station info now
    // other wise the bcr will be inaccurate due to the rotation
    // Chito: so, use BBox instead

    return (
        <g
            className="Name Future"
            transform={`translate(${-(24 + (nameENLn - 1) * 12) * Math.cos(-45)},${-4 -
                21.921875 -
                (nameENLn - 1) * 12 * Math.cos(-45)})rotate(-50)`}
            textAnchor="start"
        >
            <StationName ref={stnNameEl} name={props.name} />

            <IntBoxGroup
                intInfos={props.infos[1] ? ([] as InterchangeInfo[]).concat(...props.infos) : props.infos[0]}
                transform={`translate(${x},0)`}
            />

            {props.infos.flat().length && (<IntDecorationLine
                intInfos={props.infos[1] ? ([] as InterchangeInfo[]).concat(...props.infos) : props.infos[0]}
                x={x}
                transform={`translate(0,${props.name[1].split('\\').length * 12 + 3})`}
            />)}

            {props.infos[1]?.length && (
                <g transform={`translate(${x + props.infos.reduce((sum, infos) => sum + infos.length, 0) * 15},-30)`}>
                    <OSIText osiInfos={props.infos[1]} />
                </g>
            )}
        </g>
    );
};

const StationName = React.forwardRef((props: { name: Name }, ref: React.Ref<SVGGElement>) =>
    React.useMemo(
        () => (
            <g ref={ref}>
                <text className="rmg-name__zh">{props.name[0]}</text>
                <g fontSize={9.6}>
                    {props.name[1].split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__en" dy={12 * (i + 1)}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.name.toString()]
    )
);

const IntDecorationLine = (props: { intInfos: InterchangeInfo[] } & React.SVGProps<SVGGElement>) => {
    const { intInfos, x, ...others } = props;

    // Is it possible to merge the two calculation in one place?
    // another is in IntBoxGroup
    let dx = Number(x) + intInfos.reduce((sum, info) => {
        // start with digit
        const isLineNumber = Boolean(info[4].match(/^\d.*$/));
        // 20 + 5(margin) for number line
        // 60 + 5(margin) for letter line
        return sum + (isLineNumber ? 25 : info[4].length * 16 + 12 + 5);
    }, 0);
    dx -= 5; // minus the margin

    return (
        <g {...others}>
            <line x1="0" y1="0" x2={dx} y2="0" stroke='black' strokeWidth={0.8} />
        </g>
    );
};

const IntBoxGroup = (props: { intInfos: InterchangeInfo[] } & React.SVGProps<SVGGElement>) => {
    const { intInfos, ...others } = props;

    let dx = 0;
    return (
        <g {...others}>
            {intInfos.map((info, i) => {
                // start with digit
                const isLineNumber = Boolean(info[4].match(/^\d.*$/));
                const el = (
                    <g transform={`translate(${dx},0)`} key={i}>
                        {isLineNumber ? <IntBoxNumber info={info} /> : <IntBoxLetter info={info} />}
                    </g>
                );
                // 20 + 5(margin) for number line
                // 60 + 5(margin) for letter line
                dx += isLineNumber ? 25 : info[4].length * 16 + 12 + 5;
                return el;
            })}
        </g>
    );
};

const IntBoxNumber = React.memo(
    (props: { info: InterchangeInfo }) => (
        <>
            <rect height={30} width={20} y={-15} fill={props.info[2]} />
            <text x={10} className="rmg-name__zh" textAnchor="middle" fill={props.info[3]} dominantBaseline="central">
                {/* // line starts with numbers */}
                {props.info[4].match(/(\d*)\w+/)![0]}
            </text>
        </>
    ),
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const IntBoxLetter = React.memo(
    (props: { info: InterchangeInfo }) => {
        // box width: 16 * number of characters + 12
        const textCount = props.info[4].split('\\')[0].length;
        return (
            <>
                <rect height={30} width={textCount * 16 + 12} y={-15} fill={props.info[2]} />
                <text
                    x={textCount * 8 + 6}
                    className="rmg-name__zh"
                    textAnchor="middle"
                    fill={props.info[3]}
                    dominantBaseline="central"
                >
                    {props.info[4].split('\\')[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const OSIText = (props: { osiInfos: InterchangeInfo[] }) => {
    // get the all names from the out of station changes
    const lineNames = props.osiInfos.map(info => info[4]);
    return React.useMemo(
        () => (
            <g textAnchor="middle" fontSize="50%">
                <text className="rmg-name__zh rmg-name__shmetro--station">{'换乘' + lineNames.join('，')}</text>
                <text className="rmg-name__zh rmg-name__shmetro--station" dy={10}>
                    仅限公共交通卡
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lineNames.toString()]
    );
};
