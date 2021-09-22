import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { updateStationNum } from '../../redux/param/action';
import { useAppDispatch, useAppSelector } from '../../redux';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AutoNumDialog = (props: Props) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { branches } = useAppSelector(store => store.helper);

    const handleClick = (action: 'ascend' | 'descend') => {
        let branch0 = branches[0];
        branch0.forEach((stnId, i) => {
            let num: string;
            if (action === 'ascend') {
                num = i.toString().padStart(2, '0');
            } else {
                num = (branch0.length - 1 - i).toString().padStart(2, '0');
            }
            dispatch(updateStationNum(stnId, num));
            // (window.myLine as RMGLineGZ).updateStnNum(stnId, num);
        });
        // props.paramUpdate('stn_list', getParams().stn_list);
        props.onClose();
    };

    return React.useMemo(
        () => (
            <Dialog onClose={props.onClose} open={props.open}>
                <DialogTitle>{t('design.autoNum.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('design.autoNum.msg')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary" autoFocus>
                        {t('dialog.cancel')}
                    </Button>
                    <Button onClick={() => handleClick('ascend')} color="primary">
                        {t('design.autoNum.ascend')}
                    </Button>
                    <Button onClick={() => handleClick('descend')} color="primary">
                        {t('design.autoNum.descend')}
                    </Button>
                </DialogActions>
            </Dialog>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.open]
    );
};

export default AutoNumDialog;
