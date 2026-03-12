import { useRootSelector } from '../../../redux';
import { isColineBranch } from '../../../redux/param/coline-action';
import { CanvasType } from '../../../constants/constants';

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
    colinePastStationIds?: Set<string>;
}) => {
    const { edges, loop_stns, xs, ys, canvas, colinePastStationIds } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;
    const {
        info_panel_type,
        stn_list,
        coline,
        current_stn_idx: current_stn_id,
        direction,
    } = useRootSelector(store => store.param);

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

    // past coline stations form a contiguous block on the top (monotonicity),
    // so scan from the front (travel direction) to find the first past/current station as the split point
    const top = loop_stns.top;
    const ordered = direction === 'l' ? top : [...top].reverse();
    const isPast = (id: string) => colinePastStationIds?.has(id) ?? false;
    const first_past_or_current_idx =
        canvas !== CanvasType.Indoor ? ordered.findIndex(id => isPast(id) || id === current_stn_id) : -1;

    let gray_path: string | null = null;
    let colored_path: string | null = null;

    if (first_past_or_current_idx === -1) {
        // no past or current station on top, all colored
        colored_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
    } else if (first_past_or_current_idx === 0 && isPast(ordered[0])) {
        // first station is truly past (not just current), entire line is gray
        gray_path = `M ${X_LEFT},${Y_TOP} H ${X_RIGHT}`;
    } else {
        // split at the found station, the edge segment before it stays colored
        const split_x = xs[ordered[first_past_or_current_idx]];
        if (direction === 'l') {
            colored_path = `M ${X_LEFT},${Y_TOP} H ${split_x}`;
            gray_path = `M ${split_x},${Y_TOP} H ${X_RIGHT}`;
        } else {
            gray_path = `M ${X_LEFT},${Y_TOP} H ${split_x}`;
            colored_path = `M ${split_x},${Y_TOP} H ${X_RIGHT}`;
        }
    }

    return (
        <g id="coline_main">
            {gray_path && <path d={gray_path} fill="none" strokeWidth={12} stroke="var(--rmg-grey)" />}
            {colored_path && (
                <path d={colored_path} fill="none" strokeWidth={12} stroke={coline_main_color?.at(0)?.at(2)} />
            )}
            {
                // additional station cover on the rail map
                canvas === CanvasType.RailMap &&
                    Object.keys(coline).length > 0 &&
                    loop_stns.top.map(stn_id => {
                        const is_stn_past = colinePastStationIds?.has(stn_id) ?? false;
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
                                                fill={coline_main_color?.at(0)?.at(2)}
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
