import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@material-ui/core';

import PreviewDialog from './preview-diag';

interface Props {
    onClose: (action: string) => void;
    open: boolean;
}

export default function ExportDialog(props: Props) {
    const { t } = useTranslation();
    
    const [previewDialogOpened, setPreviewDialogOpened] = React.useState(false);
    const [canvas, setCanvas] = React.useState('');

    const handleClose = (action: string) => () => {
        if (action !== 'close') {
            setPreviewDialogOpened(true);
            setCanvas(action);
        }
        props.onClose('close');
    }

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
                        <ListItem button key="destination" 
                            onClick={handleClose('destination')} 
                            disabled={!['mtr', 'shmetro'].includes(window.urlParams.get('style'))}>
                            <ListItemText primary={t('file.export.destination')} />
                        </ListItem>
                        <ListItem button key="runin" 
                            onClick={handleClose('runin')} 
                            disabled={!['gzmtr', 'shmetro'].includes(window.urlParams.get('style'))}>
                            <ListItemText primary={t('file.export.runin')} />
                        </ListItem>
                        <ListItem button key="railmap"
                            onClick={handleClose('railmap')}>
                            <ListItemText primary={t('file.export.railmap')} />
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>

            <PreviewDialog
                open={previewDialogOpened}
                onClose={previewDialogClose}
                canvas={canvas} />
        </>
    );
}

