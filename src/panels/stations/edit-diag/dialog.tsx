import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Icon, Typography, CircularProgress, DialogActions, Button, useTheme, useMediaQuery } from '@material-ui/core';
import { StationInfo } from '../../../types';

const NameTab = React.lazy(() => import(/* webpackChunkName: "panelStationsName" */ './name-tab'));
const InterchangeTab = React.lazy(() => import(/* webpackChunkName: "panelStationsInterchange" */ './interchange-tab'));
const BranchTab = React.lazy(() => import(/* webpackChunkName: "panelStationsBranch" */ './branch-tab'));
const MoreTab = React.lazy(() => import(/* webpackChunkName: "panelStationsMore" */ './more-tab'));

interface StationEditDialogProps {
    onClose: () => void;
    onUpdate: (value, field, index?) => void;
    open: boolean;
    stnId: string;
    stnInfo: StationInfo;
    stnList: {
        [stnId: string]: StationInfo;
    };
}

export default function StationEditDialog(props: StationEditDialogProps) {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = React.useState(0);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const tabClasses = {
        root: 'tab-nav',
        wrapper: 'tab-nav', 
        labelIcon: 'tab-nav',
    };

    return (
        <Dialog onClose={props.onClose} open={props.open} fullScreen={fullScreen}>
            <DialogTitle>{t('stations.edit.title')}</DialogTitle>
            <DialogContent dividers style={{padding: '0 16px'}}>
                <Tabs value={tabIndex} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    onChange={(_,val) => setTabIndex(val)} 
                    variant="scrollable" scrollButtons="off">
                    <Tab 
                        label={<span>{t('stations.edit.tab.name')}</span>} 
                        icon={<Icon>title</Icon>} 
                        classes={tabClasses}
                    />
                    <Tab 
                        label={<span>{t('stations.edit.tab.interchange')}</span>} 
                        icon={<Icon>transfer_within_a_station</Icon>} 
                        classes={tabClasses}
                    />
                    <Tab 
                        label={<span>{t('stations.edit.tab.branch')}</span>} 
                        icon={<Icon>share</Icon>} 
                        classes={tabClasses}
                    />
                    <Tab 
                        label={<span>{t('stations.edit.tab.more')}</span>} 
                        icon={<Icon>more_horiz</Icon>} 
                        classes={tabClasses}
                    />
                </Tabs>
                <Typography
                    component="div"
                    role="tabpanel">
                    <React.Suspense fallback={<CircularProgress />}>
                        {((idx) => {
                            switch (idx) {
                                case 0:
                                    return <NameTab onUpdate={props.onUpdate} stnInfo={props.stnInfo} />
                                case 1:
                                    return <InterchangeTab
                                        stnTrans={props.stnInfo.transfer}
                                        onUpdate={(trans) => props.onUpdate(trans, 'transfer')}
                                        />
                                case 2:
                                    return <BranchTab
                                        branch={props.stnInfo.branch}
                                        parents={props.stnInfo.parents}
                                        children={props.stnInfo.children}
                                        stnList={props.stnList}
                                        onUpdate={(value, field) => props.onUpdate(value, 'branch', field)}
                                        />
                                case 3:
                                    return <MoreTab
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
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}