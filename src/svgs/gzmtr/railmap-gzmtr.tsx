import { memo, SVGProps, useEffect, useMemo, useRef, useState } from 'react';
import StripGZMTR from './strip-gzmtr';
import MainGZMTR from './main-gzmtr';
import { CanvasType, Note, PanelTypeGZMTR, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';
import ArrowGzmtr from './arrow-gzmtr';
import { DoubleDestinations } from './destination-indicator/double-destinations';

const CANVAS_TYPE = CanvasType.RailMap;

const RailMapGZMTR = () => {
    const { canvasScale } = useRootSelector(state => state.app);
    const {
        svgWidth: svgWidths,
        svg_height: svgHeight,
        direction,
        psd_num: psdNumber,
        info_panel_type: infoPanelType,
        notesGZMTR: notes,
        current_stn_idx: currentStationIndex,
        stn_list: stationList,
        theme,
    } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];
    const curStnInfo = stationList[currentStationIndex];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsGZMTR />

            <StripGZMTR
                variant={infoPanelType}
                isShowLight={infoPanelType === PanelTypeGZMTR.gz2otis}
                isShowPSD={infoPanelType === PanelTypeGZMTR.gz2otis && psdNumber}
            />

            {(direction === ShortDirection.left && curStnInfo.parents.includes('linestart')) ||
            (direction === ShortDirection.right && curStnInfo.children.includes('lineend')) ? (
                <TerminusFlag />
            ) : (
                <>
                    <MainGZMTR />
                    <DirectionIndicator />
                    {notes?.map((note, i) => <NoteBox key={i} note={note} />)}
                </>
            )}

            {infoPanelType === PanelTypeGZMTR.gz2otis && (
                <line x2={svgWidth} transform="translate(0,90)" strokeWidth={3} stroke="black" />
            )}
        </SvgWrapper>
    );
};

export default RailMapGZMTR;

const DefsGZMTR = memo(function DefsGZMTR() {
    return (
        <defs>
            <path id="inttick" d="M 0,0 v 18" strokeLinecap="square" />
        </defs>
    );
});

const DirectionIndicator = () => {
    const { routes } = useRootSelector(store => store.helper);
    const {
        direction,
        direction_gz_x: directionIndicatorX,
        direction_gz_y: directionIndicatorY,
        current_stn_idx: currentStationIndex,
    } = useRootSelector(store => store.param);

    const validDests = useMemo(
        () => [
            ...new Set(
                routes
                    .reduce(
                        (acc, cur) =>
                            cur.includes(currentStationIndex)
                                ? acc.concat(
                                      cur
                                          .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                                          .slice(direction === ShortDirection.left ? 0 : -1)[0]
                                  )
                                : acc,
                        []
                    )
                    .filter(id => id !== currentStationIndex)
            ),
        ],
        [currentStationIndex, direction, routes.toString()]
    );

    const textGroupProps: TextGroupProps = {
        textAnchor: direction === ShortDirection.left ? 'start' : 'end',
        transform: `translate(${direction === ShortDirection.left ? 65 : -65},-5)`,
        destIds: validDests,
    };

    return (
        <g
            id="direction_gz"
            style={{ ['--x-percentage' as any]: directionIndicatorX, ['--y-percentage' as any]: directionIndicatorY }}
        >
            <ArrowGzmtr transform={`scale(0.35)rotate(${direction === ShortDirection.left ? 0 : 180})`} />

            {validDests.length !== 2 ? (
                <DirectionIndicatorTextGroup {...textGroupProps} />
            ) : (
                <DoubleDestinations {...textGroupProps} />
            )}
        </g>
    );
};

type TextGroupProps = {
    destIds: string[];
} & SVGProps<SVGGElement>;

const DirectionIndicatorTextGroup = (props: TextGroupProps) => {
    const { destIds, ...others } = props;
    const stationList = useRootSelector(store => store.param.stn_list);
    return (
        <g {...others}>
            <text className="rmg-name__zh" fontSize={28}>
                {destIds.map(stnId => stationList[stnId].name[0]).join('/') + '方向'}
            </text>
            <text className="rmg-name__en" fontSize={14} dy={22}>
                {'Towards ' + destIds.map(stnId => stationList[stnId].name[1].replace('\\', ' ')).join('/')}
            </text>
        </g>
    );
};

const TerminusFlag = memo(function TerminusFlag() {
    return (
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
    );
});

const NoteBox = memo(
    function NoteBox(props: { note: Note }) {
        const noteTextEl = useRef<SVGGElement | null>(null);
        const [bBox, setBBox] = useState({ width: 0, height: 0, y: 0 } as DOMRect);

        useEffect(() => {
            noteTextEl.current && setBBox(noteTextEl.current.getBBox());
        }, [props.note[0], props.note[1]]);

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
                                textLength={
                                    i < (props.note[1].match(/\n/g)?.length || 0)
                                        ? bBox.width
                                        : navigator.userAgent.includes('Firefox')
                                        ? -1
                                        : 0
                                }
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
