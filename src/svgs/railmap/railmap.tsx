import * as React from 'react';
import { ParamContext, CanvasContext } from '../../context';

const RailMap = (style => {
    switch (style) {
        case 'gzmtr':
            return React.lazy(() => import(/* webpackChunkName: "railmapGZMTR" */ './railmap-gzmtr'));
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "railmapSHMetro" */ './railmap-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "railmapMTR" */ './railmap-mtr'));
    }
})(window.urlParams.get('style'));

const RailMapBase = () => {
    const { param } = React.useContext(ParamContext);
    const { canvasScale } = React.useContext(CanvasContext);
    return (
        <RailMap
            id="railmap"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox={`0 0 ${param.svg_width} ${param.svg_height}`}
            height={param.svg_height * canvasScale}
            style={{
                ['--rmg-svg-width' as any]: param.svg_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
                ['--rmg-theme-fg' as any]: param.theme[3],
            }}
        />
    );
};

export default RailMapBase;
