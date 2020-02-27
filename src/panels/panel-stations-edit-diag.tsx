import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Icon, Typography, CircularProgress, DialogActions, Button, useTheme, useMediaQuery } from '@material-ui/core';
import { StationInfo } from '../types';

const StationEditNameTab = React.lazy(() => import(/* webpackChunkName: "panelStationsName" */ './panel-stations-name'));
const StationEditInterchangeTab = React.lazy(() => import(/* webpackChunkName: "panelStationsInterchange" */ './panel-stations-interchange'));
const StationEditBranchTab = React.lazy(() => import(/* webpackChunkName: "panelStationsBranch" */ './panel-stations-branch'));
const StationEditMoreTab = React.lazy(() => import(/* webpackChunkName: "panelStationsMore" */ './panel-stations-more'));

interface StationEditDialogProps {
    onClose: () => void;
    onUpdate: (value, field, index?) => void;
    open: boolean;
    stnId: string;
    stnInfo: StationInfo;
    stnList: {
        [stnId: string]: StationInfo;
    };
    classes: any;
}

interface StationEditDialogState {
    tabIndex: number;
}

export default function StationEditDialog(props: StationEditDialogProps) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const tabChange = (event, newValue) => {
        setTabIndex(newValue);
    }

    const tabClasses = {
        root: 'tab-nav',
        wrapper: 'tab-nav', 
        labelIcon: 'tab-nav',
    };

    return (
        <Dialog onClose={props.onClose} open={props.open} fullScreen={fullScreen}>
            <DialogTitle>Edit Station Detail</DialogTitle>
            <DialogContent dividers>
                <div>
                    <Tabs value={tabIndex} indicatorColor="primary" textColor="primary" onChange={tabChange} variant="scrollable" scrollButtons="off">
                        <Tab 
                            label={<span>Name</span>} 
                            icon={<Icon>title</Icon>} 
                            classes={tabClasses}
                        />
                        <Tab 
                            label={<span>Interchange</span>} 
                            icon={<Icon>transfer_within_a_station</Icon>} 
                            classes={tabClasses}
                        />
                        <Tab 
                            label={<span>Branch</span>} 
                            icon={<Icon>share</Icon>} 
                            classes={tabClasses}
                        />
                        <Tab 
                            label={<span>More</span>} 
                            icon={<Icon>more_horiz</Icon>} 
                            classes={tabClasses}
                        />
                    </Tabs>
                </div>
                <Typography
                    component="div"
                    role="tabpanel">
                    <React.Suspense fallback={<CircularProgress />}>
                        {((idx) => {
                            switch (idx) {
                                case 0:
                                    return <StationEditNameTab onUpdate={props.onUpdate} stnInfo={props.stnInfo} />
                                case 1:
                                    return <StationEditInterchangeTab
                                        stnTrans={props.stnInfo.transfer}
                                        onUpdate={(trans) => props.onUpdate(trans, 'transfer')}
                                        />
                                case 2:
                                    return <StationEditBranchTab
                                        branch={props.stnInfo.branch}
                                        parents={props.stnInfo.parents}
                                        children={props.stnInfo.children}
                                        stnList={props.stnList}
                                        onUpdate={(value, field) => props.onUpdate(value, 'branch', field)}
                                        />
                                case 3:
                                    return <StationEditMoreTab
                                        facility={props.stnInfo.facility}
                                        services={new Set(props.stnInfo.services)}
                                        onUpdate={(value, field) => props.onUpdate(value, field)}
                                        />
                            }
                        })(tabIndex)}
                    </React.Suspense>
                </Typography>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}