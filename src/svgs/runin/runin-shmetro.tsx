import React, { useMemo, memo } from 'react';
import { Name } from '../../constants/constants';
import { useAppSelector } from '../../redux';

const RunInSHMetro = () => {
    const { routes } = useAppSelector(store => store.helper)
    const param = useAppSelector(store => store.param);

    // get the height
    const dh = param.svg_height - 300;

    const prevStnIds = useMemo(
        () => {
            // reduce from https://stackoverflow.com/questions/43773999/remove-duplicates-from-arrays-using-reduce
            // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
            return (
                routes
                    .filter(route => route.includes(param.current_stn_idx))
                    .map(route => route[route.indexOf(param.current_stn_idx) + (param.direction === 'l' ? 1 : -1)])
                    // .flat()
                    // remove duplicate
                    .reduce((acc, cur) => (acc.includes(cur) ? acc : acc.concat(cur)), [] as string[])
            );
        },
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
    </defs>
));

interface RunInGeneralProps {
    prevStnIds: string[];
    nextStnIds: string[];
}

const GeneralStation = (props: RunInGeneralProps) => {
    const param = useAppSelector(store => store.param);
    const middle = param.svgWidth.runin / 2;

    const termianl = props.nextStnIds.length === 1 && ['linestart', 'lineend'].includes(props.nextStnIds[0]);
    const original = props.prevStnIds.length === 1 && ['linestart', 'lineend'].includes(props.prevStnIds[0]);

    const nextNames = props.nextStnIds.map(stnId => param.stn_list[stnId].name);
    const nextBranchLineDy = (props.nextStnIds.length > 1 ? (nextNames[0][0].split('\\').length - 1) * -50 +
                                                       (nextNames[0][1].split('\\').length - 1) * -30 : 0) + 10
    const prevNames = props.prevStnIds.map(stnId => param.stn_list[stnId].name);
    const prevBranchLineDy = (props.prevStnIds.length > 1 ? (prevNames[0][0].split('\\').length - 1) * -50 +
                                                        (prevNames[0][1].split('\\').length - 1) * -30 : 0) + 10

    return (
        <>
            <g transform="translate(0,110)" strokeWidth={12} fill="none">
                {props.nextStnIds.length > 1 && (
                    <path
                        stroke="var(--rmg-theme-colour)"
                        d={
                            param.direction === 'l'
                                ? `M${param.svgWidth.runin / 3},125 L${param.svgWidth.runin / 6},${nextBranchLineDy} H36`
                                : `M${(param.svgWidth.runin / 3) * 2},125 L${(param.svgWidth.runin / 6) * 5},${nextBranchLineDy} H${
                                      param.svgWidth.runin - 36
                                  }`
                        }
                        markerEnd="url(#slope)"
                    />
                )}
                {props.prevStnIds.length > 1 && (
                    <path
                        stroke="gray"
                        d={
                            param.direction === 'l'
                                ? `M${(param.svgWidth.runin / 3) * 2},125 L${(param.svgWidth.runin / 6) * 5},${prevBranchLineDy} H${
                                      param.svgWidth.runin - 24
                                  }`
                                : `M${param.svgWidth.runin / 3},125 L${param.svgWidth.runin / 6},${prevBranchLineDy} H24`
                        }
                    />
                )}
            </g>

            {termianl && param.info_panel_type !== 'sh2020' ? (
                <>
                    <path
                        transform="translate(0,220)"
                        stroke="gray"
                        strokeWidth={12}
                        d={`M24,16 H ${param.svgWidth.runin - 24}`}
                    />

                    <g transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},160)`}
                        textAnchor={param.direction === 'l' ? 'start' : 'end'} >
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

                    <g transform={`translate(${param.direction === 'l' ? param.svgWidth.runin - 36 : 36},160)`}
                        textAnchor={param.direction === 'l' ? 'end' : 'start'} >
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
                        <path
                            stroke="gray"
                            d={`M ${middle},16 H ${param.direction === 'l' ? param.svgWidth.runin - 24 : 24} `}
                        />
                    </g>

                    <g transform={`translate(${middle},160)`} textAnchor="middle">
                        <CurrentText />
                    </g>
                </>
            )}

            {(original || !termianl) && (<NextStn stnIds={props.nextStnIds} />)}
            {(termianl || !original) && (<PrevStn stnIds={props.prevStnIds} />)}
        </>
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
                        {nextName[0].split('\\').map((name, i, array)=>(
                            <text className="rmg-name__zh" fontSize={48} key={name}
                                dy={(array.length - 1 - i) * -50 - (nextName[1].split('\\').length - 1) * 30}>
                                {name}
                            </text>
                        ))}
                        {nextName[1].split('\\').map((name, i, array)=>(
                            <text className="rmg-name__en" fontSize={24} key={name}
                                dy={28 + (array.length - 1 - i) * -30}>
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
    const prevHintDy = (props.stnIds.length > 1 ? 15 : 125) +
        nextNames.map(name => name[0].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -50 +
        nextNames.map(name => name[1].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -30
    const nextBranchTextDy = (props.stnIds.length > 1 ? (nextNames[0][0].split('\\').length - 1) * -50 +
        (nextNames[0][1].split('\\').length - 1) * -30 : 0) + 70

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
    const nextHintDy = (props.stnIds.length > 1 ? 15 : 125) +
        nextNames.map(name => name[0].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -50 +
        nextNames.map(name => name[1].split('\\').length).reduce((acc, cur) => acc + cur, -nextNames.length) * -30
    const nextBranchTextDy = (props.stnIds.length > 1 ? (nextNames[0][0].split('\\').length - 1) * -50 +
                                                       (nextNames[0][1].split('\\').length - 1) * -30 : 0) + 70

    return (
        <g
            textAnchor={param.direction === 'l' ? 'start' : 'end'}
            transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},0)`}
        >
            <NextText nextName={param.stn_list[props.stnIds[0]].name} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText nextName={param.stn_list[props.stnIds[1]].name} transform={`translate(0,${nextBranchTextDy})`}/>
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
