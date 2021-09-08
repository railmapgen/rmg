import React, { useState, useMemo, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
    ListItem,
    ListItemIcon,
    Icon,
    TextField,
    ListItemText,
    makeStyles,
    createStyles,
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
    Switch,
    Select,
} from '@material-ui/core';

import { PanelTypeGZMTR, Note } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { addNote, removeNote, setLineNum, setPanelType, setPsdNum, updateNote } from '../../redux/param/action';

const useStyles = makeStyles(theme =>
    createStyles({
        nestedList: {
            paddingLeft: theme.spacing(5),
        },
    })
);

const DesignListGZMTR = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const lineNum = useSelector((store: RootState) => store.param.line_num);
    const psdNum = useSelector((store: RootState) => store.param.psd_num);

    const handleLineNumChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        dispatch(setLineNum(value));
    };

    const handlePsdNumChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        dispatch(setPsdNum(value));
    };

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.lineNum')} />
                <TextField value={lineNum} onChange={handleLineNumChange} />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.psd')} />
                <TextField value={psdNum} onChange={handlePsdNumChange} />
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
    const dispatch = useDispatch();

    const panelType = useSelector((store: RootState) => store.param.info_panel_type);

    return useMemo(() => {
        const handleChange = ({ target: { value } }: ChangeEvent<{ name?: string; value: unknown }>) => {
            dispatch(setPanelType(value as PanelTypeGZMTR));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.panelType.button')} />
                <Select native value={panelType} onChange={handleChange} style={{ width: 166 }}>
                    {Object.values(PanelTypeGZMTR).map(type => (
                        <option key={type} value={type}>
                            {t('design.panelType.' + type)}
                        </option>
                    ))}
                </Select>
            </ListItem>
        );
    }, [panelType, t, dispatch]);
};

const NotesLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();

    const notes = useSelector((store: RootState) => store.param.notesGZMTR);

    const [isCollapse, setIsCollapse] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [noteSelected, setNoteSelected] = useState(0);

    const handleAdd = () => {
        setNoteSelected(notes.length);
        dispatch(addNote());
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
                    {notes.map((_, i) => (
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
    const dispatch = useDispatch();

    const notes = useSelector((store: RootState) => store.param.notesGZMTR);
    const selectedNote = notes[props.idx];

    const [toggleEl, setToggleEl] = useState<null | HTMLElement>(null);

    const handleEdit = () => {
        setToggleEl(null);
        props.onEdit();
    };

    const handleSlide = (i: number) => (_event: React.ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number') {
            const updatedNote = selectedNote.map((val, j) => (j === i ? value : val)) as Note;
            dispatch(updateNote(props.idx, updatedNote));
        }
    };

    const handleChangeBorder = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const updatedNote = selectedNote.map((val, i) => (i === 4 ? checked : val)) as Note;
        dispatch(updateNote(props.idx, updatedNote));
    };

    const handleRemove = () => {
        setToggleEl(null);
        dispatch(removeNote(props.idx));
    };

    return useMemo(
        () => (
            <>
                <ListItem>
                    <ListItemText
                        primary={selectedNote[0]}
                        secondary={selectedNote[1]}
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
                                    value={selectedNote[2]}
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
                                    value={selectedNote[3]}
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
                            <ListItem>
                                <ListItemText primary={t('design.notesGZMTR.border')} />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        color="primary"
                                        checked={selectedNote[4]}
                                        onChange={handleChangeBorder}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>

                            <MenuItem onClick={handleRemove}>{t('design.notesGZMTR.remove')}</MenuItem>
                        </Menu>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="middle" />
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedNote.toString(), toggleEl]
    );
};

interface AddNoteDialogProps {
    open: boolean;
    onClose: () => void;
    idx: number;
}

const NoteEditDialog = (props: AddNoteDialogProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const notes = useSelector((store: RootState) => store.param.notesGZMTR);
    const selectedNote = notes[props.idx] || ['', '', 0, 0, false];

    const [noteZH, setNoteZH] = useState(selectedNote[0] || '');
    const [noteEN, setNoteEN] = useState(selectedNote[1] || '');

    const handleClick = () => {
        const updatedNote: Note = [noteZH, noteEN, selectedNote[2], selectedNote[3], selectedNote[4]];
        dispatch(updateNote(props.idx, updatedNote));
        props.onClose();
    };

    return useMemo(
        () => (
            <Dialog open={true} onClose={props.onClose}>
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [noteZH, noteEN]
    );
};
