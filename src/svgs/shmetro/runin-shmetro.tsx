/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { memo, SVGProps, useMemo } from 'react';
import { CanvasType, StationDict } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { isColineBranch } from '../../redux/param/coline-action';
import { calculateColineStations } from '../methods/shmetro-coline';
import SvgWrapper from '../svg-wrapper';
import PujiangLineDefs from './pujiang-line-filter';
import { Translation } from '@railmapgen/rmg-translate';

const LINE_WIDTH = 12;

const CANVAS_TYPE = CanvasType.RunIn;

const RunInSHMetro = () => {
    const { canvasScale } = useRootSelector(state => state.app);
    const { branches, routes, depsStr: deps } = useRootSelector(store => store.helper);
    const {
        svgWidth: svgWidths,
        svg_height,
        current_stn_idx,
        direction,
        loop,
        theme,
    } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];
    // get the height
    const dh = svg_height - 300;

    const prevStnIds = useMemo(() => {
        let prevStnIds = routes
            .filter(route => route.includes(current_stn_idx))
            .map(route => route[route.indexOf(current_stn_idx) + (direction === 'l' ? 1 : -1)])
            .filter(stnId => stnId !== undefined)
            // remove duplicate
            .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), [] as string[]);
        if (
            loop && // if it is a loop
            branches[0].includes(current_stn_idx) && // and this station is on the loop line
            prevStnIds.length === 1 && // and it is the first station of that direction
            ['linestart', 'lineend'].includes(prevStnIds[0])
        ) {
            // get the station from the other end
            prevStnIds = direction === 'l' ? [branches[0][1]] : [branches[0][branches[0].length - 2]];
        }
        return prevStnIds;
    }, [deps, current_stn_idx, direction, loop]);

    const nextStnIds = useMemo(() => {
        let nextStnIds = routes
            .filter(route => route.includes(current_stn_idx))
            .map(route => route[route.indexOf(current_stn_idx) + (direction === 'l' ? -1 : 1)])
            .filter(stnId => stnId !== undefined)
            // remove duplicate
            .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), [] as string[]);
        if (
            loop && // if it is a loop
            branches[0].includes(current_stn_idx) && // and this station is on the loop line
            nextStnIds.length === 1 && // and it is the last station of that direction
            ['linestart', 'lineend'].includes(nextStnIds[0])
        ) {
            // get the station from the other end
            nextStnIds = direction === 'l' ? [branches[0][branches[0].length - 2]] : [branches[0][1]];
        }
        return nextStnIds;
    }, [deps, current_stn_idx, direction, loop]);

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svg_height}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsSHMetro />
            <g transform={`translate(0,${dh})`}>
                <GeneralStation prevStnIds={prevStnIds} nextStnIds={nextStnIds} />
            </g>
        </SvgWrapper>
    );
};

export default RunInSHMetro;

const DefsSHMetro = memo(function DefsSHMetro() {
    return (
        <defs>
            {/* An extension of the line/path. Remember to minus the stroke-width.  */}
            <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
                <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
            </marker>

            {/* Outline filter of white pass color in Pujiang Line */}
            <PujiangLineDefs />
        </defs>
    );
});

interface RunInGeneralProps {
    prevStnIds: string[];
    nextStnIds: string[];
}

const GeneralStation = (props: RunInGeneralProps) => {
    const { prevStnIds, nextStnIds } = props;
    const { info_panel_type, svgWidth, stn_list } = useRootSelector(store => store.param);

    const middle = svgWidth.runin / 2;
    const terminal = nextStnIds.length === 1 && ['linestart', 'lineend'].includes(nextStnIds[0]);
    const original = prevStnIds.length === 1 && ['linestart', 'lineend'].includes(prevStnIds[0]);

    const nextNames = nextStnIds.map(stnId => stn_list[stnId].localisedName);
    const prevNames = prevStnIds.map(stnId => stn_list[stnId].localisedName);

    const [{ zh: nextZhName = '', en: nextEnName = '' }] = nextNames;
    const [{ zh: prevZhName = '', en: prevEnName = '' }] = prevNames;

    const nextBranchLineDy =
        (nextStnIds.length > 1
            ? (nextZhName.split('\\').length - 1) * -50 + (nextEnName.split('\\').length - 1) * -30
            : 0) + 10;
    const prevBranchLineDy =
        (prevStnIds.length > 1
            ? (prevZhName.split('\\').length - 1) * -50 + (prevEnName.split('\\').length - 1) * -30
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
    const { current_stn_idx, theme, svgWidth, direction, coline } = useRootSelector(store => store.param);
    const { branches } = useRootSelector(store => store.helper);

    const textProps = {
        l: { original: { x: svgWidth.runin - 36, anchor: 'end' }, terminal: { x: 36, anchor: 'start' } },
        r: { original: { x: 36, anchor: 'start' }, terminal: { x: svgWidth.runin - 36, anchor: 'end' } },
    };

    const colineStns = calculateColineStations(Object.values(coline), branches);
    const nextColineColorFrom = mode === 'terminal' ? prevStnIds : nextStnIds;
    const nextColineColor =
        nextStnIds.length > 1
            ? 'var(--rmg-theme-colour)' // BranchLine will handle color of next line well
            : (colineStns
                  .filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextColineColorFrom[0]))
                  // TODO-coline: handle multiple coline colors
                  .map(co => co.colors[0][2])[0] ?? 'var(--rmg-theme-colour)');

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
                <g filter={theme[2] === '#B5B5B6' ? 'url(#pujiang_outline)' : undefined}>
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
    } = useRootSelector(store => store.param);
    const { branches } = useRootSelector(store => store.helper);
    const middle = svgWidth.runin / 2;

    // determine the end with linestart/lineend or .length === 0
    const isEnd = (stnIds: string[]) => stnIds.includes('linestart') || stnIds.includes('lineend');

    const colineStns = calculateColineStations(Object.values(coline), branches);

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
            : (colineStns
                  .filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextColineColorFrom[0]))
                  // TODO-coline: handle multiple coline colors
                  .map(co => co.colors[0][2])[0] ?? 'var(--rmg-theme-colour)');

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
        Object.keys(coline).length > 0 && isInColineBranch(branches, current_stn_idx, nextStnIds, stnList)
            ? nextColineColor
            : 'var(--rmg-theme-colour)';

    // stretch the next line element if curr and next stations aren't in main line with coline
    const nextLineStretch =
        Object.keys(coline).length > 0 &&
        nextStnIds.length === 1 && // BranchLine will add branch next line so no stretch is needed
        (isEnd(prevStnIds) || isEnd(nextStnIds)
            ? true // terminal station with coline(prevent linestart/lineend)
            : !(
                  [current_stn_idx, nextStnIds[0]].every(stnId => branches[0].includes(stnId)) &&
                  colineStns.filter(co => co.linePath.includes(current_stn_idx) && co.linePath.includes(nextStnIds[0]))
                      .length !== 0
              )); // no stretch if it is in main line with coline

    // stretch the pass line element if BranchLine is not in effect
    const passLineStretch = Object.keys(coline).length > 0 && prevStnIds.length === 1;

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
                filter={theme[2] === '#B5B5B6' ? 'url(#pujiang_outline)' : undefined}
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

    const { direction, svgWidth, current_stn_idx, coline, theme } = useRootSelector(store => store.param);
    const { branches } = useRootSelector(store => store.helper);
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

    const nextDots = (
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
    const prevDots = (
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

    if (Object.keys(coline).length > 0) {
        const colineStns = calculateColineStations(Object.values(coline), branches);

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
                // TODO-coline: known undefined issues when coline is removed if the station is removed via removeInvalidColineOnRemoveStation
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
            filter={theme[2] === '#B5B5B6' ? 'url(#pujiang_outline)' : undefined}
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
    const param = useRootSelector(store => store.param);
    const { localisedName } = param.stn_list[param.current_stn_idx];
    const { zh: zhName = '', en: enName = '' } = localisedName;
    return useMemo(
        () => (
            <>
                <text className="rmg-name__zh rmg-outline" fontSize={112}>
                    {zhName.replace('\\', '')}
                </text>
                <text className="rmg-name__en rmg-outline" fontSize={36} dy={50}>
                    {enName.replace('\\', '')}
                </text>
            </>
        ),
        [zhName, enName]
    );
};

const NextText = (props: { nextName: Translation } & SVGProps<SVGGElement>) => {
    const { nextName, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = nextName;
    return (
        <g {...others}>
            {useMemo(
                () => (
                    <>
                        {zhName.split('\\').map((name, i, array) => (
                            <text
                                className="rmg-name__zh rmg-outline"
                                fontSize={48}
                                key={name}
                                dy={(array.length - 1 - i) * -50 - (enName.split('\\').length - 1) * 30}
                            >
                                {name}
                            </text>
                        ))}
                        {enName.split('\\').map((name, i, array) => (
                            <text
                                className="rmg-name__en rmg-outline"
                                fontSize={24}
                                key={name}
                                dy={28 + (array.length - 1 - i) * -30}
                            >
                                {name}
                            </text>
                        ))}
                    </>
                ),
                [zhName, enName]
            )}
        </g>
    );
};

const PrevStn = (props: { stnIds: string[] }) => {
    const param = useRootSelector(store => store.param);
    const prevNames = props.stnIds.map(stnId => param.stn_list[stnId].localisedName);
    const prevHintDy =
        (props.stnIds.length > 1 ? 15 : 125) +
        prevNames.map(name => name.zh?.split('\\')?.length ?? 1).reduce((acc, cur) => acc + cur, -prevNames.length) *
            -50 +
        prevNames.map(name => name.en?.split('\\')?.length ?? 1).reduce((acc, cur) => acc + cur, -prevNames.length) *
            -30;
    const [{ zh: prevZhName = '', en: prevEnName = '' }] = prevNames;
    const nextBranchTextDy =
        (props.stnIds.length > 1
            ? (prevZhName.split('\\').length - 1) * -50 + (prevEnName.split('\\').length - 1) * -30
            : 0) + 70;

    return (
        <g
            fill="gray"
            textAnchor={param.direction === 'l' ? 'end' : 'start'}
            transform={`translate(${param.direction === 'l' ? param.svgWidth.runin - 36 : 36},0)`}
        >
            <NextText nextName={prevNames[0]} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText nextName={prevNames[1]} transform={`translate(0,${nextBranchTextDy})`} />
            )}
            <g transform={`translate(0, ${prevHintDy})`}>
                <text className="rmg-name__zh rmg-outline" fontSize={22}>
                    上一站
                </text>
                <text className="rmg-name__en rmg-outline" fontSize={12} dx={param.direction === 'l' ? -70 : 70}>
                    Past Stop
                </text>
            </g>
        </g>
    );
};

const NextStn = (props: { stnIds: string[] }) => {
    const param = useRootSelector(store => store.param);
    const nextNames = props.stnIds.map(stnId => param.stn_list[stnId].localisedName);
    const nextHintDy =
        (props.stnIds.length > 1 ? 15 : 125) +
        nextNames.map(name => name.zh?.split('\\')?.length ?? 1).reduce((acc, cur) => acc + cur, -nextNames.length) *
            -50 +
        nextNames.map(name => name.en?.split('\\')?.length ?? 1).reduce((acc, cur) => acc + cur, -nextNames.length) *
            -30;
    const [{ zh: nextZhName = '', en: nextEnName = '' }] = nextNames;
    const nextBranchTextDy =
        (props.stnIds.length > 1
            ? (nextZhName.split('\\').length - 1) * -50 + (nextEnName.split('\\').length - 1) * -30
            : 0) + 70;

    return (
        <g
            textAnchor={param.direction === 'l' ? 'start' : 'end'}
            transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},0)`}
        >
            <NextText nextName={param.stn_list[props.stnIds[0]].localisedName} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText
                    nextName={param.stn_list[props.stnIds[1]].localisedName}
                    transform={`translate(0,${nextBranchTextDy})`}
                />
            )}
            <g transform={`translate(0, ${nextHintDy})`}>
                <text className="rmg-name__zh rmg-outline" fontSize={22}>
                    下一站
                </text>
                <text className="rmg-name__en rmg-outline" fontSize={12} dx={param.direction === 'l' ? 70 : -70}>
                    Next Stop
                </text>
            </g>
        </g>
    );
};
