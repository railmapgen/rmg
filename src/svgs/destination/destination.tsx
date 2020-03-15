import * as React from 'react';
import { ParamContext, CanvasContext } from '../../context';

const Destination = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "destinationSHMetro" */ './destination-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination-mtr'));
    }
})(window.urlParams.get('style'));

const DestinationBase = () => {
    const { param } = React.useContext(ParamContext);
    const { canvasScale } = React.useContext(CanvasContext);
    return (
        <svg
            id="destination"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
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

            <Destination />
        </svg>
    );
};

export default DestinationBase;
