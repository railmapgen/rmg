import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RMGLineGZ } from '../../Line/LineGZ';
import { getParams } from '../../utils';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

interface Props {
    open: boolean;
    onClose: () => void;
    paramUpdate: (key, data) => void;
}

const AutoNumDialog = React.memo((props: Props) => {
    const { t } = useTranslation();

    const handleClick = (action: 'ascend' | 'descend') => {
        let branch0 = window.myLine.branches[0];
        branch0.forEach((stnId, i) => {
            let num: string;
            if (action === 'ascend') {
                num = (i+1).toString().padStart(2, '0');
            } else {
                num = (branch0.length-i).toString().padStart(2, '0');
            }
            (window.myLine as RMGLineGZ).updateStnNum(stnId, num);
        });
        props.paramUpdate('stn_list', getParams().stn_list);
        props.onClose();
    }

    return (
        <Dialog onClose={props.onClose} open={props.open}>
            <DialogTitle>{t('design.autoNum.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('design.autoNum.msg')}
                </DialogContentText>
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
    );
}, (prevProps, nextProps) => prevProps.open === nextProps.open);

export default AutoNumDialog;