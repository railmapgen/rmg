import * as React from 'react';
import { ParamContext, CanvasContext } from '../../context';

const RunIn = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "runinMTR" */ './runin-gzmtr'));
    }
})(window.urlParams.get('style'));

const RunInBase = () => {
    const { param } = React.useContext(ParamContext);
    const { canvasScale } = React.useContext(CanvasContext);
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="runin"
            viewBox={`0 0 ${param.svg_dest_width} ${param.svg_height}`}
            height={param.svg_height * canvasScale}
            style={{
                ['--rmg-svg-width' as any]: param.svg_dest_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
                ['--rmg-theme-fg' as any]: param.theme[3],
            }}
        >
            <rect id="outer" x={0} y={0} />
            <RunIn />
        </svg>
    );
};

export default RunInBase;
