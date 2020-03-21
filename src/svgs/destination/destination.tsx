import * as React from 'react';

const Destination = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "destinationSHMetro" */ './destination-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination-mtr'));
    }
})(window.urlParams.get('style'));

const DestinationBase = (props: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
    <svg {...props}>
        {props.children}
        <Destination />
    </svg>
);

export default DestinationBase;
