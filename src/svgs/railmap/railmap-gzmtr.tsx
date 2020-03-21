import * as React from 'react';
import { ParamContext } from '../../context';
import StripGZMTR from '../strip/strip-gzmtr';
import MainGZMTR from './main/main-gzmtr';
import { Note } from '../../types';

const RailMapGZMTR = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <>
            <DefsGZMTR />

            <StripGZMTR variant={param.info_panel_type} isShowLight={false} isShowPSD={false} />

            {(param.direction === 'l' && param.stn_list[param.current_stn_idx].parents.includes('linestart')) ||
            (param.direction === 'r' && param.stn_list[param.current_stn_idx].children.includes('lineend')) ? (
                <TerminusFlag />
            ) : (
                <>
                    <MainGZMTR />
                    <DirectionIndicator />
                    {param.notesGZMTR.map((note, i) => (
                        <NoteBox key={i} note={note} />
                    ))}
                </>
            )}
        </>
    );
};

export default RailMapGZMTR;

const DefsGZMTR = React.memo(() => (
    <defs>
        <path
            id="stn"
            className="rmg-stn"
            d="M 0,9.25 V -9.25 H -9.25 a 9.25,9.25 0 0,0 0,18.5 h 18.5 a 9.25,9.25 0 0,0 0,-18.5 H 0 "
        />
        <path
            id="stn_pass"
            stroke="#aaa"
            fill="#fff"
            strokeWidth={2}
            d="M 0,9.25 V -9.25 H -9.25 a 9.25,9.25 0 0,0 0,18.5 h 18.5 a 9.25,9.25 0 0,0 0,-18.5 H 0 "
        />
        <path id="arrow_direction" d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z" fill="black" />

        <path id="inttick" d="M 0,0 v 18" strokeLinecap="square" />
        <rect id="intbox" x={-22.5} height={24} width={45} rx={4.5} />
    </defs>
));

const DirectionIndicator = () => {
    const { param, routes } = React.useContext(ParamContext);

    const validDests = React.useMemo(
        () => [
            ...new Set(
                routes.reduce(
                    (acc, cur) =>
                        cur.includes(param.current_stn_idx)
                            ? acc.concat(
                                  cur
                                      .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                                      .slice(param.direction === 'l' ? 0 : -1)[0]
                              )
                            : acc,
                    []
                )
            ),
        ],
        [param.current_stn_idx, param.direction, routes.toString()]
    );

    const textGroupProps: TextGroupProps = {
        textAnchor: param.direction === 'l' ? 'start' : 'end',
        transform: `translate(${param.direction === 'l' ? 65 : -65},-5)`,
        destIds: validDests,
    };

    return (
        <g
            id="direction_gz"
            style={{ ['--x-percentage' as any]: param.direction_gz_x, ['--y-percentage' as any]: param.direction_gz_y }}
        >
            <use
                xlinkHref="#arrow_direction"
                style={{ ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg' }}
            />

            {validDests.length !== 2 ? (
                <DirectionIndicatorTextGroup {...textGroupProps} />
            ) : (
                <DirectionIndicatorTextGroup2 {...textGroupProps} />
            )}
        </g>
    );
};

type TextGroupProps = {
    destIds: string[];
} & React.SVGProps<SVGGElement>;

const DirectionIndicatorTextGroup = (props: TextGroupProps) => {
    const { destIds, ...others } = props;
    const { param } = React.useContext(ParamContext);
    return (
        <g {...others}>
            <text className="rmg-name__zh" fontSize={28}>
                {destIds.map(stnId => param.stn_list[stnId].name[0]).join('/') + '方向'}
            </text>
            <text className="rmg-name__en" fontSize={14} dy={22}>
                {'Towards ' + destIds.map(stnId => param.stn_list[stnId].name[1].replace('\\', ' ')).join('/')}
            </text>
        </g>
    );
};

const DirectionIndicatorTextGroup2 = (props: TextGroupProps) => {
    const { destIds, ...others } = props;
    const { param } = React.useContext(ParamContext);

    const charCounts = destIds.map(stnId => param.stn_list[stnId].name[0].length);
    const minCharCounts = Math.min(...charCounts);
    const charSpacing =
        minCharCounts > 1 && charCounts[0] !== charCounts[1]
            ? Math.abs(charCounts[0] - charCounts[1]) / (minCharCounts - 1)
            : 0;

    return (
        <g {...others}>
            {destIds.map((id, i) => (
                <React.Fragment key={id}>
                    <text
                        className="rmg-name__zh"
                        fontSize={25}
                        x={param.direction === 'l' ? 0 : -75}
                        y={-21 + 42 * i}
                        letterSpacing={charCounts[i] > charCounts[1 - i] ? '0em' : `${charSpacing}em`}
                    >
                        {param.stn_list[id].name[0]}
                    </text>
                    <text
                        className="rmg-name__en"
                        fontSize={11.5}
                        x={param.direction === 'l' ? 0 : -75}
                        y={-1 + 42 * i}
                    >
                        {'Towards ' + param.stn_list[id].name[1].replace('\\', ' ')}
                    </text>
                </React.Fragment>
            ))}
            <text
                className="rmg-name__zh"
                fontSize={28}
                x={param.direction === 'l' ? 25 * (Math.max(...charCounts) + 1) : 0}
                y={5}
            >
                方向
            </text>
        </g>
    );
};

const TerminusFlag = React.memo(() => (
    <g id="terminus_gz" textAnchor="middle">
        <text className="rmg-name__zh" fontSize={90}>
            终 点 站
        </text>
        <text dy={70} className="rmg-name__en" fontSize={36}>
            Terminal
        </text>
        <g strokeWidth={8} stroke="#000">
            <path d="M -160,68 h -160" />
            <path d="M 160,68 h 160" />
        </g>
    </g>
));

const NoteBox = React.memo(
    (props: { note: Note }) => {
        const noteTextEl = React.useRef<SVGGElement>();
        const [bBox, setBBox] = React.useState({ width: 0, height: 0, y: 0 } as DOMRect);
        React.useEffect(() => setBBox(noteTextEl.current.getBBox()), [props.note[0], props.note[1]]);

        return (
            <g
                className="note-box"
                style={{ ['--x-percentage' as any]: props.note[2], ['--y-percentage' as any]: props.note[3] }}
            >
                {props.note[4] && (
                    <rect
                        height={bBox.height + 4}
                        width={bBox.width + 4}
                        x={-2}
                        y={bBox.y - 2}
                        fill="none"
                        stroke="black"
                        strokeWidth={0.5}
                    />
                )}
                <g ref={noteTextEl}>
                    <g fontSize={16} letterSpacing={1.2}>
                        {props.note[0].split('\n').map((txt, i) => (
                            <text key={i} className="rmg-name__zh" y={i * 18}>
                                {txt}
                            </text>
                        ))}
                    </g>

                    <g
                        fontSize={10}
                        letterSpacing={0.33}
                        transform={`translate(0,${18 * props.note[0].split('\n').length})`}
                    >
                        {props.note[1].split('\n').map((txt, i) => (
                            <text
                                key={i}
                                className="rmg-name__en"
                                y={i * 11}
                                textLength={i < props.note[1].match(/\n/g)?.length ? bBox.width : 0}
                                lengthAdjust="spacing"
                            >
                                {txt}
                            </text>
                        ))}
                    </g>
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => prevProps.note.toString() === nextProps.note.toString()
);
