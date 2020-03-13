import * as React from 'react';
import { ParamContext } from '../../../../context';
import { Name, InterchangeInfo } from '../../../../types';

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
                    '#' +
                    (stnInfo.transfer.type === 'none' ? 'stn_sh' : 'int2_sh') +
                    (props.stnState === -1 ? '_pass' : '')
                }
                className="rmg-stn"
            />
            <g transform={`translate(${[...stnInfo.branch.left, ...stnInfo.branch.right].length ? 30 : 0},0)`}>
                <StationNameGElement
                    name={stnInfo.name}
                    infos={stnInfo.transfer.info}
                    isOSI={stnInfo.transfer.type.includes('osi')}
                    stnState={props.stnState}
                />
            </g>
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Name;
    infos: InterchangeInfo[][];
    isOSI: boolean;
    stnState: -1 | 0 | 1;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameENLn = props.name[1].split('\\').length;

    // get the exact station name width so that the
    // interchange station icon can be right after the station name
    const stnNameEl = React.createRef<SVGGElement>();
    // the original name position
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(() => setBBox(stnNameEl.current.getBBox()), [props.name.toString()]);
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
            <g ref={stnNameEl}>
                <StationName name={props.name} />
            </g>
            <g transform={`translate(${x},0)`}>
                <IntBoxGroup intInfos={props.isOSI ? props.infos.flat() : props.infos[0]} stnState={props.stnState} />
            </g>
            {props.isOSI && (
                <g transform={`translate(${x + props.infos.flat().length * 15},-30)`}>
                    <OSIText osiInfos={props.infos[1]} />
                </g>
            )}
        </g>
    );
};

const StationName = (props: { name: Name }) => {
    return (
        <>
            <text className="rmg-name__zh rmg-name__shmetro--station">{props.name[0]}</text>
            {props.name[1].split('\\').map((txt, i) => (
                <text key={i} className="rmg-name__en rmg-name__shmetro--station" fontSize="60%" dy={12 * (i + 1)}>
                    {txt}
                </text>
            ))}
        </>
    );
};

const IntBoxGroup = (props: { intInfos: InterchangeInfo[]; stnState: -1 | 0 | 1 }) => {
    let dx = 0;
    return (
        <>
            {props.intInfos.map((info, i) => {
                const lineNumber = String(info[4]).match(/(\d*)\w+/);
                const el = (
                    <g transform={`translate(${dx},0)`} key={i}>
                        {lineNumber ? (
                            <IntBoxNumber info={info} stnState={props.stnState} />
                        ) : (
                            <IntBoxLetter info={info} stnState={props.stnState} />
                        )}
                    </g>
                );
                // 20 + 5(margin) for number line
                // 60 + 5(margin) for letter line
                dx += lineNumber ? 25 : 65;
                return el;
            })}
        </>
    );
};

const IntBoxNumber = (props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) => {
    // line starts with numbers or letters
    const lineNumber = String(props.info[4]).match(/(\d*)\w+/);

    return (
        <>
            <use
                xlinkHref="#int_sh_number"
                transform="translate(0,-12)"
                fill={props.info[2]}
                className={
                    'rmg-line__shmetro rmg-line__change' +
                    (props.stnState === -1 ? ' rmg-line__pass' : 'rmg-line__pass')
                }
            />
            {/* // Todo: fix this hard-coded center(10) position */}
            <text
                transform="translate(10,8)"
                className="rmg-name__zh rmg-name__shmetro--line_name"
                textAnchor="middle"
                fill={props.info[3]}
            >
                {lineNumber[0]}
            </text>
        </>
    );
};

const IntBoxLetter = (props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) => {
    return (
        <>
            <use
                xlinkHref="#int_sh_letter"
                transform="translate(0,-12)"
                fill={props.info[2]}
                className={
                    'rmg-line__shmetro rmg-line__change' +
                    (props.stnState === -1 ? ' rmg-line__pass' : 'rmg-line__pass')
                }
            />
            {/* // Todo: fix this hard-coded center(30) position */}
            <text
                transform="translate(30,8)"
                className="rmg-name__zh rmg-name__shmetro--line_name"
                textAnchor="middle"
                fill={props.info[3]}
            >
                {props.info[4]}
            </text>
        </>
    );
};

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
        [lineNames.toString()]
    );
};
