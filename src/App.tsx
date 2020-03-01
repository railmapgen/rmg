import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './i18n';
import Panels from './panels';

export default function App(props) {
    return (
        // <React.Suspense fallback="loading">
            <Panels useSuspense={false} />
        // </React.Suspense>
    );
}

