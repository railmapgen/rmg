import * as React from 'react';

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

export default RailMap;
