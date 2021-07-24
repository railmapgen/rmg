import React, { useContext, useState, memo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { ParamContext } from '../../context';
import { removeStation } from './utils';
import { useDispatch } from 'react-redux';
import { setCurrentStation, setStationsBulk } from "../../redux/param/action";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function StationDeleteDialog(props: Props & { stnId: string }) {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();

    const { param, dispatch } = useContext(ParamContext);
    const stnList = param.stn_list;

    const [isError, setIsError] = useState(false);

    const handleClick = (action: 'close' | 'accept') => () => {
        if (action === 'accept') {
            let res = removeStation(props.stnId, stnList);
            if (res === false) {
                setIsError(true);
            } else {
                if (param.current_stn_idx === props.stnId) {
                    let newCurrentId = Object.keys(res).filter(id => !['linestart', 'lineend'].includes(id))[0];
                    dispatch({ type: 'SET_CURRENT_STATION', stnId: newCurrentId });
                    reduxDispatch(setCurrentStation(newCurrentId));
                }
                dispatch({ type: 'UPDATE_STATION_LIST', stnList: res });
                reduxDispatch(setStationsBulk(res));
            }
        }
        props.onClose();
    };
    return (
        <>
            <Dialog open={props.open} onClose={handleClick('close')}>
                <DialogTitle>{t('stations.remove.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Trans i18nKey="stations.remove.msg">{{ name: stnList[props.stnId]?.name.join() }}</Trans>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClick('close')} color="primary" autoFocus>
                        {t('dialog.cancel')}
                    </Button>
                    <Button onClick={handleClick('accept')} color="primary">
                        {t('stations.remove.button')}
                    </Button>
                </DialogActions>
            </Dialog>
            <ErrorDialog open={isError} onClose={() => setIsError(false)} />
        </>
    );
}

const ErrorDialog = memo(
    (props: Props) => {
        const { t } = useTranslation();
        return (
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>{t('stations.remove.error.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('stations.remove.error.msg')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary" autoFocus>
                        {t('dialog.ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    },
    (prevProps, nextProps) => prevProps.open === nextProps.open
);
