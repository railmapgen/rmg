import * as React from 'react';

const RunIn = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "runinMTR" */ './runin-gzmtr'));
    }
})(window.urlParams.get('style'));

export default RunIn;
