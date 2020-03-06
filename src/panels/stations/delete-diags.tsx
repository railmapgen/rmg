import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { StationInfo } from '../../types';

interface StationDeleteDialogProps {
    open: boolean;
    stnInfo: StationInfo;
    onClose: (action: string) => void;
}

export function StationDeleteDialog(props: StationDeleteDialogProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={props.open}>
            <DialogTitle>{t('stations.remove.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Trans i18nKey="stations.remove.msg">
                        {{ name: props.stnInfo.name.join() }}
                    </Trans>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose('close')} color="primary" autoFocus>
                    {t('dialog.cancel')}
                </Button>
                <Button onClick={() => props.onClose('accept')} color="primary">
                    {t('stations.remove.button')}
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
    const { t } = useTranslation();
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{t('stations.remove.error.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('stations.remove.error.msg')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    {t('dialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}