import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Snackbar, Button, IconButton, Icon } from '@material-ui/core';

import { formatStnName } from '../../utils';

import StationAddDialog from './add-diag';
import StationEditDialog from './edit-diag';
import StationChipSet from './chip-set';
import StationDeleteDialog from './delete-diags';
import AutoNumDialog from './auto-num-diag';
import StationFabs from './fabs';
import { CanvasContext, ParamContext } from '../../context';

const PanelStations = () => {
    const { t } = useTranslation();

    const { rmgStyle } = useContext(CanvasContext);
    const { param, dispatch } = useContext(ParamContext);
    const stnList = param.stn_list;

    const [stationSelected, setStationSelected] = useState('');
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAutoNumDialogOpen, setIsAutoNumDialogOpen] = useState(false);

    const stnChipSetSelection = (stnId: string) => () => {
        setStationSelected(stnId);
        setIsSnackBarOpen(true);
    };

    const snackBarClose = (action: string) => {
        if (action === 'clickaway') return;
        setIsSnackBarOpen(false);
        if (action === 'current') {
            dispatch({ type: 'SET_CURRENT_STATION', stnId: stationSelected });
        } else if (action === 'edit') {
            setIsEditDialogOpen(true);
        } else if (action === 'delete') {
            setIsDeleteDialogOpen(true);
        }
    };

    const stnAddDialogClose = (action: 'close' | string) => {
        setIsAddDialogOpen(false);
        if (action !== 'close') {
            setStationSelected(action);
            setIsEditDialogOpen(true);
        }
    };

    const fabsAction = (action: string) => {
        if (action === 'add') {
            setIsAddDialogOpen(true);
        }
        if (action === 'reverse') {
            dispatch({ type: 'REVERSE_STATIONS' });
        }
        if (action === 'autonum') {
            setIsAutoNumDialogOpen(true);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <StationChipSet
                stnList={stnList}
                onSelection={stnChipSetSelection}
                addStationClick={() => setIsAddDialogOpen(true)}
            />
            <Snackbar
                open={isSnackBarOpen}
                onClose={(e, r) => snackBarClose(r)}
                autoHideDuration={5000}
                message={formatStnName(stnList[stationSelected], rmgStyle)}
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

            <StationAddDialog open={isAddDialogOpen} onClose={stnAddDialogClose} />
            <StationEditDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                stnId={stationSelected}
            />
            <StationDeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                stnId={stationSelected}
            />

            {rmgStyle === 'gzmtr' && (
                <AutoNumDialog open={isAutoNumDialogOpen} onClose={() => setIsAutoNumDialogOpen(false)} />
            )}
        </div>
    );
};

export default PanelStations;
