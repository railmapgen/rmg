import React from 'react';

const RunIn = (style => {
    switch (style) {
        case 'shmetro':
            return React.lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin-shmetro'));
        default:
            return React.lazy(() => import(/* webpackChunkName: "runinMTR" */ './runin-gzmtr'));
    }
})(window.urlParams.get('style'));

const RunInBase = (props: React.SVGProps<SVGSVGElement> & { children?: React.ReactNode }) => (
    <svg {...props}>
        {props.children}
        <RunIn />
    </svg>
);

export default RunInBase;
