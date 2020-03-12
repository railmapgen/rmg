import * as React from 'react';

const Defs = (style => {
    switch (style) {
        case 'gzmtr':
            return React.lazy(() =>
                import(/* webpackChunkName: "railmapDefsGZMTR" */ './defs-gzmtr')
            );
        case 'shmetro':
            return React.lazy(() =>
                import(/* webpackChunkName: "railmapDefsSHMetro" */ './defs-shmetro')
            );
        default:
            return React.lazy(() => import(/* webpackChunkName: "railmapDefsMTR" */ './defs-mtr'));
    }
})(window.urlParams.get('style'));

export default Defs;
