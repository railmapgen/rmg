import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { StationInfo } from '../../types';

interface StationDeleteDialogProps {
    open: boolean;
    stnInfo: StationInfo;
    onClose: (action: string) => void;
}

export function StationDeleteDialog(props: StationDeleteDialogProps) {
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

export function StationDeleteErrorDialog(props: StationDeleteErrorDialogProps) {
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