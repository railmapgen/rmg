import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './i18n';
import PanelTab from './panels/panels';

export default function App(props) {
    return (
        // <React.Suspense fallback="loading">
            <PanelTab useSuspense={false} />
        // </React.Suspense>
    );
}

