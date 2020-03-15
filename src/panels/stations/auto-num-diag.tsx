import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { ParamContext } from '../../context';

interface Props {
    open: boolean;
    onClose: () => void;
}

const AutoNumDialog = (props: Props) => {
    const { t } = useTranslation();

    const { dispatch, branches } = React.useContext(ParamContext);

    const handleClick = (action: 'ascend' | 'descend') => {
        let branch0 = branches[0];
        branch0.forEach((stnId, i) => {
            let num: string;
            if (action === 'ascend') {
                num = i.toString().padStart(2, '0');
            } else {
                num = (branch0.length - 1 - i).toString().padStart(2, '0');
            }
            dispatch({ type: 'UPDATE_STATION_NUM', stnId, num });
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
        [props.open]
    );
};

export default AutoNumDialog;
