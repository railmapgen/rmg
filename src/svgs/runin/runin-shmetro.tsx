import React, { useContext, useMemo, memo } from 'react';
import { ParamContext } from '../../context';
import { Name } from "../../constants/constants";

const RunInSHMetro = () => {
    const { param, routes } = useContext(ParamContext);

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
    const { param } = useContext(ParamContext);
    const middle = param.svgWidth.runin / 2;

    const termianl = props.nextStnIds.length === 1 && ['linestart', 'lineend'].includes(props.nextStnIds[0])
    const original = props.prevStnIds.length === 1 && ['linestart', 'lineend'].includes(props.prevStnIds[0])

    return (
        <>
            <g transform="translate(0,110)" strokeWidth={12} fill="none">
                {props.nextStnIds.length > 1 && (
                    <path
                        stroke="var(--rmg-theme-colour)"
                        d={
                            param.direction === 'l'
                                ? `M${param.svgWidth.runin / 3},125 L${param.svgWidth.runin / 6},10 H36`
                                : `M${(param.svgWidth.runin / 3) * 2},125 L${(param.svgWidth.runin / 6) * 5},10 H${
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
                                ? `M${(param.svgWidth.runin / 3) * 2},125 L${(param.svgWidth.runin / 6) * 5},10 H${
                                      param.svgWidth.runin - 24
                                  }`
                                : `M${param.svgWidth.runin / 3},125 L${param.svgWidth.runin / 6},10 H24`
                        }
                    />
                )}
            </g>

            {termianl && param.info_panel_type === 'sh' ? (
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
            ) : original && param.info_panel_type === 'sh' ? (
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
    const { param } = useContext(ParamContext);
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
                        <text className="rmg-name__zh" fontSize={48}>
                            {nextName[0]}
                        </text>
                        <text className="rmg-name__en" fontSize={24} dy={28}>
                            {nextName[1].replace('\\', ' ')}
                        </text>
                    </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [...nextName]
            )}
        </g>
    );
};

const PrevStn = (props: { stnIds: string[] }) => {
    const { param } = useContext(ParamContext);

    return (
        <g
            fill="gray"
            textAnchor={param.direction === 'l' ? 'end' : 'start'}
            transform={`translate(${param.direction === 'l' ? param.svgWidth.runin - 36 : 36},0)`}
        >
            <NextText nextName={param.stn_list[props.stnIds[0]].name} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText nextName={param.stn_list[props.stnIds[1]].name} transform="translate(0,70)" />
            )}
            <g transform={`translate(0, ${-(props.stnIds.length > 1 ? 110 : 0) + 125})`}>
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
    const { param } = useContext(ParamContext);

    return (
        <g
            textAnchor={param.direction === 'l' ? 'start' : 'end'}
            transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.runin - 36},0)`}
        >
            <NextText nextName={param.stn_list[props.stnIds[0]].name} transform="translate(0,183)" />
            {props.stnIds.length > 1 && (
                <NextText nextName={param.stn_list[props.stnIds[1]].name} transform="translate(0,70)" />
            )}
            <g transform={`translate(0, ${-(props.stnIds.length > 1 ? 110 : 0) + 125})`}>
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
