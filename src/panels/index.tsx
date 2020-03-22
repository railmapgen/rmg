import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

import PanelTabs from './panels';

interface Props {
    param: RMGParam;
    paramUpdate: (key: string, data: any) => void;
    tpo: string[];
}

export default (props: Props) => {
    return (
        <React.Suspense fallback={<CircularProgress />}>
            <PanelTabs {...props} />
        </React.Suspense>
    );
};
