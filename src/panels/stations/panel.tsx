import * as React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import { Snackbar, Button, IconButton, Icon } from '@material-ui/core';

import { getParams, formatStnName } from '../../utils';
import { StationInfo, InterchangeInfo, StationTransfer, Name } from '../../types';
import { RMGLineGZ } from '../../Line/LineGZ';

import StationAddDialog from './add-diag';
import StationEditDialog from './edit-diag';
import StationChipSet from './chip-set';
import { StationDeleteDialog, StationDeleteErrorDialog } from './delete-diags';

interface PanelStationsProps {
    t: any;
}

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

class PanelStations extends React.Component<PanelStationsProps, PanelStationsState> {
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
                    message={formatStnName(this.state.stnList[this.state.stationSelected])}
                    action={
                        <React.Fragment>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('current')}>
                                {this.props.t('stations.current')}
                            </Button>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('edit')}>
                                {this.props.t('stations.edit.button')}
                            </Button>
                            <Button color="secondary" size="small" onClick={() => this.snackBarClose('delete')}>
                                {this.props.t('stations.remove.button')}
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

export default withTranslation()(PanelStations);