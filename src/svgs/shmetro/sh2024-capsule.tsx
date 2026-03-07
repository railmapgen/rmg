import { useId } from 'react';

export interface CapsuleSegment {
    /** Height (px) of this segment, measured between colour-boundary lines (or to the capsule top/bottom for the first/last segment). */
    h: number;
    color: string;
}

/**
 * General N-segment vertically stacked capsule.
 * `yTop` is the y-coordinate of the topmost point of the top arc.
 * Segment boundaries are computed top-to-bottom from `yTop` using the `h` values.
 *
 * The same capsule path is drawn once per segment, each clipped to its own vertical slice,
 * so each slice can have a different stroke colour.
 */
export const MultiSegmentCapsule = ({ r, yTop, segments }: { r: number; yTop: number; segments: CapsuleSegment[] }) => {
    const uid = useId().replace(/:/g, '_');

    const yBottom = yTop + segments.reduce((acc, s) => acc + s.h, 0);
    const topArcCy = yTop + r;
    const bottomArcCy = yBottom - r;

    // shared path for background fill and per-segment strokes
    const d = `M ${-r},${topArcCy} a ${r},${r} 0 1 1 ${2 * r},0 V${bottomArcCy} a ${r},${r} 0 1 1 ${-2 * r},0 Z`;

    const bounds: number[] = [];
    let y = yTop;
    for (const seg of segments) {
        bounds.push(y);
        y += seg.h;
    }
    bounds.push(yBottom);

    const clipX = -(r + 2);
    const clipW = (r + 2) * 2;

    return (
        <>
            <path fill="var(--rmg-white)" stroke="none" d={d} />
            <defs>
                {segments.map((_, i) => {
                    // extend clip rect at the ends so the rounded stroke is not cut off
                    const clipY = bounds[i] - (i === 0 ? 1 : 0);
                    const clipH = bounds[i + 1] - bounds[i] + (i === 0 ? 1 : 0) + (i === segments.length - 1 ? 1 : 0);
                    return (
                        <clipPath key={i} id={`${uid}s${i}`} clipPathUnits="userSpaceOnUse">
                            <rect x={clipX} y={clipY} width={clipW} height={clipH} />
                        </clipPath>
                    );
                })}
            </defs>
            {segments.map((seg, i) => (
                <g key={i} clipPath={`url(#${uid}s${i})`}>
                    <path fill="none" strokeWidth={2} stroke={seg.color} d={d} />
                </g>
            ))}
        </>
    );
};
