import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Icon,
    Divider,
    Button,
    ListItemIcon,
    RadioGroup,
    FormControlLabel,
    Radio,
    Switch,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    makeStyles,
    createStyles,
} from '@material-ui/core';
import { ParamContext } from '../../../context';
import ColourDialog from '../../colour-diag';
import NameListItems from './name-list-items';

interface StationEditInterchangeTabProps {
    stnTrans: StationTransfer;
    stnId: string;
    onUpdate: (trans: StationTransfer) => void;
}

const StationEditInterchangeTab = (props: StationEditInterchangeTabProps) => {
    const { t } = useTranslation();

    // const { param, dispatch } = React.useContext(ParamContext);

    const [osiNameDialogOpened, setOsiNameDialogOpened] = React.useState(false);

    const addClick = (index: number) => {
        let ns = props.stnTrans.info.map(inf => inf.length);
        if (ns.length === 1) {
            ns[1] = 0;
        }
        ns[index] += 1;
        let changeType: string;
        if (ns[0] === 3 && ns[1] === 0) {
            changeType = 'int3'; // was int4
        } else if (ns[0] === 2 && ns[1] === 1) {
            changeType = 'osi31';
        } else if (ns[0] === 2 && ns[1] === 0) {
            changeType = 'int3';
        } else if (ns[0] === 1 && ns[1] === 2) {
            changeType = 'osi22';
        } else if (ns[0] === 1 && ns[1] === 1) {
            changeType = 'osi21';
        } else if (ns[0] === 1 && ns[1] === 0) {
            changeType = 'int2';
        } else if (ns[0] === 0 && ns[1] === 3) {
            changeType = 'osi13';
        } else if (ns[0] === 0 && ns[1] === 2) {
            changeType = 'osi12';
        } else if (ns[0] === 0 && ns[1] === 1) {
            changeType = 'osi11';
        } else if (ns[0] === 0 && ns[1] === 0) {
            changeType = 'none';
        } else {
            // sum(ns) > 3
            changeType = 'int3';
        }
        console.log(changeType);
        if (props.stnTrans.info.length === 1 && index === 1) {
            let transInfo = {
                ...props.stnTrans,
                type: changeType as any,
                osi_names: changeType.includes('osi') ? [props.stnTrans.osi_names[0] || ['車站名', 'Stn Name']] : [],
                info: props.stnTrans.info.concat([[Array(6) as InterchangeInfo]]),
            };
            // dispatch({ type: 'UPDATE_STATION_TRANSFER', stnId: props.stnId, transfer: transInfo });
            console.log(transInfo);
            props.onUpdate(transInfo);
        } else {
            let transInfo = {
                ...props.stnTrans,
                type: changeType as any,
                osi_names: changeType.includes('osi') ? [props.stnTrans.osi_names[0] || ['車站名', 'Stn Name']] : [],
                info: props.stnTrans.info.map((inf, idx) =>
                    idx === index ? inf.concat([Array(6) as InterchangeInfo]) : inf
                ),
            };
            // dispatch({ type: 'UPDATE_STATION_TRANSFER', stnId: props.stnId, transfer: transInfo });
            console.log(transInfo);
            props.onUpdate(transInfo);
        }
    };

    const deleteClick = (index: number, i: number) => {
        let ns = props.stnTrans.info.map(inf => inf.length);
        if (ns.length === 1) {
            ns[1] = 0;
        }
        ns[index] -= 1;
        let changeType: string;
        if (ns[0] === 3 && ns[1] === 0) {
            changeType = 'int3'; // was int4
        } else if (ns[0] === 2 && ns[1] === 1) {
            changeType = 'osi31';
        } else if (ns[0] === 2 && ns[1] === 0) {
            changeType = 'int3';
        } else if (ns[0] === 1 && ns[1] === 2) {
            changeType = 'osi22';
        } else if (ns[0] === 1 && ns[1] === 1) {
            changeType = 'osi21';
        } else if (ns[0] === 1 && ns[1] === 0) {
            changeType = 'int2';
        } else if (ns[0] === 0 && ns[1] === 3) {
            changeType = 'osi13';
        } else if (ns[0] === 0 && ns[1] === 2) {
            changeType = 'osi12';
        } else if (ns[0] === 0 && ns[1] === 1) {
            changeType = 'osi11';
        } else if (ns[0] === 0 && ns[1] === 0) {
            changeType = 'none';
        } else {
            // sum(ns) > 3
            changeType = 'int3';
        }
        console.log(changeType);

        let transInfo = {
            ...props.stnTrans,
            type: changeType as any,
            osi_names: changeType.includes('osi') ? [props.stnTrans.osi_names[0] || ['車站名', 'Stn Name']] : [],
            info: props.stnTrans.info.map((inf, idx) =>
                idx === index ? inf.slice(0, i).concat(inf.slice(i + 1)) : inf
            ),
        };
        console.log(transInfo);
        props.onUpdate(transInfo);
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
            {['mtr', 'shmetro'].includes(window.urlParams.get('style') || '') && (
                <>
                    <Divider />
                    <ListItem>
                        <ListItemText>
                            <h3 style={{ margin: 0 }}>{t('stations.edit.interchange.osi')}</h3>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{ lineHeight: '1rem', whiteSpace: 'pre', marginRight: 5 }}
                                onClick={() => setOsiNameDialogOpened(true)}
                            >
                                {props.stnTrans.osi_names[0]
                                    ? props.stnTrans.osi_names[0].join('\r\n')
                                    : '車站名\r\nStn Name'}
                            </Button>
                            <OSINameDialog
                                open={osiNameDialogOpened}
                                osiName={props.stnTrans.osi_names[0] || ['', '']}
                                stnId={props.stnId}
                                onClose={() => setOsiNameDialogOpened(false)}
                            />
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
            {window.urlParams.get('style') === 'mtr' && <InterchangeMore stnId={props.stnId} />}
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
            dispatch({
                type: 'UPDATE_STATION_INTERCHANGE_INFO',
                stnId: props.stnId,
                setIdx: props.setIndex,
                intIdx: chipSelected,
                info: (value as string[]).concat(Array(2)) as InterchangeInfo,
            });
        }
        if (key === 'name') {
            dispatch({
                type: 'UPDATE_STATION_INTERCHANGE_INFO',
                stnId: props.stnId,
                setIdx: props.setIndex,
                intIdx: chipSelected,
                info: Array(4).concat(value) as InterchangeInfo,
            });
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
                    chipSelected === -1
                        ? (([] as any) as [string, string, string, '#000' | '#fff'])
                        : [
                              intInfos[chipSelected][0],
                              intInfos[chipSelected][1],
                              intInfos[chipSelected][2],
                              intInfos[chipSelected][3] as '#fff' | '#000',
                          ]
                }
                lineName={
                    chipSelected === -1 ? (([] as any) as Name) : [intInfos[chipSelected][4], intInfos[chipSelected][5]]
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

        const { dispatch } = React.useContext(ParamContext);

        const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
            let newOSIName = props.osiName.map((val, i) => (i === index ? event.target.value : val)) as Name;
            dispatch({ type: 'UPDATE_STATION_OSI_NAME', stnId: props.stnId, name: newOSIName });
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
    (prevProps, nextProps) => {
        if (prevProps.open !== nextProps.open) {
            return false;
        } else {
            return prevProps.osiName.toString() === nextProps.osiName.toString();
        }
    }
);

const InterchangeMore = (props: { stnId: string }) => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnTrans = param.stn_list[props.stnId].transfer;

    const tickDirecChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        if (value === 'l' || value === 'r')
            dispatch({
                type: 'UPDATE_STATION_TICK_DIREC',
                stnId: props.stnId,
                direction: value,
            });
    };

    const paidAreaChange = (_event: React.ChangeEvent<{}>, checked: boolean) =>
        dispatch({
            type: 'UPDATE_STATION_PAID_AREA',
            stnId: props.stnId,
            isPaid: checked,
        });

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
                    <ListItemText
                        primary={t('stations.edit.interchange.tickDirec.label')}
                        secondary={
                            <RadioGroup name="tick_direc" row value={stnTrans.tick_direc} onChange={tickDirecChange}>
                                <FormControlLabel
                                    value="l"
                                    control={<Radio color="secondary" />}
                                    label={t('stations.edit.interchange.tickDirec.l')}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="r"
                                    control={<Radio color="secondary" />}
                                    label={t('stations.edit.interchange.tickDirec.r')}
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        }
                        secondaryTypographyProps={{ ['component' as any]: 'div' }}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>attach_money</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('stations.edit.interchange.paidArea')} />
                    <ListItemSecondaryAction>
                        <Switch edge="end" onChange={paidAreaChange} checked={stnTrans.paid_area} />
                    </ListItemSecondaryAction>
                </ListItem>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, stnTrans.tick_direc, stnTrans.paid_area]
    );
};
