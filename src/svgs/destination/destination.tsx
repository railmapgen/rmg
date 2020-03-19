import * as React from 'react';

const Destination = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "destinationSHMetro" */ './destination-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination-mtr'));
    }
})(window.urlParams.get('style'));

const DestinationBase = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props}>
        <rect id="outer" x={0} y={0} />

        <Destination />
    </svg>
);

export default DestinationBase;
