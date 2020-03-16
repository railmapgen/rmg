import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
    ListItem,
    ListItemIcon,
    Icon,
    TextField,
    ListItemText,
    makeStyles,
    createStyles,
    FormControlLabel,
    RadioGroup,
    Radio,
    Collapse,
    Divider,
    List,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Menu,
    MenuItem,
    Slider,
} from '@material-ui/core';

import { ParamContext, paramReducer } from '../../context';
import { Note } from '../../types';

const allInfoPanelTypes = {
    gz1: 'Line 1',
    gz28: 'Line 2/8',
    gz3: 'Line 3',
    gzgf: 'Line 6/Guangfo Line',
    gz1421: 'Line 14/21',
};

const useStyles = makeStyles(theme =>
    createStyles({
        nestedList: {
            paddingLeft: theme.spacing(5),
        },
        radioGroup: {
            paddingLeft: theme.spacing(5),
            paddingBottom: theme.spacing(1),
        },
    })
);

const DesignListGZMTR = () => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.lineNum')} />
                <TextField
                    value={param.line_num}
                    onChange={e => dispatch({ type: 'SET_LINE_NUM', num: e.target.value })}
                    style={{ marginRight: 5 }}
                />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.psd')} />
                <TextField
                    value={param.psd_num}
                    onChange={e => dispatch({ type: 'SET_PSD_NUM', num: e.target.value })}
                />
            </ListItem>
            <Divider />
            <PanelTypeLi />
            <Divider />
            <NotesLi />
        </>
    );
};

export default DesignListGZMTR;

const PanelTypeLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { param, dispatch } = React.useContext(ParamContext);
    const [open, setOpen] = React.useState(false);

    return React.useMemo(
        () => (
            <>
                <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)}>
                    <ListItemIcon>
                        <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                    </ListItemIcon>
                    <ListItemText
                        primary={t('design.panelType.button')}
                        secondary={open ? '' : t('design.panelType.' + param.info_panel_type)}
                    />
                    {open ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
                </ListItem>
                <Collapse in={open} unmountOnExit>
                    <RadioGroup
                        name="panel-type"
                        value={param.info_panel_type}
                        className={classes.radioGroup}
                        onChange={e =>
                            dispatch({
                                type: 'SET_PANEL_TYPE',
                                variant: e.target.value as 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf',
                            })
                        }
                    >
                        {Object.keys(allInfoPanelTypes).map(type => (
                            <FormControlLabel
                                value={type}
                                key={type}
                                control={<Radio size="small" color="primary" />}
                                label={t('design.panelType.' + type)}
                            />
                        ))}
                    </RadioGroup>
                </Collapse>
            </>
        ),
        [param.info_panel_type, open, classes.radioGroup]
    );
};

const NotesLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = React.useContext(ParamContext);

    const [isCollapse, setIsCollapse] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [noteSelected, setNoteSelected] = React.useState(0);

    const handleAdd = () => {
        setNoteSelected(param.notesGZMTR.length);
        dispatch({ type: 'ADD_NOTE_GZMTR' });
        setIsDialogOpen(true);
    };

    const handleUpdate = (idx: number) => () => {
        setNoteSelected(idx);
        setIsDialogOpen(true);
    };

    return (
        <>
            <ListItem button onClick={() => setIsCollapse(prevOpen => !prevOpen)}>
                <ListItemIcon>
                    <Icon>notes</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.notesGZMTR.text')} />
                {isCollapse ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
            </ListItem>
            <Collapse in={isCollapse} unmountOnExit>
                <List component="div" disablePadding className={classes.nestedList}>
                    {param.notesGZMTR.map((_, i) => (
                        <NotesEntry key={i} idx={i} onEdit={handleUpdate(i)} />
                    ))}
                    <ListItem>
                        <ListItemText disableTypography>
                            <Typography color="primary" style={{ cursor: 'pointer' }} onClick={handleAdd}>
                                {t('design.notesGZMTR.addNote')}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    {isDialogOpen && (
                        <NoteEditDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} idx={noteSelected} />
                    )}
                </List>
            </Collapse>
        </>
    );
};

const NotesEntry = (props: { idx: number; onEdit: () => void }) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    const [toggleEl, setToggleEl] = React.useState<null | HTMLElement>(null);

    const handleEdit = () => {
        setToggleEl(null);
        props.onEdit();
    };

    const handleSlide = (i: number) => (_, value: number) => {
        dispatch({
            type: 'UPDATE_NOTE_GZMTR',
            idx: props.idx,
            note: param.notesGZMTR[props.idx].map((val, j) => (j === i ? value : val)) as Note,
        });
    };

    const handleRemove = () => {
        setToggleEl(null);
        dispatch({ type: 'REMOVE_NOTE_GZMTR', idx: props.idx });
    };

    return React.useMemo(
        () => (
            <>
                <ListItem>
                    <ListItemText
                        primary={param.notesGZMTR[props.idx][0]}
                        secondary={param.notesGZMTR[props.idx][1]}
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    />
                    <ListItemSecondaryAction>
                        <IconButton size="small" onClick={e => setToggleEl(e.currentTarget)}>
                            <Icon>more_vert</Icon>
                        </IconButton>
                        <Menu anchorEl={toggleEl} open={Boolean(toggleEl)} onClose={() => setToggleEl(null)}>
                            <MenuItem onClick={handleEdit}>{t('design.notesGZMTR.edit')}</MenuItem>

                            <ListItem component="div">
                                <Slider
                                    value={param.notesGZMTR[props.idx][2]}
                                    onChange={handleSlide(2)}
                                    step={0.01}
                                    marks={[
                                        { value: 0, label: t('layout.directionGZ.left') },
                                        { value: 100, label: t('layout.directionGZ.right') },
                                    ]}
                                    style={{ width: 200, marginLeft: 5, marginRight: 5 }}
                                    valueLabelDisplay="auto"
                                />
                            </ListItem>
                            <ListItem>
                                <Slider
                                    value={param.notesGZMTR[props.idx][3]}
                                    onChange={handleSlide(3)}
                                    step={0.01}
                                    marks={[
                                        { value: 0, label: t('layout.directionGZ.top') },
                                        { value: 100, label: t('layout.directionGZ.bottom') },
                                    ]}
                                    style={{ width: 200, marginLeft: 5, marginRight: 5 }}
                                    valueLabelDisplay="auto"
                                />
                            </ListItem>

                            <MenuItem onClick={handleRemove}>{t('design.notesGZMTR.remove')}</MenuItem>
                        </Menu>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="middle" />
            </>
        ),
        [param.notesGZMTR[props.idx].toString(), toggleEl]
    );
};

interface AddNoteDialogProps {
    open: boolean;
    onClose: () => void;
    idx: number;
}

const NoteEditDialog = (props: AddNoteDialogProps) => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);
    const note = param.notesGZMTR[props.idx] || ['', '', 0, 0];

    const [noteZH, setNoteZH] = React.useState(note[0] || '');
    const [noteEN, setNoteEN] = React.useState(note[1] || '');

    const handleClick = () => {
        dispatch({ type: 'UPDATE_NOTE_GZMTR', idx: props.idx, note: [noteZH, noteEN, note[2], note[3]] });
        props.onClose();
    };

    return React.useMemo(
        () => (
            <Dialog open onClose={props.onClose}>
                <DialogTitle>{t('design.notesGZMTR.editNote')}</DialogTitle>
                <DialogContent>
                    <TextField
                        variant="outlined"
                        label={t('editor.zh')}
                        margin="dense"
                        multiline
                        autoFocus
                        value={noteZH}
                        onChange={e => setNoteZH(e.target.value)}
                        style={{ width: '100%' }}
                        helperText={t('editor.enterToWrap')}
                    />
                    <TextField
                        variant="outlined"
                        label={t('editor.en')}
                        margin="dense"
                        multiline
                        value={noteEN}
                        onChange={e => setNoteEN(e.target.value)}
                        style={{ width: '100%' }}
                        helperText={t('editor.enterToWrap')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClick} color="primary">
                        {t('dialog.done')}
                    </Button>
                </DialogActions>
            </Dialog>
        ),
        [noteZH, noteEN]
    );
};
