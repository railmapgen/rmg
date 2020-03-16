import { Stations } from './share';

export class StationsGZMTR extends Stations {
    protected _linePath(
        stnIds: string[],
        lineXs: [number, number],
        branches: string[][],
        realXs: { [stnId: string]: number },
        realYs: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] }
    ) {
        let prevY: number;
        var path = [];

        stnIds.forEach(stnId => {
            let x = realXs[stnId];
            let y = realYs[stnId];
            if (!prevY && prevY !== 0) {
                prevY = y;
                path.push(`M ${x},${y}`);
                return;
            }
            if (y === 0) {
                if (y < prevY) {
                    path.push(`H ${x - 40}`, 'a 40,40 0 0,0 40,-40', `V ${y}`);
                }
                if (y > prevY) {
                    path.push(`H ${x - 40}`, 'a 40,40 0 0,1 40,40', `V ${y}`);
                }
            } else {
                if (y < prevY) {
                    path.push(`V ${y + 40}`, 'a 40,40 0 0,1 40,-40', `H ${x}`);
                }
                if (y > prevY) {
                    path.push(`V ${y - 40}`, 'a 40,40 0 0,0 40,40', `H ${x}`);
                }
            }
            path.push(`H ${x}`);
            prevY = y;
        });

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }
}
