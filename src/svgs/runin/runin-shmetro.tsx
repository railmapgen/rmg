import React, { useMemo, memo } from 'react';
import { Name, StationDict } from '../../constants/constants';
import { useAppSelector } from '../../redux';
import { isColineBranch } from '../../redux/param/coline-action';
import { calculateColineStations } from '../railmap/methods/shmetro-coline';

const LINE_WIDTH = 12;

const RunInSHMetro = () => {
    const { routes } = useAppSelector(store => store.helper);
    const param = useAppSelector(store => store.param);

    // get the height
    const dh = param.svg_height - 300;

    const prevStnIds = useMemo(
        () =>
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => route[route.indexOf(param.current_stn_idx) + (param.direction === 'l' ? 1 : -1)])
                // .flat()
                // remove duplicate
                .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), [] as string[]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [routes.toString(), param.current_stn_idx, param.direction]
    );

    const nextStnIds = useMemo(
        () =>
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => route[route.indexOf(param.current_stn_idx) + (param.direction === 'l' ? -1 : 1)])
                // .flat()
                // remove duplicate
                .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), [] as string[]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [routes.toString(), param.current_stn_idx, param.direction]
    );

    return (
        <>
            <DefsSHMetro />
            <g transform={`translate(0,${dh})`}>
                <GeneralStation prevStnIds={prevStnIds} nextStnIds={nextStnIds} />
            </g>
        </>
    );
};

export default RunInSHMetro;

const DefsSHMetro = memo(() => (
    <defs>
        {/* An extension of the line/path. Remember to minus the stroke-width.  */}
        <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
        </marker>

        {/* Outline filter of white pass color in Pujiang Line */}
        <filter
            id="pujiang_outline_runin"
            colorInterpolationFilters="sRGB"
            // TODO: remove the absolute value while make the filter works correctly
            filterUnits="userSpaceOnUse"
            x="0"
            y="-1000"
            width="5000"
            height="2000"
        >
            <feMorphology operator="erode" in="SourceAlpha" radius="0" result="e1" />
            <feMorphology operator="erode" in="SourceAlpha" radius="1" result="e2" />
            <feComposite in="e1" in2="e2" operator="xor" result="outline" />
            <feComposite in="outline" in2="SourceGraphic" operator="over" result="output" />
        </filter>
    </defs>
));

interface RunInGeneralProps {
    prevStnIds: string[];
    nextStnIds: string[];
}

const GeneralStation = (props: RunInGeneralProps) => {
    const { prevStnIds, nextStnIds } = props;
    const { info_panel_type, svgWidth, stn_list } = useAppSelector(store => store.param);

    const middle = svgWidth.runin / 2;
    const terminal = nextStnIds.length === 1 && ['linestart', 'lineend'].includes(nextStnIds[0]);
    const original = prevStnIds.length === 1 && ['linestart', 'lineend'].includes(prevStnIds[0]);

    const nextNames = nextStnIds.map(stnId => stn_list[stnId].name);
    const prevNames = prevStnIds.map(stnId => stn_list[stnId].name);

    const nextBranchLineDy =
        (nextStnIds.length > 1
            ? (nextNames[0][0].split('\\').length - 1) * -50 + (nextNames[0][1].split('\\').length - 1) * -30
            : 0) + 10;
    const prevBranchLineDy =
        (prevStnIds.length > 1
            ? (prevNames[0][0].split('\\').length - 1) * -50 + (prevNames[0][1].split('\\').length - 1) * -30
            : 0) + 10;

    return (
        <>
            <BranchLine
                prevStnIds={prevStnIds}
                nextStnIds={nextStnIds}
                nextBranchLineDy={nextBranchLineDy}
                prevBranchLineDy={prevBranchLineDy}
            />

            {terminal && info_panel_type !== 'sh2020' ? (
                <TerminalStation mode="terminal" prevStnIds={prevStnIds} nextStnIds={nextStnIds} />
            ) : original && info_panel_type !== 'sh2020' ? (
                <TerminalStation mode="original" prevStnIds={prevStnIds} nextStnIds={nextStnIds} />
            ) : (
                <>
                    {/* General Station */}
                    <Line prevStnIds={prevStnIds} nextStnIds={nextStnIds} />

                    <g transform={`translate(${middle},160)`} textAnchor="middle">
                        <CurrentText />
                    </g>
                </>
            )}

            {(original || !terminal) && <NextStn stnIds={props.nextStnIds} />}
            {(terminal || !original) && <PrevStn stnIds={props.prevStnIds} />}
        </>
    );
};

const TerminalStation = (props: { mode: 'terminal' | 'original'; prevStnIds: string[]; nextStnIds: string[] }) => {
    const { mode, prevStnIds, nextStnIds } = props;
    const { current_stn_idx, theme, svgWidth, direction, coline } = useAppSelector(store => store.param);
    const { branches } = useAppSelector(store => store.helper);

    const textProps = {
        l: { original: { x: svgWidth.runin - 36, anchor: 'end' }, terminal: { x: 36, anchor: 'start' } },
        r: { original: { x: 36, anchor: 'start' }, terminal: { x: svgWidth.runin - 36, anchor: 'end' } },
    };

    const colineStns = calculateColineStations(coline, branches);
    const nextColineColorFrom = mode === 'terminal' ? prevStnIds : nextStnIds;
    const nextColineColor =
        nextStnIds.length > 1
            ? 'var(--rmg-theme-colour)' // BranchLine will handle color of next line well
            : colineStns
                  .filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextColineColorFrom[0]))
                  // TODO-coline: handle multiple coline colors
                  .map(co => co.colors[0][2])[0] ?? 'var(--rmg-theme-colour)';

    return (
        <>
            {mode === 'original' && (
                <path
                    transform={`translate(0,${coline.length ? '198' : '220'})${coline.length ? 'scale(1,2)' : ''}`}
                    stroke={nextColineColor}
                    strokeWidth={12}
                    d={direction === 'l' ? `M ${svgWidth.runin - 24},16 H 36` : `M24,16 H ${svgWidth.runin - 36}`}
                    markerEnd="url(#slope)"
                />
            )}

            {mode === 'terminal' && (
                <g filter={theme[2] === '#999999' ? 'url(#pujiang_outline_runin)' : undefined}>
                    <path
                        transform={`translate(0,${coline.length ? '198' : '220'})${coline.length ? 'scale(1,2)' : ''}`}
                        stroke="var(--rmg-grey)"
                        strokeWidth={12}
                        d={`M24,16 H ${svgWidth.runin - 24}`}
                    />
                </g>
            )}

            <g
                transform={`translate(${textProps[direction][mode].x},160)`}
                textAnchor={textProps[direction][mode].anchor}
            >
                <CurrentText />
            </g>
        </>
    );
};

const Line = (props: RunInGeneralProps) => {
    const { prevStnIds, nextStnIds } = props;
    const {
        direction,
        svgWidth,
        theme,
        coline,
        current_stn_idx,
        stn_list: stnList,
    } = useAppSelector(store => store.param);
    const { branches } = useAppSelector(store => store.helper);
    const middle = svgWidth.runin / 2;

    // determine the end with linestart/lineend or .length === 0
    const isEnd = (stnIds: string[]) => stnIds.includes('linestart') || stnIds.includes('lineend');

    const colineStns = calculateColineStations(coline, branches);

    // whether the next line is single color(var(--rmg-theme-colour) or coline color) or multiple colors
    // let nextColineMode: 'single' | 'multiple' = 'single';
    // TODO-coline: if coline is allowed in other segments, then this should be considered more precisely
    const nextColineMode =
        nextStnIds.length > 1
            ? // needs to be single since BranchLine is in effect
              'single'
            : isEnd(nextStnIds)
            ? colineStns.filter(co => [current_stn_idx, prevStnIds[0]].every(stnId => co.linePath.includes(stnId)))
                  .length > 0
                ? // if this the terminal station, look back to see if it falls in coline
                  'multiple'
                : 'single'
            : [current_stn_idx, nextStnIds[0]].every(stnId => branches[0].includes(stnId)) && // is in the main line
              // and has coline from current_stn_idx to nextStnIds[0]
              colineStns.filter(co => [current_stn_idx, nextStnIds[0]].every(stnId => co.linePath.includes(stnId)))
                  .length > 0
            ? 'multiple'
            : 'single';

    const nextColineColorFrom = isEnd(nextStnIds) ? prevStnIds : nextStnIds;
    const nextColineColor =
        nextStnIds.length > 1
            ? 'var(--rmg-theme-colour)' // BranchLine will handle color of next line well
            : colineStns
                  .filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextColineColorFrom[0]))
                  // TODO-coline: handle multiple coline colors
                  .map(co => co.colors[0][2])[0] ?? 'var(--rmg-theme-colour)';

    // curr and next/pass segment is in the coline branch
    const isInColineBranch = (
        branches: string[][],
        current_stn_idx: string,
        nextOrPassStnIds: string[],
        stnList: StationDict
    ) =>
        branches
            .slice(1)
            .filter(branch => [current_stn_idx, nextOrPassStnIds[0]].every(stnId => branch.includes(stnId)))
            .filter(branch => isColineBranch(branch, stnList)).length > 0;

    // change color to coline color only if it has coline and the curr and next stations are in the coline branch
    const nextColor =
        coline.length > 0 && isInColineBranch(branches, current_stn_idx, nextStnIds, stnList)
            ? nextColineColor
            : 'var(--rmg-theme-colour)';

    // stretch the next line element if curr and next stations aren't in main line with coline
    const nextLineStretch =
        coline.length > 0 &&
        nextStnIds.length === 1 && // BranchLine will add branch next line so no stretch is needed
        (isEnd(prevStnIds) || isEnd(nextStnIds)
            ? true // terminal station with coline(prevent linestart/lineend)
            : !(
                  [current_stn_idx, nextStnIds[0]].every(stnId => branches[0].includes(stnId)) &&
                  colineStns.filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextStnIds[0]))
                      .length !== 0
              )); // no stretch if it is in main line with coline

    // stretch the pass line element if BranchLine is not in effect
    const passLineStretch = coline.length > 0 && prevStnIds.length === 1;

    return (
        <g transform="translate(0,220)" strokeWidth={12}>
            <>
                {nextColor !== 'var(--rmg-theme-colour)' && (
                    <marker id={`slope_${nextColor}`} viewBox="-1.5 0 3 1.5" refY={0.5}>
                        <path d="M0,0L1,1H-1z" fill={nextColor} />
                    </marker>
                )}
                <path
                    stroke={nextColor}
                    d={`M ${middle},16 H ${direction === 'l' ? 36 : svgWidth.runin - 36}`}
                    // markerEnd="url(#slope)"
                    markerEnd={nextColor === 'var(--rmg-theme-colour)' ? 'url(#slope)' : `url(#slope_${nextColor})`}
                    transform={nextLineStretch ? 'translate(0,-22)scale(1,2)' : undefined}
                />
            </>
            {nextColineMode === 'multiple' && (
                <>
                    <marker id={`slope_${nextColineColor}`} viewBox="-1.5 0 3 1.5" refY={0.5}>
                        <path d="M0,0L1,1H-1z" fill={nextColineColor} />
                    </marker>
                    <path
                        stroke={nextColineColor}
                        d={`M ${middle},16 H ${
                            direction === 'l' ? 36 + LINE_WIDTH : svgWidth.runin - (36 + LINE_WIDTH)
                        }`}
                        markerEnd={`url(#slope_${nextColineColor})`}
                        transform="translate(0,-12)"
                    />
                </>
            )}

            <g
                filter={theme[2] === '#999999' ? 'url(#pujiang_outline_runin)' : undefined}
                transform={`translate(0,${passLineStretch ? -22 : 0})scale(1,${passLineStretch ? 2 : 1})`}
            >
                <path
                    stroke="var(--rmg-grey)"
                    d={`M ${middle},16 H ${direction === 'l' ? svgWidth.runin - 24 : 24} `}
                />
            </g>
        </g>
    );
};

interface RunInBranchLineProps {
    prevStnIds: string[];
    nextStnIds: string[];
    nextBranchLineDy: number;
    prevBranchLineDy: number;
}

const BranchLine = (props: RunInBranchLineProps) => {
    const { prevStnIds, nextStnIds, nextBranchLineDy, prevBranchLineDy } = props;

    const { direction, svgWidth, current_stn_idx, coline, theme } = useAppSelector(store => store.param);
    const { branches } = useAppSelector(store => store.helper);
    const middle = svgWidth.runin / 2;

    const LINE_BRANCH_Y = 125;

    // draw a line between these dots
    const dotToPos = (dot: [number, number]) => `${dot[0]},${dot[1]}`;
    const dotsToPath = (dots: [number, number][]) =>
        `M${dotToPos(dots.at(0)!)} ` +
        dots
            .slice(1)
            .map(dot => `L${dotToPos(dot)}`)
            .join(' ');

    let nextDots = (
        direction === 'l'
            ? [
                  [svgWidth.runin / 3, LINE_BRANCH_Y],
                  [svgWidth.runin / 6, nextBranchLineDy],
                  [36, nextBranchLineDy],
              ]
            : [
                  [(svgWidth.runin / 3) * 2, LINE_BRANCH_Y],
                  [(svgWidth.runin / 6) * 5, nextBranchLineDy],
                  [svgWidth.runin - 36, nextBranchLineDy],
              ]
    ) as [number, number][];
    let prevDots = (
        direction === 'l'
            ? [
                  [(svgWidth.runin / 3) * 2, LINE_BRANCH_Y],
                  [(svgWidth.runin / 6) * 5, prevBranchLineDy],
                  [svgWidth.runin - 24, prevBranchLineDy],
              ]
            : [
                  [svgWidth.runin / 3, LINE_BRANCH_Y],
                  [svgWidth.runin / 6, prevBranchLineDy],
                  [24, prevBranchLineDy],
              ]
    ) as [number, number][];

    let nextColor = 'var(--rmg-theme-colour)';

    if (coline.length > 0) {
        const colineStns = calculateColineStations(coline, branches);

        // If the next stns have coline branch here,
        // uplift branch a little bit with coline color.
        if (
            nextStnIds.length > 1 &&
            colineStns.filter(
                stns =>
                    stns.linePath.includes(current_stn_idx) && nextStnIds.some(stnId => stns.linePath.includes(stnId))
            )
        ) {
            // no idea why strokeWidth is 12 but only when dy = -11 will be perfect
            nextDots[0][1] -= LINE_WIDTH - 1;
            nextDots.unshift([middle, LINE_BRANCH_Y - LINE_WIDTH + 1]);
            nextColor = colineStns
                .filter(
                    stns =>
                        stns.linePath.includes(current_stn_idx) &&
                        nextStnIds.some(stnId => stns.linePath.includes(stnId))
                )
                // TODO-coline: known undefined issues when coline is removed if the station is removed via removeInvalidColineOnRemove
                .at(0)!
                .colors.at(0)![2];
        }

        // If the prev stns have coline branch here,
        // uplift branch a little bit.
        if (
            prevStnIds.length > 1 &&
            colineStns.filter(
                stns =>
                    stns.linePath.includes(current_stn_idx) && prevStnIds.some(stnId => stns.linePath.includes(stnId))
            )
        ) {
            // no idea why strokeWidth is 12 but only when dy = -11 will be perfect
            prevDots[0][1] -= LINE_WIDTH - 1;
            prevDots.unshift([middle, LINE_BRANCH_Y - LINE_WIDTH + 1]);
        }
    }

    return (
        <g
            transform="translate(0,110)"
            strokeWidth={12}
            fill="none"
            filter={theme[2] === '#999999' ? 'url(#pujiang_outline_runin)' : undefined}
        >
            {/* An extension of the line/path with coline color. */}
            <marker id="slope_branch" viewBox="-1.5 0 3 1.5" refY={0.5}>
                <path d="M0,0L1,1H-1z" fill={nextColor} />
            </marker>

            {nextStnIds.length > 1 && (
                <path stroke={nextColor} d={dotsToPath(nextDots)} markerEnd="url(#slope_branch)" />
            )}
            {prevStnIds.length > 1 && <path stroke="var(--rmg-grey)" d={dotsToPath(prevDots)} />}
        </g>
    );
};

const CurrentText = () => {
    const param = useAppSelector(store => store.param);
    const { name } = param.stn_list[param.current_stn_idx];
    return useMemo(
        () => (
            <>
                <text className="rmg-name__zh" fontSize={112}>
                    {name[0]}
                </text>
                <text className="rmg-name__en" fontSize={36} dy={50}>
                    {name[1].replace('\\', ' ')}
                </text>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...name]
    );
};

const NextText = (props: { nextName: Name } & React.SVGProps<SVGGElement>) => {
    const { nextName, ...others } = props;
    return (
        <g {...others}>
            {useMemo(
                () => (
                    <>
                        {nextName[0].split('\\').map((name, i, array) => (
                            <text
                                className="rmg-name__zh"
                                fontSize={48}
                                key={name}
                                dy={(array.length - 1 - i) * -50 - (nextName[1].split('\\').length - 1) * 30}
                            >
                                {name}
                            </text>
                        ))}
                        {nextName[1].split('\\').map((name, i, array) => (
                            <text
                                className="rmg-name__en"
                                fontSize={24}
                                key={name}
                                dy={28 + (array.length - 1 - i) * -30}
                            >
                                {name}
                            </text>
                        ))}
                    </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [...nextName]
            )}
        </g>
    );
};

const PrevStn = (props: { stnIds: string[] }) => {
    const param = useAppSelector(store => store.param);
    const nextNames = props.stnIds.map(stnId => param.stn_list[stnId].name);
    const prevHintDy =
        (props.stnIds.length > 1 ? 15 : 125) +
        nextNames.map(name => name[0].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -50 +
        nextNames.map(name => name[1].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -30;
    const nextBranchTextDy =
        (props.stnIds.length > 1
            ? (nextNames[0][0].split('\\').length - 1) * -50 + (nextNames[0][1].split('\\').length - 1) * -30
            : 0) + 70;

    return (
        <g
            fill="gray"
            textAnchor={param.direction === 'l' ? 'end' : 'start'}
            transform={`translate(${param.direction === 'l' ? param.svgWidth.runin - 36 : 36},0)`}
        >
            <NextText nextName={nextNames[0]} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText nextName={nextNames[1]} transform={`translate(0,${nextBranchTextDy})`} />
            )}
            <g transform={`translate(0, ${prevHintDy})`}>
                <text className="rmg-name__zh" fontSize={22}>
                    上一站
                </text>
                <text className="rmg-name__en" fontSize={12} dx={param.direction === 'l' ? -70 : 70}>
                    Past Stop
                </text>
            </g>
        </g>
    );
};

const NextStn = (props: { stnIds: string[] }) => {
    const param = useAppSelector(store => store.param);
    const nextNames = props.stnIds.map(stnId => param.stn_list[stnId].name);
    const nextHintDy =
        (props.stnIds.length > 1 ? 15 : 125) +
        nextNames.map(name => name[0].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -50 +
        nextNames.map(name => name[1].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -30;
    const nextBranchTextDy =
        (props.stnIds.length > 1
            ? (nextNames[0][0].split('\\').length - 1) * -50 + (nextNames[0][1].split('\\').length - 1) * -30
            : 0) + 70;

    return (
        <g
            textAnchor={param.direction === 'l' ? 'start' : 'end'}
            transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},0)`}
        >
            <NextText nextName={param.stn_list[props.stnIds[0]].name} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText
                    nextName={param.stn_list[props.stnIds[1]].name}
                    transform={`translate(0,${nextBranchTextDy})`}
                />
            )}
            <g transform={`translate(0, ${nextHintDy})`}>
                <text className="rmg-name__zh" fontSize={22}>
                    下一站
                </text>
                <text className="rmg-name__en" fontSize={12} dx={param.direction === 'l' ? 70 : -70}>
                    Next Stop
                </text>
            </g>
        </g>
    );
};
