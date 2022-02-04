import React, { useMemo, memo } from 'react';
import { Name } from '../../constants/constants';
import { useAppSelector } from '../../redux';
import { getStnState } from '../railmap/methods/share';
import { calculateColineStations, calculateColine } from '../railmap/methods/shmetro-coline';

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
    const param = useAppSelector(store => store.param);

    const middle = param.svgWidth.runin / 2;
    const termianl = nextStnIds.length === 1 && ['linestart', 'lineend'].includes(nextStnIds[0]);
    const original = prevStnIds.length === 1 && ['linestart', 'lineend'].includes(prevStnIds[0]);

    const nextNames = nextStnIds.map(stnId => param.stn_list[stnId].name);
    const prevNames = prevStnIds.map(stnId => param.stn_list[stnId].name);

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

            {termianl && param.info_panel_type !== 'sh2020' ? (
                <>
                    <g filter={param.theme[2] === '#999999' ? 'url(#pujiang_outline_runin)' : undefined}>
                        <path
                            transform="translate(0,220)"
                            stroke="var(--rmg-grey)"
                            strokeWidth={12}
                            d={`M24,16 H ${param.svgWidth.runin - 24}`}
                        />
                    </g>

                    <g
                        transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},160)`}
                        textAnchor={param.direction === 'l' ? 'start' : 'end'}
                    >
                        <CurrentText />
                    </g>
                </>
            ) : original && param.info_panel_type !== 'sh2020' ? (
                <>
                    <path
                        transform="translate(0,220)"
                        stroke="var(--rmg-theme-colour)"
                        strokeWidth={12}
                        d={
                            param.direction === 'l'
                                ? `M ${param.svgWidth.runin - 24},16 H 36`
                                : `M24,16 H ${param.svgWidth.runin - 36}`
                        }
                        markerEnd="url(#slope)"
                    />

                    <g
                        transform={`translate(${param.direction === 'l' ? param.svgWidth.runin - 36 : 36},160)`}
                        textAnchor={param.direction === 'l' ? 'end' : 'start'}
                    >
                        <CurrentText />
                    </g>
                </>
            ) : (
                <>
                    <g transform="translate(0,220)" strokeWidth={12}>
                        <path
                            stroke="var(--rmg-theme-colour)"
                            d={`M ${middle},16 H ${param.direction === 'l' ? 36 : param.svgWidth.runin - 36}`}
                            markerEnd="url(#slope)"
                        />
                        <g
                            filter={param.theme[2] === '#999999' ? 'url(#pujiang_outline_runin)' : undefined}
                            // TODO: remove this translate and fix it in BranchLine
                            transform="translate(0,-6)"
                        >
                            <path
                                stroke="var(--rmg-grey)"
                                strokeWidth={24}
                                d={`M ${middle},16 H ${param.direction === 'l' ? param.svgWidth.runin - 24 : 24} `}
                            />
                        </g>
                    </g>

                    <g transform={`translate(${middle},160)`} textAnchor="middle">
                        <CurrentText />
                    </g>
                </>
            )}

            {(original || !termianl) && <NextStn stnIds={props.nextStnIds} />}
            {(termianl || !original) && <PrevStn stnIds={props.prevStnIds} />}
        </>
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
    const { routes, branches } = useAppSelector(store => store.helper);
    const middle = svgWidth.runin / 2;

    const LINE_WIDTH = 12;
    const LINE_Y = 125;

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
                  [svgWidth.runin / 3, LINE_Y],
                  [svgWidth.runin / 6, nextBranchLineDy],
                  [36, nextBranchLineDy],
              ]
            : [
                  [(svgWidth.runin / 3) * 2, LINE_Y],
                  [(svgWidth.runin / 6) * 5, nextBranchLineDy],
                  [svgWidth.runin - 36, nextBranchLineDy],
              ]
    ) as [number, number][];
    let prevDots = (
        direction === 'l'
            ? [
                  [(svgWidth.runin / 3) * 2, LINE_Y],
                  [(svgWidth.runin / 6) * 5, prevBranchLineDy],
                  [svgWidth.runin - 24, prevBranchLineDy],
              ]
            : [
                  [svgWidth.runin / 3, LINE_Y],
                  [svgWidth.runin / 6, prevBranchLineDy],
                  [24, prevBranchLineDy],
              ]
    ) as [number, number][];

    let nextColor = 'var(--rmg-theme-colour)';

    const stnStates = React.useMemo(
        () => getStnState(current_stn_idx, routes, direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [current_stn_idx, direction, routes.toString()]
    );
    if (coline?.length > 0) {
        const colineStns = calculateColine(calculateColineStations(coline, branches), stnStates);
        const colineStns_ = [...colineStns.main, ...colineStns.pass];

        // if next stns have coline branch here
        if (
            direction === 'r' &&
            nextStnIds.length > 1 &&
            colineStns_.filter(
                stns =>
                    stns.linePath.includes(current_stn_idx) && nextStnIds.some(stnId => stns.linePath.includes(stnId))
            )
        ) {
            // no idea why strokeWidth is 12 but only when dy = -11 will be perfect
            nextDots[0][1] -= LINE_WIDTH - 1;
            nextDots.unshift([middle, LINE_Y - LINE_WIDTH + 1]);
            nextColor = colineStns_
                .filter(
                    stns =>
                        stns.linePath.includes(current_stn_idx) &&
                        nextStnIds.some(stnId => stns.linePath.includes(stnId))
                )
                .at(0)!
                .colors.at(0)![2];
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
