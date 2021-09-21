import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';

import PreviewDialog from './preview-diag';
import { useAppSelector } from '../../../redux';
import { AllCanvas, canvasConfig } from '../../../constants/constants';

interface Props {
    onClose: (action: string) => void;
    open: boolean;
}

export default function ExportDialog(props: Props) {
    const { t } = useTranslation();

    const rmgStyle = useAppSelector(store => store.app.rmgStyle);
    const canvasToShow = useAppSelector(store => store.app.canvasToShow);

    const [previewDialogOpened, setPreviewDialogOpened] = React.useState(false);
    const [canvas, setCanvas] = React.useState('');

    const handleClose = (action: string) => () => {
        if (action !== 'close') {
            setPreviewDialogOpened(true);
            setCanvas(action);
        }
        props.onClose('close');
    };

    const previewDialogClose = (action: string) => {
        if (action === 'close') {
            setPreviewDialogOpened(false);
            setCanvas('');
        }
    };

    return (
        <>
            <Dialog onClose={handleClose('close')} open={props.open}>
                <DialogTitle>{t('file.export.title')}</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {(canvasToShow === AllCanvas ? canvasConfig[rmgStyle] : [canvasToShow]).map(c => (
                            <ListItem button key={c} onClick={handleClose(c)}>
                                <ListItemText primary={t('file.export.' + c)} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            <PreviewDialog open={previewDialogOpened} onClose={previewDialogClose} canvas={canvas} />
        </>
    );
}
