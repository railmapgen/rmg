import { useRootSelector } from '../../../redux';
import { isColineBranch } from '../../../redux/param/coline-action';
import { CanvasType } from '../../../constants/constants';
import { ColineStnState } from './loop-coline-order';
import { ColourHex } from '@railmapgen/rmg-palette-resources';

export const LoopColine = (props: {
    edges: [number, number, number, number];
    loop_stns: {
        top: string[];
        left: string[];
        right: string[];
        bottom: string[];
    };
    xs: {
        [stn_id: string]: number;
    };
    ys: {
        [stn_id: string]: number;
    };
    canvas: CanvasType.RailMap | CanvasType.Indoor;
    indexInTop: number | undefined;
    colineStnStates: Record<string, ColineStnState> | undefined;
}) => {
    const { edges, loop_stns, xs, ys, canvas, indexInTop: index_in_top, colineStnStates } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;
    const { info_panel_type, stn_list, coline, direction } = useRootSelector(store => store.param);

    const { branches } = useRootSelector(store => store.helper);

    // find the coline color on the main/loop line
    const coline_main_color = Object.values(coline)
        .filter(co =>
            [co.from, co.to].every(stn_id =>
                branches
                    .slice(1, 3)
                    .filter(branch => isColineBranch(branch, stn_list))
                    .flat()
                    .includes(stn_id)
            )
        )
        .map(co => co.colors)
        .at(0); // only one coline in loop line is supported

    const LINE_WIDTH = 12;
    const COLINE_GAP = canvas === CanvasType.RailMap && info_panel_type === 'sh2020' ? 3 : 0;

    const top = loop_stns.top;

    let pass_path: string | null = null;
    let main_path: string | null = null;

    if (canvas === CanvasType.Indoor || index_in_top === undefined) {
        main_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
    } else if (index_in_top === top.length) {
        if (direction === 'l') {
            main_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
        } else {
            pass_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
        }
    } else if (index_in_top === -1) {
        if (direction === 'l') {
            pass_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
        } else {
            main_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
        }
    } else {
        const split_x = xs[top[index_in_top]];
        if (direction === 'l') {
            main_path = `M ${X_LEFT},${Y_TOP} H ${split_x}`;
            pass_path = `M ${split_x},${Y_TOP} H ${X_RIGHT}`;
        } else {
            pass_path = `M ${X_LEFT},${Y_TOP} H ${split_x}`;
            main_path = `M ${split_x},${Y_TOP} H ${X_RIGHT}`;
        }
    }

    const coline_color: ColourHex | undefined = coline_main_color?.at(0)?.at(2) as ColourHex | undefined;

    return (
        <g id="coline_main">
            {pass_path && <path d={pass_path} fill="none" strokeWidth={12} stroke="var(--rmg-grey)" />}
            {main_path && <path d={main_path} fill="none" strokeWidth={12} stroke={coline_color} />}
            {
                // additional station cover on the rail map
                canvas === CanvasType.RailMap &&
                    Object.keys(coline).length > 0 &&
                    loop_stns.top.map(stn_id => {
                        const is_stn_past = colineStnStates![stn_id] === -1;
                        return (
                            <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                {info_panel_type === 'sh2020' ? (
                                    is_stn_past ? (
                                        <>
                                            <rect
                                                stroke="none"
                                                height={COLINE_GAP + LINE_WIDTH}
                                                width={12}
                                                x={-6}
                                                y={LINE_WIDTH - 2}
                                                fill="var(--rmg-theme-colour)"
                                            />
                                            <rect
                                                stroke="none"
                                                height={24}
                                                width={12}
                                                x={-6}
                                                y={-COLINE_GAP - 1}
                                                fill="var(--rmg-grey)"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <rect
                                                stroke="none"
                                                height={24}
                                                width={12}
                                                x={-6}
                                                y={-COLINE_GAP - 1}
                                                fill={coline_color}
                                            />
                                            <rect
                                                stroke="none"
                                                height={COLINE_GAP + LINE_WIDTH}
                                                width={12}
                                                x={-6}
                                                y={LINE_WIDTH - 2}
                                                fill="var(--rmg-theme-colour)"
                                            />
                                        </>
                                    )
                                ) : (
                                    <use
                                        xlinkHref="#int2_sh"
                                        stroke={is_stn_past ? 'var(--rmg-grey)' : 'var(--rmg-theme-colour)'}
                                        transform={`translate(0,${1 + LINE_WIDTH})`}
                                    />
                                )}
                            </g>
                        );
                    })
            }
        </g>
    );
};
