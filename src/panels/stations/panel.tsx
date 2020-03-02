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
    theme: [string, string, string, '#000' | '#fff'];
    stnList: {[stnId: string]: StationInfo};
    paramUpdate: (key, data) => void;
    tpo: string[];
}

interface PanelStationsState {
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

        this.state = {
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
            this.props.paramUpdate('stn_list', getParams().stn_list);
            this.setState(prevState => ({
                // stnList: {
                //     ...prevState.stnList, 
                //     [newId]: newInfo,
                // }, 
                // trigger edit dialog
                stnEditDialogOpened: true, 
                stationSelected: newId,
            }));
        }
    }
    
    stnEditDialogUpdate(value, field, index) {
        let stnId = this.state.stationSelected;
        if (field === 'name') {
            let newName = this.props.stnList[stnId].name.map((val,idx) => idx===index ? value : val) as Name;
            window.myLine.updateStnName(stnId, newName);
            this.props.paramUpdate('stn_list', {
                ...this.props.stnList,
                [stnId]: {
                    ...this.props.stnList[stnId], 
                    name: newName
                },
            })
            // this.setState(prevState => {
            //     let name = Object.values({
            //         ...prevState.stnList[stnId].name, 
            //         [index]: value
            //     }) as Name;
            //     window.myLine.updateStnName(stnId, name);

            //     return {
            //         stnList: {
            //             ...prevState.stnList, 
            //             [stnId]: {
            //                 ...prevState.stnList[stnId], 
            //                 name
            //             }
            //         }
            //     };
            // });
        }
        if (field === 'num') {
            (window.myLine as RMGLineGZ).updateStnNum(stnId, value);
            this.props.paramUpdate('stn_list', {
                ...this.props.stnList, 
                [stnId]: {
                    ...this.props.stnList[stnId], 
                    num: value,
                }
            })
            // this.setState(prevState => {
            //     (window.myLine as RMGLineGZ).updateStnNum(stnId, value);

            //     return {
            //         stnList: {
            //             ...prevState.stnList, 
            //             [stnId]: {
            //                 ...prevState.stnList[stnId], 
            //                 num: value
            //             }
            //         }
            //     };
            // });
        }
        if (field === 'transfer') {
            let updatedValue = {
                ...value, 
                info: (value as StationTransfer).info
                    .map(inf => (
                        inf.map(i => Object.values(i).length===0 ? 
                            this.props.theme.concat(['轉綫', 'Line']) : i)
                    )),
            } as StationTransfer;

            window.myLine.updateStnTransfer2(stnId, updatedValue);
            this.props.paramUpdate('stn_list', {
                ...this.props.stnList, 
                [stnId]: {
                    ...this.props.stnList[stnId], 
                    transfer: updatedValue
                }
            })
            // this.setState(prevState => {
            //     return {
            //         stnList: {
            //             ...prevState.stnList, 
            //             [stnId]: {
            //                 ...prevState.stnList[stnId], 
            //                 transfer: updatedValue
            //             }
            //         }
            //     }
            // });
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
                this.props.paramUpdate('stn_list', {
                    ...this.props.stnList, 
                    [stnId]: {
                        ...this.props.stnList[stnId], 
                        branch: value
                    }
                });
                // this.setState(prevState => {
                //     return {
                //         stnList: {
                //             ...prevState.stnList, 
                //             [stnId]: {
                //                 ...prevState.stnList[stnId], 
                //                 branch: value
                //             }
                //         }
                //     }
                // });
            } else if (index.split('.')[0] === 'first') {
                if (window.myLine.updateBranchFirst(
                    stnId, 
                    index.split('.')[1]==='left' ? 0 : 1,
                    value[index.split('.')[1]][1]
                )) this.props.paramUpdate('stn_list', getParams().stn_list);
            } else if (index.split('.')[0] === 'pos') {
                if (window.myLine.updateBranchPos(
                    stnId, 
                    index.split('.')[1]==='left' ? 0 : 1,
                    value
                )) this.props.paramUpdate('stn_list', getParams().stn_list);
            }
        }
        if (field === 'facility') {
            window.myLine.updateStnUsage(stnId, value);
            this.props.paramUpdate('stn_list', {
                ...this.props.stnList, 
                [stnId]: {
                    ...this.props.stnList[stnId], 
                    facility: value,
                }
            });
            // this.setState(prevState => {
            //     return {
            //         stnList: {
            //             ...prevState.stnList, 
            //             [stnId]: {
            //                 ...prevState.stnList[stnId], 
            //                 facility: value,
            //             }
            //         }
            //     }
            // });
        }
        if (field === 'services') {
            window.myLine.updateStnServices(stnId, value);
            let servicesSet = new Set(this.props.stnList[stnId].services);
            if (value.selected===false) {
                servicesSet.delete(value.chipId);
            } else {
                servicesSet.add(value.chipId);
            }
            this.props.paramUpdate('stn_list', {
                ...this.props.stnList, 
                [stnId]: {
                    ...this.props.stnList[stnId], 
                    services: Array.from(servicesSet)
                }
            })
            // this.setState(prevState => {
            //     return {
            //         stnList: {
            //             ...prevState.stnList, 
            //             [stnId]: {
            //                 ...prevState.stnList[stnId], 
            //                 services: Array.from(servicesSet),
            //             }
            //         }
            //     }
            // });
        }
    }

    stnDeleteClose(action: string) {
        let stnId = this.state.stationSelected;
        this.setState({stnDeleteDialogOpened: false});
        if (action === 'accept') {
            if (!window.myLine.removeStn(stnId)) {
                this.setState({stnDeleteErrDialogOpened: true});
            } else {
                this.props.paramUpdate('stn_list', getParams().stn_list);
                // this.setState({stnList: getParams().stn_list});
            }
        }
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <StationChipSet
                    stnList={this.props.stnList} tpo={this.props.tpo}
                    onSelection={this.stnChipSetSelection.bind(this)}
                    addStationClick={() => this.setState({stnAddDialogOpened: true})} />
                <Snackbar
                    open={this.state.snackBarOpened}
                    onClose={(e, r) => this.snackBarClose(r)}
                    autoHideDuration={5000}
                    message={formatStnName(this.props.stnList[this.state.stationSelected])}
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
                    stnList={this.props.stnList} tpo={this.props.tpo}
                    onClose={this.stnAddDialogClose.bind(this)} />
                <StationEditDialog
                    open={this.state.stnEditDialogOpened}
                    onClose={() => this.setState({stnEditDialogOpened: false})}
                    onUpdate={this.stnEditDialogUpdate.bind(this)}
                    stnId={this.state.stationSelected}
                    stnInfo={this.props.stnList[this.state.stationSelected] || this.props.stnList['linestart']}
                    stnList={this.props.stnList} />
                <StationDeleteDialog 
                    open={this.state.stnDeleteDialogOpened}
                    onClose={this.stnDeleteClose.bind(this)}
                    stnInfo={this.props.stnList[this.state.stationSelected] || this.props.stnList['linestart']} />
                <StationDeleteErrorDialog
                    open={this.state.stnDeleteErrDialogOpened}
                    onClose={() => this.setState({stnDeleteErrDialogOpened: false})} />
            </div>
        );
    }
}

export default withTranslation()(PanelStations);