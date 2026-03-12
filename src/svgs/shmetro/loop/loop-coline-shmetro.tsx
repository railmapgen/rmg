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

    const coline_segments = [X_LEFT, ...loop_stns.top.map(id => xs[id]), X_RIGHT]
        .map((x, i, arr) => {
            if (i === arr.length - 1) return null;

            const prev_id = i === 0 ? null : loop_stns.top[i - 1];
            const next_id = i === loop_stns.top.length ? null : loop_stns.top[i];

            // Use the station in the travel direction's "behind" side to decide if this segment is past.
            // For direction 'l' (leftward), the segment after a station is the one to its right (prev_id).
            // For direction 'r' (rightward), the segment after a station is the one to its left (next_id).
            const ref_id = direction === 'l' ? prev_id : next_id;
            // If ref_id is at the edge (null), fall back to the station on the other side of the segment.
            const fallback_id = direction === 'l' ? next_id : prev_id;
            const is_past =
                canvas !== CanvasType.Indoor &&
                (ref_id
                    ? (colinePastStationIds?.has(ref_id) ?? false) || ref_id === current_stn_id
                    : fallback_id
                      ? (colinePastStationIds?.has(fallback_id) ?? false)
                      : false);

            return { from: x, to: arr[i + 1], gray: is_past };
        })
        .filter(Boolean) as { from: number; to: number; gray: boolean }[];

    return (
        <g id="coline_main">
            {coline_segments.map(({ from, to, gray }, j) => (
                <path
                    key={j}
                    d={`M${from},${Y_TOP} H${to}`}
                    strokeWidth={12}
                    stroke={gray ? 'var(--rmg-grey)' : coline_main_color?.at(0)?.at(2)}
                />
            ))}
            {
                // additional station cover on the rail map
                canvas === CanvasType.RailMap &&
                    Object.keys(coline).length > 0 &&
                    loop_stns.top.map(stn_id => {
                        const is_stn_past = colinePastStationIds?.has(stn_id) ?? false;
                        return (
                            <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                {info_panel_type === 'sh2020' ? (
                                    <>
                                        <rect
                                            stroke="none"
                                            height={24}
                                            width={12}
                                            x={-6}
                                            y={-COLINE_GAP - 1}
                                            fill={is_stn_past ? 'var(--rmg-grey)' : coline_main_color?.at(0)?.at(2)}
                                        />
                                        <rect
                                            stroke="none"
                                            height={COLINE_GAP + LINE_WIDTH}
                                            width={12}
                                            x={-6}
                                            y={LINE_WIDTH - 2}
                                            fill={is_stn_past ? 'var(--rmg-grey)' : 'var(--rmg-theme-colour)'}
                                        />
                                    </>
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
