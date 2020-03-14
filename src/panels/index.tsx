import * as React from 'react';
import { createMuiTheme, useMediaQuery, ThemeProvider, CircularProgress } from '@material-ui/core';

import PanelTabs from './panels';
import { RMGParam } from '../types';

interface Props {
    param: RMGParam;
    paramUpdate: (key, data) => void;
    tpo: string[];
}

export default (props: Props) => {
    return (
        <div>
            <React.Suspense fallback={<CircularProgress />}>
                <PanelTabs {...props} />
            </React.Suspense>
        </div>
    );
};
