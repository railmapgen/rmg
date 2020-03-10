import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogTitle, DialogContent, List, ListItem, Paper, Icon, InputBase, makeStyles, DialogActions, Button, createStyles } from '@material-ui/core';

import { Name } from '../../types';

import ThemeListItems from './theme-items';

const useStyles = makeStyles(theme => (
    createStyles({
        paperRoot: {
            width: 250,
        },
        listItemPaper: {
            justifyContent: 'center'
        },
        iconRoot: {
            position: 'absolute',
            color: theme.palette.action.active,
        },
        inputBaseRoot: {
            display: 'block',
        },
        inputBaseInputZH: {
            fontFamily: 'Helvetica, Arial, Noto Serif KR, Noto Serif JP, Noto Serif TC, Noto Serif SC, HiraMinProN-W6, serif',
            textAlign: 'center',
            fontSize: 36,
            padding: 0,
            paddingTop: 6,
            height: 45,
        },
        inputBaseInputEN: {
            fontFamily: 'Helvetica, Arial, sans-serif',
            textAlign: 'center',
            fontSize: 18,
            padding: 0,
            paddingBottom: 6,
            height: 'auto',
        },
    })
));

interface ColourDialogProps {
    open: boolean;
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    onUpdate: (key: string, value: any) => void;
    onClose: () => void;
}

const ColourDialog = React.memo((props: ColourDialogProps) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const nameChange = (value: string, index: number) => {
        let newName = props.lineName.map((val, idx) => idx === index ? value : val);
        props.onUpdate('name', newName);
    }

    const handleClose = () => {
        props.onClose();
    }

    return (
        <Dialog onClose={handleClose} open={props.open}>
            <DialogTitle>{t('colour.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem className={classes.listItemPaper}>
                        <Paper className={classes.paperRoot}
                            style={{ backgroundColor: props.theme[2] }}
                        >
                            <Icon className={classes.iconRoot}>edit</Icon>
                            <InputBase
                                value={props.lineName[0]}
                                classes={{
                                    root: classes.inputBaseRoot,
                                    input: classes.inputBaseInputZH
                                }}
                                style={{ color: props.theme[3] || '#fff' }}
                                onChange={(e) => nameChange(e.target.value, 0)}
                            />
                            <InputBase
                                value={props.lineName[1]}
                                classes={{
                                    root: classes.inputBaseRoot,
                                    input: classes.inputBaseInputEN,
                                }}
                                style={{ color: props.theme[3] || '#fff' }}
                                onChange={(e) => nameChange(e.target.value, 1)}
                            />
                        </Paper>
                    </ListItem>
                    <ThemeListItems theme={props.theme} onUpdate={props.onUpdate} />
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}, (prevProps, nextProps) => prevProps.open === nextProps.open &&
    prevProps.lineName.toString() === nextProps.lineName.toString() &&
    prevProps.theme.toString() === nextProps.theme.toString());

export default ColourDialog;

