import { useId } from 'react';

export interface CapsuleSegment {
    /** Visual outer height (px) of this segment, including the 1px stroke on shared ends. */
    h: number;
    color: string;
}

/**
 * General N-segment vertically stacked capsule.
 * `yTop` is the y-coordinate of the visual outer top of the capsule (topmost pixel of stroke).
 * `h` values describe the visual outer height of each segment (including the 1px stroke boundary).
 * Segment colour boundaries are at the cumulative sum of `h` values measured from `yTop`.
 *
 * The same capsule path is drawn once per segment, each clipped to its own vertical slice,
 * so each slice can have a different stroke colour.
 */
export const MultiSegmentCapsule = ({ r, yTop, segments }: { r: number; yTop: number; segments: CapsuleSegment[] }) => {
    const uid = useId().replace(/:/g, '_');

    const totalH = segments.reduce((acc, s) => acc + s.h, 0);
    // Path geometry is 1px inset from the visual boundary on both top and bottom,
    // because the 2px stroke extends 1px outward beyond the path.
    const pathYTop = yTop + 1;
    const pathYBottom = yTop + totalH - 1;
    const topArcCy = pathYTop + r;
    const bottomArcCy = pathYBottom - r;

    // shared path for background fill and per-segment strokes
    const d = `M ${-r},${topArcCy} a ${r},${r} 0 1 1 ${2 * r},0 V${bottomArcCy} a ${r},${r} 0 1 1 ${-2 * r},0 Z`;

    // clip boundaries in visual (outer) coordinates
    const bounds: number[] = [];
    let y = yTop;
    for (const seg of segments) {
        bounds.push(y);
        y += seg.h;
    }
    bounds.push(y);

    const clipX = -(r + 2);
    const clipW = (r + 2) * 2;

    return (
        <>
            <path fill="var(--rmg-white)" stroke="none" d={d} />
            <defs>
                {segments.map((_, i) => (
                    <clipPath key={i} id={`${uid}s${i}`} clipPathUnits="userSpaceOnUse">
                        <rect x={clipX} y={bounds[i]} width={clipW} height={bounds[i + 1] - bounds[i]} />
                    </clipPath>
                ))}
            </defs>
            {segments.map((seg, i) => (
                <g key={i} clipPath={`url(#${uid}s${i})`}>
                    <path fill="none" strokeWidth={2} stroke={seg.color} d={d} />
                </g>
            ))}
        </>
    );
};
