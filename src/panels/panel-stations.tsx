import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Snackbar, Button, IconButton, Icon, Chip, Avatar, Dialog, DialogTitle, DialogContent, Tabs, Tab, Typography, DialogActions, List, ListItem, ListItemIcon, TextField, withStyles, CircularProgress, DialogContentText, Backdrop, MenuItem } from '@material-ui/core';

import { getParams } from '../utils';
import { StationInfo, InterchangeInfo, StationTransfer, Name } from '../types';
import { RMGLineGZ } from '../Line/LineGZ';

import StationEditDialog from './panel-stations-edit-diag';
import StationChipSet from './panel-stations-chipset';

interface PanelStationsState {
    theme: string[];
    stnList: {
        [stnId: string]: StationInfo;
    };
    stationSelected: string;
    snackBarOpened: boolean;
    stnAddDialogOpened: boolean;
    stnEditDialogOpened: boolean;
    stnDeleteDialogOpened: boolean;
    stnDeleteErrDialogOpened: boolean;
}

export default class PanelStations extends React.Component<{}, PanelStationsState> {
    constructor(props) {
        super(props);

        let param = getParams();
        this.state = {
            theme: param.theme,
            stnList: param.stn_list,
            stationSelected: '', 
            snackBarOpened: false,
            stnAddDialogOpened: false,
            stnEditDialogOpened: false,
            stnDeleteDialogOpened: false,
            stnDeleteErrDialogOpened: false,
        }
    }

    stnChipSetSelection(stnId: string) {
        console.log(stnId);
        this.setState({
            snackBarOpened: true, 
            stationSelected: stnId,
        });
    }

    snackBarClose(action: string) {
        if (action === 'clickaway') return;
        this.setState({snackBarOpened: false});
        if (action === 'current') {
            window.myLine.currentStnId = this.state.stationSelected;
        } else if (action === 'edit') {
            this.setState({stnEditDialogOpened: true});
        } else if (action === 'delete') {
            this.setState({stnDeleteDialogOpened: true});
        }
    }

    stnAddDialogClose(action: 'close' | string[]) {
        this.setState({stnAddDialogOpened: false});
        if (typeof action === 'object') {
            let [newId, newInfo] = window.myLine.addStn(action[0] as 'before' | 'after', action[1], action[2], action[3]);
            this.setState(prevState => ({
                stnList: {
                    ...prevState.stnList, 
                    [newId]: newInfo,
                }
            }));
        }
    }
    
    stnEditDialogUpdate(value, field, index) {
        let stnId = this.state.stationSelected;
        if (field === 'name') {
            this.setState(prevState => {
                let name = Object.values({
                    ...prevState.stnList[stnId].name, 
                    [index]: value
                }) as Name;
                window.myLine.updateStnName(stnId, name);

                return {
                    stnList: {
                        ...prevState.stnList, 
                        [stnId]: {
                            ...prevState.stnList[stnId], 
                            name
                        }
                    }
                };
            });
        }
        if (field === 'num') {
            this.setState(prevState => {
                (window.myLine as RMGLineGZ).updateStnNum(stnId, value);

                return {
                    stnList: {
                        ...prevState.stnList, 
                        [stnId]: {
                            ...prevState.stnList[stnId], 
                            num: value
                        }
                    }
                };
            });
        }
        if (field === 'transfer') {
            let updatedValue = {
                ...value, 
                info: (value as StationTransfer).info
                    .map(inf => (
                        inf.map(i => Object.values(i).length===0 ? 
                            this.state.theme.concat(['轉綫', 'Line']) : i)
                    )),
            } as StationTransfer;

            window.myLine.updateStnTransfer2(stnId, updatedValue);

            this.setState(prevState => {
                return {
                    stnList: {
                        ...prevState.stnList, 
                        [stnId]: {
                            ...prevState.stnList[stnId], 
                            transfer: updatedValue
                        }
                    }
                }
            });
        }
        if (field === 'branch') {
            // TODO: use this when svg is created by react 
            // window.myLine.updateBranch(stnId, value);
            if (index.split('.')[0] === 'type') {
                window.myLine.updateBranchType(
                    stnId, 
                    index.split('.')[1]==='left' ? 0 : 1,
                    value[index.split('.')[1]][0]
                );
                this.setState(prevState => {
                    return {
                        stnList: {
                            ...prevState.stnList, 
                            [stnId]: {
                                ...prevState.stnList[stnId], 
                                branch: value
                            }
                        }
                    }
                });
            } else if (index.split('.')[0] === 'first') {
                if (window.myLine.updateBranchFirst(
                    stnId, 
                    index.split('.')[1]==='left' ? 0 : 1,
                    value[index.split('.')[1]][1]
                )) this.setState({stnList: getParams().stn_list});
            } else if (index.split('.')[0] === 'pos') {
                if (window.myLine.updateBranchPos(
                    stnId, 
                    index.split('.')[1]==='left' ? 0 : 1,
                    value
                )) this.setState({stnList: getParams().stn_list});
            }
        }
        if (field === 'facility') {
            window.myLine.updateStnUsage(stnId, value);
            this.setState(prevState => {
                return {
                    stnList: {
                        ...prevState.stnList, 
                        [stnId]: {
                            ...prevState.stnList[stnId], 
                            facility: value,
                        }
                    }
                }
            });
        }
        if (field === 'services') {
            window.myLine.updateStnServices(stnId, value);
            let servicesSet = new Set(this.state.stnList[stnId].services);
            if (value.selected===false) {
                servicesSet.delete(value.chipId);
            } else {
                servicesSet.add(value.chipId);
            }
            this.setState(prevState => {
                return {
                    stnList: {
                        ...prevState.stnList, 
                        [stnId]: {
                            ...prevState.stnList[stnId], 
                            services: Array.from(servicesSet),
                        }
                    }
                }
            });
        }
    }

    stnDeleteClose(action: string) {
        let stnId = this.state.stationSelected;
        this.setState({stnDeleteDialogOpened: false});
        if (action === 'accept') {
            if (!window.myLine.removeStn(stnId)) {
                this.setState({stnDeleteErrDialogOpened: true});
            } else {
                this.setState({stnList: getParams().stn_list});
            }
        }
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <StationChipSet
                    stnList={this.state.stnList}
                    onSelection={this.stnChipSetSelection.bind(this)}
                    addStationClick={() => this.setState({stnAddDialogOpened: true})} />
                <Snackbar
                    open={this.state.snackBarOpened}
                    onClose={(e, r) => this.snackBarClose(r)}
                    autoHideDuration={5000}
                    message={`${
                        window.urlParams.get('style')==='gzmtr' ? this.state.stnList[this.state.stationSelected]?.num + ': ' : ''
                    }${this.state.stnList[this.state.stationSelected]?.name.join()}`}
                    action={
                        <React.Fragment>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('current')}>
                                Set As Current
                            </Button>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('edit')}>
                                Edit
                            </Button>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('delete')}>
                                Remove
                            </Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.snackBarClose('close')}>
                                <Icon fontSize="small">close</Icon>
                            </IconButton>
                        </React.Fragment>
                    }
                />

                <StationAddDialog
                    open={this.state.stnAddDialogOpened}
                    stnList={this.state.stnList}
                    onClose={this.stnAddDialogClose.bind(this)} />
                <StationEditDialog
                    open={this.state.stnEditDialogOpened}
                    onClose={() => this.setState({stnEditDialogOpened: false})}
                    onUpdate={this.stnEditDialogUpdate.bind(this)}
                    stnId={this.state.stationSelected}
                    stnInfo={this.state.stnList[this.state.stationSelected] || this.state.stnList['linestart']}
                    stnList={this.state.stnList} />
                <StationDeleteDialog 
                    open={this.state.stnDeleteDialogOpened}
                    onClose={this.stnDeleteClose.bind(this)}
                    stnInfo={this.state.stnList[this.state.stationSelected] || this.state.stnList['linestart']} />
                <StationDeleteErrorDialog
                    open={this.state.stnDeleteErrDialogOpened}
                    onClose={() => this.setState({stnDeleteErrDialogOpened: false})} />
            </div>
        );
    }
}

interface StationAddDialogProps {
    open: boolean;
    stnList: {
        [stnId: string]: StationInfo;
    };
    onClose: (action: 'close' | string[]) => void;
}

function StationAddDialog(props: StationAddDialogProps) {
    const {t, i18n} = useTranslation();

    const allLocs = {
        centre: t('stations.add.centre'), 
        upper: t('stations.add.upper'), 
        lower: t('stations.add.lower'), 
        newupper: t('stations.add.newUpper'), 
        newlower: t('stations.add.newLower'), 
    };
    
    const [prep, setPrep] = React.useState('before');
    const [pivot, setPivot] = React.useState(
        Object.keys(props.stnList).filter(stnId => !['linestart','lineend'].includes(stnId))[0]
    );
    const [loc, setLoc] = React.useState(Object.keys(allLocs)[0]);
    const [locOK, setLocOK] = React.useState(Array(5).fill(true) as boolean[]);

    const [end, setEnd] = React.useState('');
    const [endList, setEndList] = React.useState([] as string[]);

    // Hook for updating loc list and end lists when pivot changed
    React.useEffect(() => {
        let possibleLocs = window.myLine.newStnPossibleLoc(
            prep as 'before' | 'after', 
            pivot
        );
        console.log(possibleLocs);
        setLocOK(possibleLocs.map(p => typeof p === 'number' ? Boolean(p) : Boolean(p.length)));
        setEndList(possibleLocs[3]);
    }, [pivot]);

    // Hook for updating loc selection (first available) when locOK list changed
    React.useEffect(() => {
        setLoc(Object.keys(allLocs)[locOK.indexOf(true)]);
    }, [locOK]);

    // Hook for updating end selection when end list changed
    React.useEffect(() => {
        if (endList.length === 0) return;
        setEnd(endList[0]);
    }, [endList]);

    const handleClick = (action: string) => {
        if (action === 'close') {
            props.onClose('close');
        } else {
            props.onClose([
                prep, pivot, loc, end
            ]);
        }
    }

    return (
        <Dialog open={props.open} onClose={() => handleClick('close')}>
            <DialogTitle>{t('stations.add.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>control_camera</Icon> 
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.prep')}
                            onChange={(e) => setPrep(e.target.value)}
                            value={prep} >
                            <MenuItem key="before" value="before">{t('stations.add.before')}</MenuItem>
                            <MenuItem key="after" value="after">{t('stations.add.after')}</MenuItem>
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>near_me</Icon> 
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.pivot')}
                            onChange={(e) => setPivot(e.target.value)}
                            value={pivot} >
                            {window.myLine.tpo.map(stnId => (
                                <MenuItem key={stnId} value={stnId}>
                                    {`${window.urlParams.get('style')==='gzmtr' ? 
                                        props.stnList[stnId]?.num + ': ' : ''
                                        }${props.stnList[stnId]?.name.join()}`
                                    }
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>share</Icon> 
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.loc')}
                            onChange={(e) => setLoc(e.target.value)}
                            value={loc} >
                            {Object.keys(allLocs).map((key, idx) => (
                                <MenuItem key={key} value={key} disabled={!locOK[idx]}>{allLocs[key]}</MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem style={{display: ['newupper','newlower'].includes(loc) ? 'flex' : 'none'}}>
                        <ListItemIcon>
                            <Icon>undo</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.end')}
                            onChange={(e) => setEnd(e.target.value)}
                            value={end} >
                            {endList.map(stnId => (
                                <MenuItem key={stnId} value={stnId}>{props.stnList[stnId].name.join()}</MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClick('close')} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={() => handleClick('accept')} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface StationDeleteDialogProps {
    open: boolean;
    stnInfo: StationInfo;
    onClose: (action: string) => void;
}

function StationDeleteDialog(props: StationDeleteDialogProps) {
    return (
        <Dialog open={props.open}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure to delete station {props.stnInfo.name.join()} ? You can't undo this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose('close')} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={() => props.onClose('accept')} color="primary" autoFocus>
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    )
}

interface StationDeleteErrorDialogProps {
    open: boolean;
    onClose: () => void;
}

function StationDeleteErrorDialog(props: StationDeleteErrorDialogProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Deletion Error</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You are not allowed to delete this station!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}