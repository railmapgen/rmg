import React, { useState } from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import StationList from './station-list';
import StationAddDialog from './add-diag';
import StationEditDialog from './edit-diag';
import StationDeleteDialog from './delete-diags';
import StationFabs from './fabs';
import AutoNumDialog from './auto-num-diag';
import { useAppDispatch, useAppSelector } from '../../redux';
import { RmgStyle } from '../../constants/constants';
import { reverseStations } from '../../redux/param/action';

const useStyles = makeStyles(() =>
    createStyles({
        gridContainer: {
            height: '100%',
            overflow: 'hidden',
        },
        gridItem: {
            height: '100%',
            overflow: 'auto',
        },
    })
);

const PanelStations2 = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.app.rmgStyle);

    const [stnSelected, setStnSelected] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isAutoNumDialogOpen, setIsAutoNumDialogOpen] = useState(false);

    const [stnToRemove, setStnToRemove] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleAction = (stnId: string) => (action: 'edit' | 'remove') => {
        if (action === 'edit') {
            setStnSelected(stnId);
            setIsOpen(true);
        }
        if (action === 'remove') {
            if (stnSelected === stnId) setStnSelected('');
            setStnToRemove(stnId);
            setIsDeleteDialogOpen(true);
        }
    };

    const fabsAction = (action: string) => {
        if (action === 'add') {
            setIsAddDialogOpen(true);
        }
        if (action === 'reverse') {
            dispatch(reverseStations());
        }
        if (action === 'autonum') {
            setIsAutoNumDialogOpen(true);
        }
    };

    const stnAddDialogClose = (action: 'close' | string) => {
        setIsAddDialogOpen(false);
        if (action !== 'close') {
            setStnSelected(action);
            setIsOpen(true);
        }
    };

    return (
        <>
            <Grid container spacing={1} className={classes.gridContainer}>
                <Grid item xs={12} md={4} className={classes.gridItem}>
                    <StationList selectedId={stnSelected} onAction={handleAction} />
                </Grid>
                <Grid item xs={8} className={classes.gridItem}>
                    {stnSelected && (
                        <StationEditDialog open={isOpen} stnId={stnSelected} onClose={() => setIsOpen(false)} />
                    )}
                </Grid>
            </Grid>

            <StationFabs onAction={fabsAction} />

            <StationAddDialog open={isAddDialogOpen} onClose={stnAddDialogClose} />
            <StationDeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                stnId={stnToRemove}
            />
            {rmgStyle === RmgStyle.GZMTR && (
                <AutoNumDialog open={isAutoNumDialogOpen} onClose={() => setIsAutoNumDialogOpen(false)} />
            )}
        </>
    );
};

export default PanelStations2;
