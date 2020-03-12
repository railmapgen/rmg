import * as React from 'react';

const DefsGZMTR = React.memo(() => (
    <defs>
        <path
            id="stn"
            className="rmg-stn"
            d="M 0,9.25 V -9.25 H -9.25 a 9.25,9.25 0 0,0 0,18.5 h 18.5 a 9.25,9.25 0 0,0 0,-18.5 H 0 "
        />
        <path
            id="stn_pass"
            stroke="#aaa"
            fill="#fff"
            strokeWidth={2}
            d="M 0,9.25 V -9.25 H -9.25 a 9.25,9.25 0 0,0 0,18.5 h 18.5 a 9.25,9.25 0 0,0 0,-18.5 H 0 "
        />

        <path id="inttick" d="M 0,0 v 18" strokeLinecap="square" />
        <rect id="intbox" x={-22.5} height={24} width={45} rx={4.5} />
    </defs>
));

export default DefsGZMTR;
