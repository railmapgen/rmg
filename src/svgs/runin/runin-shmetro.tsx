import * as React from 'react';
import { ParamContext } from '../../context';
import InfoSHMetro from './info-shmetro';

const RunInSHMetro = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="runin"
            style={{
                width: 'var(--rmg-svg-width)',
                height: 'var(--rmg-svg-height)',
                ['--rmg-svg-width' as any]: param.svg_dest_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
                ['--rmg-theme-fg' as any]: param.theme[3],
            }}
        >
            <rect id="outer" x={0} y={0} />

            <InfoSHMetro />
        </svg>
    );
};

export default RunInSHMetro;
