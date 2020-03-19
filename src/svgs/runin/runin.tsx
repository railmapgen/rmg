import * as React from 'react';

const RunIn = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "runinMTR" */ './runin-gzmtr'));
    }
})(window.urlParams.get('style'));

const RunInBase = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props}>
        <rect id="outer" x={0} y={0} />
        <RunIn />
    </svg>
);

export default RunInBase;
