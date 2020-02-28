import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemText, Dialog, DialogTitle, DialogContent, List, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { getTransText } from '../../utils';

const useTemplateList = () => {
    const [list, setList] = React.useState([] as {desc: {[x: string]: string}; filename: string}[]);

    React.useEffect(() => {
        console.log('fetched template list');
        fetch('templates/template_list.json')
            .then(response => response.json())
            .then((data: typeof list) => setList(data));
    }, []);

    return list;
} 

interface TemplateDialogProps {
    open: boolean;
    onClose: (action: string) => void;
}

export default (props: TemplateDialogProps) => {
    const { t, i18n } = useTranslation();
    const templateList = useTemplateList();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('file.new.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {templateList.map(t => (
                        <ListItem button onClick={() => props.onClose(t.filename)} key={t.filename}>
                            <ListItemText primary={getTransText(t.desc, i18n.language)} />
                        </ListItem>
                    ))}
                </List>
                <DialogContentText>
                    {t('file.new.notice')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose('close')} color="primary">
                    {t('dialog.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
