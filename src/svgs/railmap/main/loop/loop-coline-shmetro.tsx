import { useRootSelector } from '../../../../redux';
import { isColineBranch } from '../../../../redux/param/coline-action';
import { CanvasType } from '../../../../constants/constants';

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
}) => {
    const { edges, loop_stns, xs, ys, canvas } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;
    const { info_panel_type, stn_list, coline } = useRootSelector(store => store.param);

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
    return (
        <g id="coline_main">
            <path d={`M ${X_LEFT},${Y_TOP} H${X_RIGHT}`} strokeWidth={12} stroke={coline_main_color?.at(0)?.at(2)} />
            {
                // additional station cover on the rail map
                canvas === CanvasType.RailMap &&
                    Object.keys(coline).length > 0 &&
                    loop_stns.top.map(stn_id => (
                        <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                            {info_panel_type === 'sh2020' ? (
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
                            ) : (
                                <use
                                    xlinkHref="#int2_sh"
                                    stroke="var(--rmg-theme-colour)"
                                    transform={`translate(0,${1 + LINE_WIDTH})`}
                                />
                            )}
                        </g>
                    ))
            }
        </g>
    );
};
