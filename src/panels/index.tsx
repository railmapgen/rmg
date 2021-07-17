import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

import PanelTabs from './panels';

export default function Panel() {
    return (
        <React.Suspense fallback={<CircularProgress />}>
            <PanelTabs />
        </React.Suspense>
    );
}
