import * as React from 'react';
import { ParamContext } from '../../context';

const InfoSHMetro = () => {
    const { param, routes } = React.useContext(ParamContext);

    // get the height
    const dh = param.svg_height - 300;

    const prevStnIds = React.useMemo(() => {
        // reduce from https://stackoverflow.com/questions/43773999/remove-duplicates-from-arrays-using-reduce
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        return (
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => route[route.indexOf(param.current_stn_idx) + (param.direction == 'l' ? 1 : -1)])
                .flat()
                // remove duplicate
                .reduce((acc, cur) => {
                    if (!acc.includes(cur)) acc.push(cur);
                    return acc;
                }, [])
        );
    }, [routes.toString(), param.current_stn_idx, param.direction]);

    const nextStnIds = React.useMemo(() => {
        return (
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => route[route.indexOf(param.current_stn_idx) + (param.direction == 'l' ? -1 : 1)])
                .flat()
                // remove duplicate
                .reduce((acc, cur) => {
                    if (!acc.includes(cur)) acc.push(cur);
                    return acc;
                }, [])
        );
    }, [routes.toString(), param.current_stn_idx, param.direction]);

    return (
        <g id="run_in_shmetro">
            {nextStnIds.length == 1 && ['linestart', 'lineend'].includes(nextStnIds[0]) ? (
                <TerminalStation dh={dh} stnIds={prevStnIds} />
            ) : prevStnIds.length == 1 && ['linestart', 'lineend'].includes(prevStnIds[0]) ? (
                <OriginStation dh={dh} stnIds={nextStnIds} />
            ) : (
                <GeneralStation dh={dh} prevStnIds={prevStnIds} nextStnIds={nextStnIds} />
            )}
        </g>
    );
};

export default InfoSHMetro;

interface RunInProps {
    dh: number;
    stnIds: string[];
}

const TerminalStation = (props: RunInProps) => {
    const { param } = React.useContext(ParamContext);

    return (
        <>
            <path
                id="run_in_line_shmetro"
                transform={`translate(0,${220 + props.dh})`}
                fill="gray"
                d={`M24,10 H ${param.svg_dest_width - 20} V 22 H 24 Z`}
            />
            <g
                id="current_text"
                transform={
                    param.direction === 'l'
                        ? `translate(${30}, ${props.dh + 160})`
                        : `translate(${param.svg_dest_width - 30}, ${props.dh + 160})`
                }
                textAnchor={param.direction === 'l' ? 'start' : 'end'}
            >
                <CurrentText />
            </g>
            <PrevStn {...props} />
        </>
    );
};

const OriginStation = (props: RunInProps) => {
    const { param } = React.useContext(ParamContext);

    return (
        <>
            <path
                id="run_in_line_shmetro"
                transform={`translate(0,${220 + props.dh})`}
                fill="var(--rmg-theme-colour)"
                d={
                    param.direction === 'l'
                        ? `M38,10 H ${param.svg_dest_width - 20} l 0,12 H 24 Z`
                        : `M24,10 H ${param.svg_dest_width - 30} l 12,12 H 24 Z`
                }
            />
            <g
                id="current_text"
                transform={
                    param.direction === 'l'
                        ? `translate(${param.svg_dest_width - 30}, ${props.dh + 160})`
                        : `translate(${30}, ${props.dh + 160})`
                }
                textAnchor={param.direction === 'l' ? 'end' : 'start'}
            >
                <CurrentText />
            </g>
            <NextStn {...props} />
        </>
    );
};

interface RunInGeneralProps {
    dh: number;
    prevStnIds: string[];
    nextStnIds: string[];
}

const GeneralStation = (props: RunInGeneralProps) => {
    const { param } = React.useContext(ParamContext);

    const middle = param.svg_dest_width / 2;

    return (
        <>
            <path
                id="run_in_line_shmetro"
                transform={`translate(0,${220 + props.dh})`}
                fill="var(--rmg-theme-colour)"
                d={
                    param.direction === 'l'
                        ? `M 38,10 H ${middle} V 22 H 24 Z`
                        : `M ${middle},10 H ${param.svg_dest_width - 30} l 12,12 H ${middle} Z`
                }
            />
            <path
                id="run_in_line_shmetro_pass"
                fill="gray"
                transform={`translate(0,${220 + props.dh})`}
                d={
                    param.direction === 'l'
                        ? `M ${middle},10 H ${param.svg_dest_width - 30} l 0,12 H ${middle} Z`
                        : `M 24,10 H ${middle} l 0,12 H 24 Z`
                }
            />
            {props.nextStnIds.length > 1 && (
                <g id="run_in_branch_shmetro" transform={`translate(0,${110 + props.dh})`}>
                    <path
                        id="run_in_line_branch_shmetro"
                        fill="var(--rmg-theme-colour)"
                        d={
                            param.direction === 'l'
                                ? `M 38,10 H ${param.svg_dest_width / 6 + 3} V 22 H 24 Z`
                                : `M ${(param.svg_dest_width / 6) * 5 - 3},10 H ${param.svg_dest_width -
                                      30} l 12,12 H ${(param.svg_dest_width / 6) * 5 - 3} Z`
                        }
                    />
                    <line
                        id="run_in_line_branch_slash_shmetro"
                        stroke="var(--rmg-theme-colour)"
                        strokeWidth="12"
                        x1={param.direction === 'l' ? param.svg_dest_width / 6 : (param.svg_dest_width / 6) * 5}
                        y1={15}
                        x2={param.direction === 'l' ? param.svg_dest_width / 3 : (param.svg_dest_width / 6) * 4}
                        y2={125}
                    />
                </g>
            )}
            {props.prevStnIds.length > 1 && (
                <g id="run_in_branch_shmetro_pass" transform={`translate(0,${110 + props.dh})`}>
                    <path
                        id="run_in_line_branch_shmetro_pass"
                        fill="gray"
                        d={
                            param.direction === 'l'
                                ? `M ${(param.svg_dest_width / 6) * 5 - 3},10 H ${param.svg_dest_width -
                                      30} l 0,12 H ${(param.svg_dest_width / 6) * 5 - 3} Z`
                                : `M 24,10 H ${param.svg_dest_width / 6 + 3} V 22 H 24 Z`
                        }
                    />
                    <line
                        id="run_in_line_branch_slash_shmetro_pass"
                        stroke="gray"
                        strokeWidth="12"
                        x1={param.direction === 'l' ? (param.svg_dest_width / 6) * 5 : param.svg_dest_width / 6}
                        y1={15}
                        x2={param.direction === 'l' ? (param.svg_dest_width / 6) * 4 : param.svg_dest_width / 3}
                        y2={125}
                    />
                </g>
            )}
            <g
                id="current_text"
                transform={`translate(${param.svg_dest_width / 2}, ${props.dh + 160})`}
                textAnchor="middle"
            >
                <CurrentText />
            </g>
            <NextStn dh={props.dh} stnIds={props.nextStnIds} />
            <PrevStn dh={props.dh} stnIds={props.prevStnIds} />
        </>
    );
};

const CurrentText = () => {
    const { param } = React.useContext(ParamContext);
    return React.useMemo(
        () => (
            <>
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="600%">
                    {param.stn_list[param.current_stn_idx].name[0]}
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="250%" dy="50">
                    {param.stn_list[param.current_stn_idx].name[1].replace('\\', ' ')}
                </text>
            </>
        ),
        [...param.stn_list[param.current_stn_idx].name]
    );
};

const PrevStn = (props: RunInProps) => {
    const { param } = React.useContext(ParamContext);

    const x = param.direction === 'l' ? param.svg_dest_width - 30 : 30;
    const dx = param.direction === 'l' ? -50 : 50;
    const txtAnchor = param.direction === 'l' ? 'end' : 'start';

    return (
        <>
            <g id="prev_stn_text" transform={`translate(${x}, ${props.dh + 185})`} textAnchor={txtAnchor}>
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="250%" fill="gray">
                    {param.stn_list[props.stnIds[0]].name[0]}
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="150%" fill="gray" dy="25">
                    {param.stn_list[props.stnIds[0]].name[1].replace('\\', ' ')}
                </text>
            </g>
            {props.stnIds.length > 1 && (
                <g id="prev_stn_branch_text" transform={`translate(${x}, ${props.dh + 75})`} textAnchor={txtAnchor}>
                    <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="250%" fill="gray">
                        {param.stn_list[props.stnIds[1]].name[0]}
                    </text>
                    <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="150%" fill="gray" dy="25">
                        {param.stn_list[props.stnIds[1]].name[1].replace('\\', ' ')}
                    </text>
                </g>
            )}
            <g
                id="prev_text"
                transform={`translate(${x}, ${props.dh - (props.stnIds.length > 1 ? 110 : 0) + 140})`}
                textAnchor={txtAnchor}
            >
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="100%" fill="gray">
                    上一站
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="75%" fill="gray" dx={dx}>
                    Past Stop
                </text>
            </g>
        </>
    );
};

const NextStn = (props: RunInProps) => {
    const { param } = React.useContext(ParamContext);

    const x = param.direction === 'l' ? 30 : param.svg_dest_width - 30;
    const dx = param.direction === 'l' ? 50 : -50;
    const txtAnchor = param.direction === 'l' ? 'start' : 'end';

    return (
        <>
            <g id="next_stn_text" transform={`translate(${x}, ${props.dh + 185})`} textAnchor={txtAnchor}>
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="250%">
                    {param.stn_list[props.stnIds[0]].name[0]}
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="150%" dy="25">
                    {param.stn_list[props.stnIds[0]].name[1].replace('\\', ' ')}
                </text>
            </g>
            {props.stnIds.length > 1 && (
                <g id="next_stn_branch_text" transform={`translate(${x}, ${props.dh + 75})`} textAnchor={txtAnchor}>
                    <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="250%">
                        {param.stn_list[props.stnIds[1]].name[0]}
                    </text>
                    <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="150%" dy="25">
                        {param.stn_list[props.stnIds[1]].name[1].replace('\\', ' ')}
                    </text>
                </g>
            )}
            <g
                id="next_text"
                transform={`translate(${x}, ${props.dh - (props.stnIds.length > 1 ? 110 : 0) + 140})`}
                textAnchor={txtAnchor}
            >
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="100%">
                    下一站
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="75%" dx={dx}>
                    Next Stop
                </text>
            </g>
        </>
    );
};
