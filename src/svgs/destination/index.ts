import * as React from 'react';

const Destination = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "destinationSHMetro" */ './destination-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination-mtr'));
    }
})(window.urlParams.get('style'));

export default Destination;
