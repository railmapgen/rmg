import * as React from 'react';

const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_sh" fill="#fff" stroke="var(--rmg-theme-colour)" strokeWidth={2} r={5}/>
        <circle id="stn_sh_pass" fill="#fff" stroke="#aaa" strokeWidth={2} r={5}/>
        <path id="int2_sh" fill="#fff" stroke="var(--rmg-theme-colour)" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"/>
        <path id="int2_sh_pass" fill="#fff" stroke="#aaa" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"/>
    </defs>
));

export default DefsSHMetro;