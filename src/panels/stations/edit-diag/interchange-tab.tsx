import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Select,
    Switch,
    Tooltip,
} from '@material-ui/core';
import { ParamContext } from '../../../context';
import ColourDialog from '../../colour-diag';
import NameListItems from './name-list-items';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { InterchangeInfo, MonoColour, Name, RmgStyle, ShortDirection, Theme } from '../../../constants/constants';
import {
    addInterchange,
    removeInterchange,
    updateInterchange,
    updateStationOsiName, updateStationPaidArea,
    updateStationTickDirection
} from "../../../redux/param/action";

const StationEditInterchangeTab = (props: { stnId: string }) => {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();

    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const theme = useSelector((store: RootState) => store.param.theme);
    const { param, dispatch } = useContext(ParamContext);
    const stnTrans = param.stn_list[props.stnId].transfer;

    const [osiNameDialogOpened, setOsiNameDialogOpened] = React.useState(false);

    const addClick = (index: number) => {
        let newInfo: InterchangeInfo = [...theme, '轉綫', 'Line'];
        dispatch({
            type: 'ADD_STATION_INTERCHANGE_INFO',
            stnId: props.stnId,
            setIdx: index,
            info: newInfo,
        });
        reduxDispatch(addInterchange(props.stnId, index, newInfo));
    };

    const deleteClick = (index: number, i: number) => {
        dispatch({
            type: 'REMOVE_STATION_INTERCHANGE_INFO',
            stnId: props.stnId,
            setIdx: index,
            intIdx: i,
        });
        reduxDispatch(removeInterchange(props.stnId, index, i));
    };

    return (
        <List>
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.interchange.within')}</h3>
                </ListItemText>
                <ListItemSecondaryAction>
                    <Tooltip title={t('stations.edit.interchange.add')} aria-label="add">
                        <IconButton onClick={() => addClick(0)}>
                            <Icon>add_circle</Icon>
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <InterchangeChipSet stnId={props.stnId} setIndex={0} onDelete={i => deleteClick(0, i)} />
            </ListItem>
            {/* Out of station transfer */[RmgStyle.MTR, RmgStyle.SHMetro].includes(rmgStyle || '') && (
                <>
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            <h3 style={{ margin: 0 }}>{t('stations.edit.interchange.osi')}</h3>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            {[RmgStyle.MTR].includes(rmgStyle || '') && (
                                <React.Fragment>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={{ lineHeight: '1rem', whiteSpace: 'pre', marginRight: 5 }}
                                        onClick={() => setOsiNameDialogOpened(true)}
                                    >
                                        {stnTrans.osi_names[0] ? stnTrans.osi_names[0].join('\r\n') : '車站名\r\nStn Name'}
                                    </Button>
                                    <OSINameDialog
                                        open={osiNameDialogOpened}
                                        osiName={stnTrans.osi_names[0] || ['', '']}
                                        stnId={props.stnId}
                                        onClose={() => setOsiNameDialogOpened(false)}
                                    />
                                </React.Fragment>
                            )}
                            <Tooltip title={t('stations.edit.interchange.add')} aria-label="add">
                                <IconButton onClick={() => addClick(1)}>
                                    <Icon>add_circle</Icon>
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <InterchangeChipSet stnId={props.stnId} setIndex={1} onDelete={i => deleteClick(1, i)} />
                    </ListItem>
                    <ListItem>
                        <span>{t('stations.edit.interchange.note')}</span>
                    </ListItem>
                </>
            )}
            {/* Out of system transfer */[RmgStyle.SHMetro].includes(rmgStyle || '') && (
                <>
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            <h3 style={{ margin: 0 }}>{t('stations.edit.interchange.osysi')}</h3>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <Tooltip title={t('stations.edit.interchange.add')} aria-label="add">
                                <IconButton onClick={() => addClick(2)}>
                                    <Icon>add_circle</Icon>
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <InterchangeChipSet stnId={props.stnId} setIndex={2} onDelete={i => deleteClick(2, i)} />
                    </ListItem>
                </>
            )}
            {/* MTR more settings */rmgStyle === RmgStyle.MTR && <InterchangeMore stnId={props.stnId} />}
        </List>
    );
};

export default StationEditInterchangeTab;

const intChipSetStyles = makeStyles(() =>
    createStyles({
        intChip: {
            borderRadius: 4.5,
            height: 40,
            lineHeight: '1rem',
            margin: 2,
        },
        intChipText: {
            display: 'block',
            textAlign: 'center' as 'center',
        },
        intChipTextZH: {
            fontSize: 18,
            lineHeight: '1.2rem',
        },
        intChipTextEN: {
            fontSize: '.75rem',
            lineHeight: '.9rem',
            whiteSpace: 'pre-wrap' as 'pre-wrap',
        },
        intChipLabel: {
            paddingLeft: 6,
            paddingRight: 6,
        },
        intChipDeleteIcon: {
            marginLeft: -3,
        },
    })
);

interface InterchangeChipSetProps {
    stnId: string;
    setIndex: number;
    onDelete: (i: number) => void;
}

const InterchangeChipSet = (props: InterchangeChipSetProps) => {
    const classes = intChipSetStyles();
    const reduxDispatch = useDispatch();

    const { param, dispatch } = React.useContext(ParamContext);
    const intInfos = param.stn_list[props.stnId].transfer.info[props.setIndex];

    const [chipSelected, setChipSelected] = React.useState(-1);
    const [nameDialogOpened, setNameDialogOpened] = React.useState(false);

    const handleClick = (index: number) => {
        setChipSelected(index);
        setNameDialogOpened(true);
    };

    const nameDialogUpdate = (key: string, value: any) => {
        if (key === 'theme') {
            const newInfo = (value as string[]).concat(Array(2)) as InterchangeInfo;
            dispatch({
                type: 'UPDATE_STATION_INTERCHANGE_INFO',
                stnId: props.stnId,
                setIdx: props.setIndex,
                intIdx: chipSelected,
                info: newInfo,
            });
            reduxDispatch(updateInterchange(props.stnId, props.setIndex, chipSelected, newInfo));
        }
        if (key === 'name') {
            const newInfo = Array(4).concat(value) as InterchangeInfo;
            dispatch({
                type: 'UPDATE_STATION_INTERCHANGE_INFO',
                stnId: props.stnId,
                setIdx: props.setIndex,
                intIdx: chipSelected,
                info: newInfo,
            });
            reduxDispatch(updateInterchange(props.stnId, props.setIndex, chipSelected, newInfo));
        }
    };

    const intChips = intInfos?.map((intInfo, i) => {
        let label = (
            <span style={{ color: intInfo[3] }}>
                <span className={`${classes.intChipText} ${classes.intChipTextZH}`}>{intInfo[4]}</span>
                <span className={`${classes.intChipText} ${classes.intChipTextEN}`}>{intInfo[5]}</span>
            </span>
        );
        return (
            <Chip
                key={i}
                label={label}
                className={classes.intChip}
                classes={{
                    label: classes.intChipLabel,
                    deleteIcon: classes.intChipDeleteIcon,
                }}
                style={{ backgroundColor: intInfo[2] }}
                onDelete={() => props.onDelete(i)}
                onClick={() => handleClick(i)}
            />
        );
    });

    return (
        <div>
            {intChips}

            <ColourDialog
                open={nameDialogOpened}
                theme={
                    intInfos?.[chipSelected] === undefined
                        ? (([] as any) as Theme)
                        : [
                              intInfos[chipSelected][0],
                              intInfos[chipSelected][1],
                              intInfos[chipSelected][2],
                              intInfos[chipSelected][3] as MonoColour,
                          ]
                }
                lineName={
                    intInfos?.[chipSelected] === undefined
                        ? ['', '']
                        : [intInfos[chipSelected][4], intInfos[chipSelected][5]]
                }
                onUpdate={nameDialogUpdate}
                onClose={() => setNameDialogOpened(false)}
            />
        </div>
    );
};

interface OSINameDialogProps {
    open: boolean;
    stnId: string;
    osiName: Name;
    onClose: () => void;
}

const OSINameDialog = React.memo(
    (props: OSINameDialogProps) => {
        const { t } = useTranslation();
        const reduxDispatch = useDispatch();

        const { dispatch } = useContext(ParamContext);

        const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
            let newOSIName = props.osiName.map((val, i) => (i === index ? event.target.value : val)) as Name;
            dispatch({ type: 'UPDATE_STATION_OSI_NAME', stnId: props.stnId, name: newOSIName });
            reduxDispatch(updateStationOsiName(props.stnId, newOSIName));
        };

        return (
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>{t('stations.edit.interchange.osiName')}</DialogTitle>
                <DialogContent dividers>
                    <List>
                        <NameListItems onUpdate={handleUpdate} name={props.osiName} />
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary" autoFocus>
                        {t('dialog.done')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    },
    (prevProps, nextProps) =>
        prevProps.open === nextProps.open && prevProps.osiName.toString() === nextProps.osiName.toString()
);

const InterchangeMore = (props: { stnId: string }) => {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnTrans = param.stn_list[props.stnId].transfer;

    const tickDirecChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let direction = event.target.value;
        if (direction === 'l' || direction === 'r') {
            dispatch({
                type: 'UPDATE_STATION_TICK_DIREC',
                stnId: props.stnId,
                direction,
            });
            reduxDispatch(updateStationTickDirection(props.stnId, direction as ShortDirection));
        }
    };

    return React.useMemo(
        () => (
            <>
                <Divider />
                <ListItem>
                    <ListItemText>
                        <h3 style={{ margin: 0 }}>{t('stations.edit.interchange.settings')}</h3>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>format_textdirection_l_to_r</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('stations.edit.interchange.tickDirec.label')} />
                    <ListItemSecondaryAction>
                        <Select native value={stnTrans.tick_direc} onChange={tickDirecChange}>
                            {['l', 'r'].map(d => (
                                <option key={d} value={d}>
                                    {t('stations.edit.interchange.tickDirec.' + d)}
                                </option>
                            ))}
                        </Select>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>attach_money</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('stations.edit.interchange.paidArea')} />
                    <ListItemSecondaryAction>
                        <Switch
                            color="primary"
                            edge="end"
                            onChange={(_, checked) => {
                                dispatch({
                                    type: 'UPDATE_STATION_PAID_AREA',
                                    stnId: props.stnId,
                                    isPaid: checked,
                                });
                                reduxDispatch(updateStationPaidArea(props.stnId, checked));
                            }}
                            checked={stnTrans.paid_area}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, stnTrans.tick_direc, stnTrans.paid_area]
    );
};
