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

const RailMapBase = (props: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
    <svg {...props}>
        {props.children}
        <RailMap />
    </svg>
);

export default RailMapBase;
