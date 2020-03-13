import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Icon,
    Typography,
    CircularProgress,
    DialogActions,
    Button,
    useTheme,
    useMediaQuery,
    makeStyles,
    createStyles,
} from '@material-ui/core';
import { InterchangeInfo, StationTransfer } from '../../../types';
import { ParamContext } from '../../../context';

const NameTab = React.lazy(() => import(/* webpackChunkName: "panelStationsName" */ './name-tab'));
const InterchangeTab = React.lazy(() => import(/* webpackChunkName: "panelStationsInterchange" */ './interchange-tab'));
const BranchTab = React.lazy(() => import(/* webpackChunkName: "panelStationsBranch" */ './branch-tab'));
const MoreTab = React.lazy(() => import(/* webpackChunkName: "panelStationsMore" */ './more-tab'));

const useStyles = makeStyles(theme =>
    createStyles({
        tab: {
            padding: '6px 24px',
            height: 48,
            minWidth: 'calc(100% / 4)',
            '& .MuiTab-wrapper': {
                flexDirection: 'row',
            },
            '&.MuiTab-labelIcon': {
                minHeight: 'unset',
                '& .MuiTab-wrapper': {
                    '& > *:first-child': {
                        marginBottom: 0,
                    },
                    '& > *:not(first-child)': {
                        paddingLeft: 8,
                    },
                },
            },
        },
    })
);

interface StationEditDialogProps {
    onClose: () => void;
    onUpdate: (value, field, index?) => void;
    open: boolean;
    stnId: string;
}

export default function StationEditDialog(props: StationEditDialogProps) {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnList = param.stn_list;
    const stnInfo = stnList[props.stnId];

    const [tabIndex, setTabIndex] = React.useState(0);

    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const tabNav = React.useMemo(
        () => (
            <Tabs
                value={tabIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={(_, val) => setTabIndex(val)}
                variant="scrollable"
                scrollButtons="off"
            >
                {[
                    ['name', 'title'],
                    ['interchange', 'transfer_within_a_station'],
                    ['branch', 'share'],
                    ['more', 'more_horiz'],
                ].map((val, i) => (
                    <Tab
                        label={<span>{t('stations.edit.tab.' + val[0])}</span>}
                        icon={<Icon>{val[1]}</Icon>}
                        key={i}
                        className={classes.tab}
                    />
                ))}
            </Tabs>
        ),
        [tabIndex]
    );

    const interchangeUpdate = (transInfo: StationTransfer) => {
        let updatedValue = {
            ...transInfo,
            info: transInfo.info.map(inf =>
                inf.map(i =>
                    Object.values(i).length === 0
                        ? ((param.theme.concat(['轉綫', 'Line']) as unknown) as InterchangeInfo)
                        : i
                )
            ),
        };

        // window.myLine.updateStnTransfer2(props.stnId, updatedValue);
        dispatch({
            type: 'UPDATE_STATION_TRANSFER',
            stnId: props.stnId,
            transfer: updatedValue,
        });
    };

    return (
        <Dialog onClose={props.onClose} open={props.open} fullScreen={fullScreen}>
            <DialogTitle>{t('stations.edit.title')}</DialogTitle>
            <DialogContent dividers style={{ padding: '0 16px' }}>
                {tabNav}
                <Typography component="div" role="tabpanel">
                    <React.Suspense fallback={<CircularProgress />}>
                        {(idx => {
                            switch (idx) {
                                case 0:
                                    return <NameTab stnId={props.stnId} />;
                                case 1:
                                    return (
                                        <InterchangeTab
                                            stnTrans={stnInfo.transfer}
                                            onUpdate={interchangeUpdate}
                                            stnId={props.stnId}
                                        />
                                    );
                                case 2:
                                    return <BranchTab stnId={props.stnId} />;
                                case 3:
                                    return (
                                        <MoreTab
                                            facility={stnInfo.facility}
                                            services={new Set(stnInfo.services)}
                                            onUpdate={(value, field) => props.onUpdate(value, field)}
                                            stnId={props.stnId}
                                        />
                                    );
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
    );
}
