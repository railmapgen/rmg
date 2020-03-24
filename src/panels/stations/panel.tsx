import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Snackbar, Button, IconButton, Icon } from '@material-ui/core';

import { formatStnName } from '../../utils';

import StationAddDialog from './add-diag';
import StationEditDialog from './edit-diag';
import StationChipSet from './chip-set';
import { StationDeleteDialog, StationDeleteErrorDialog } from './delete-diags';
import AutoNumDialog from './auto-num-diag';
import StationFabs from './fabs';
import { removeStation, reverseStations } from './utils';
import { CanvasContext } from '../../context';

interface PanelStationsProps {
    theme: [string, string, string, '#000' | '#fff'];
    stnList: { [stnId: string]: StationInfo };
    paramUpdate: (key: string, data: any) => void;
    currentId: string;
}

const PanelStations = (props: PanelStationsProps) => {
    const { t } = useTranslation();

    const { rmgStyle } = useContext(CanvasContext);

    const [stationSelected, setStationSelected] = useState('');
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleteErrDialogOpen, setIsDeleteErrDialogOpen] = useState(false);
    const [isAutoNumDialogOpen, setIsAutoNumDialogOpen] = useState(false);

    const stnChipSetSelection = (stnId: string) => () => {
        setStationSelected(stnId);
        setIsSnackBarOpen(true);
    };

    const snackBarClose = (action: string) => {
        if (action === 'clickaway') return;
        setIsSnackBarOpen(false);
        if (action === 'current') {
            props.paramUpdate('current_stn_idx', stationSelected);
        } else if (action === 'edit') {
            setIsEditDialogOpen(true);
        } else if (action === 'delete') {
            setIsDeleteDialogOpen(true);
        }
    };

    const stnAddDialogClose = (action: 'close' | string) => {
        if (action === 'close') {
            setIsAddDialogOpen(false);
        } else {
            setIsAddDialogOpen(false);
            setStationSelected(action);
            setIsEditDialogOpen(true);
        }
    };

    const stnEditDialogUpdate = (value: any, field: string, index?: number) => {
        let stnId = stationSelected;
        if (field === 'facility') {
            props.paramUpdate('stn_list', {
                ...props.stnList,
                [stnId]: {
                    ...props.stnList[stnId],
                    facility: value,
                },
            });
        }
        if (field === 'services') {
            // window.myLine.updateStnServices(stnId, value);
            let servicesSet = new Set(props.stnList[stnId].services);
            if (value.selected === false) {
                servicesSet.delete(value.chipId);
            } else {
                servicesSet.add(value.chipId);
            }
            props.paramUpdate('stn_list', {
                ...props.stnList,
                [stnId]: {
                    ...props.stnList[stnId],
                    services: [...servicesSet],
                },
            });
        }
    };

    const stnDeleteClose = (action: string) => {
        let stnId = stationSelected;
        setIsDeleteDialogOpen(false);
        if (action === 'accept') {
            let res = removeStation(stnId, props.stnList);
            if (res === false) {
                setIsDeleteErrDialogOpen(true);
            } else {
                if (props.currentId === stnId) {
                    let newCurrentId = Object.keys(res).filter(id => !['linestart', 'lineend'].includes(id))[0];
                    props.paramUpdate('current_stn_idx', newCurrentId);
                }
                props.paramUpdate('stn_list', res);
            }
        }
    };

    const fabsAction = (action: string) => {
        if (action === 'add') {
            setIsAddDialogOpen(true);
        }
        if (action === 'reverse') {
            let newStnList = reverseStations(props.stnList);
            props.paramUpdate('stn_list', newStnList);
            // console.log(newStnList);
            // setParams('stn_list', newStnList);
            // location.reload(true);
        }
        if (action === 'autonum') {
            setIsAutoNumDialogOpen(true);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <StationChipSet
                stnList={props.stnList}
                onSelection={stnChipSetSelection}
                addStationClick={() => setIsAddDialogOpen(true)}
            />
            <Snackbar
                open={isSnackBarOpen}
                onClose={(e, r) => snackBarClose(r)}
                autoHideDuration={5000}
                message={formatStnName(props.stnList[stationSelected], rmgStyle)}
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" onClick={() => snackBarClose('current')}>
                            {t('stations.current')}
                        </Button>
                        <Button color="secondary" size="small" onClick={() => snackBarClose('edit')}>
                            {t('stations.edit.button')}
                        </Button>
                        <Button color="secondary" size="small" onClick={() => snackBarClose('delete')}>
                            {t('stations.remove.button')}
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => snackBarClose('close')}
                        >
                            <Icon fontSize="small">close</Icon>
                        </IconButton>
                    </React.Fragment>
                }
            />

            <StationFabs onAction={fabsAction} />

            <StationAddDialog
                open={isAddDialogOpen}
                stnList={props.stnList}
                onClose={stnAddDialogClose}
                paramUpdate={props.paramUpdate}
            />
            <StationEditDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onUpdate={stnEditDialogUpdate}
                stnId={stationSelected}
            />
            <StationDeleteDialog
                open={isDeleteDialogOpen}
                onClose={stnDeleteClose}
                stnInfo={props.stnList[stationSelected] || props.stnList['linestart']}
            />
            <StationDeleteErrorDialog open={isDeleteErrDialogOpen} onClose={() => setIsDeleteErrDialogOpen(false)} />
            {rmgStyle === 'gzmtr' && (
                <AutoNumDialog open={isAutoNumDialogOpen} onClose={() => setIsAutoNumDialogOpen(false)} />
            )}
        </div>
    );
};

export default PanelStations;
