import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogTitle, DialogContent, List, ListItem, Paper, Icon, InputBase, makeStyles, ListItemIcon, TextField, MenuItem, DialogActions, Button, createStyles } from '@material-ui/core';

import { Name, CityEntry, LineEntry } from '../types';
import { countryCode2Emoji, getTransText2 } from '../utils';

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
        menuItemSpan: {
            padding: '0 .3rem',
        }, 
        button: {
            borderRadius: '50%', 
            height: 28, 
            width: 28, 
            minWidth: 0, 
            marginRight: 8, 
            border: 'solid', 
            padding: 0
        }, 
        inputColour: {
            position: 'absolute', 
            width: 0, 
            height: 0, 
            left: 27, 
            top: 32
        }, 
        buttonContainer: {
            display: 'flex', 
            flexShrink: 1, 
        }
    })
));

const useCityList = () => {
    const [list, setList] = React.useState([] as CityEntry[]);

    React.useEffect(() => {
        console.log('fetched city list');
        fetch('data/city_list.json')
            .then(response => response.json())
            .then(data => setList(data));
    }, []);

    return list;
}

const useLineList = (theme) => {
    const [list, setList] = React.useState([] as LineEntry[]);

    const listPromise = React.useMemo(() => {
        if (!theme[0]) return;
        return fetch(`data/${theme[0]}.json`)
            .then(response => response.json() as Promise<LineEntry[]>);
    }, [theme[0]]);

    React.useEffect(() => {
        if (typeof theme[0] === 'undefined') {
            return;
        } else if (theme[0] === 'other') {
            // mutate original list
            listPromise
                .then(data => {
                    setList(
                        data.map((l, i) => i===0 ?
                            {...l, colour: theme[2], fg: theme[3] || '#fff'} : 
                            {...l})
                    );
                });
        } else {
            listPromise.then(data => setList(data));
        }
    }, [theme]);

    return list;
}

interface ColourDialogProps {
    open: boolean;
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    onUpdate: (key: string, value: any) => void;
    onClose: () => void;
}

export default function ColourDialog(props: ColourDialogProps) {
    const classes = useStyles();
    const {t, i18n} = useTranslation();

    const cityList = useCityList();

    const [hexTemp, setHexTemp] = React.useState(props.theme[2]);

    const nameChange = (value: string, index: number) => {
        let newName = props.lineName.map((val, idx) => idx===index ? value : val);
        props.onUpdate('name', newName);
    }

    const cityChange = (event) => {
        let newTheme = props.theme.map((val, idx) => idx===0 ? event.target.value : val);
        props.onUpdate('theme', newTheme);
    }

     // Hook for fetching line list of current city
    const lineList = useLineList(props.theme);

    // Hook for updating props.theme when lineList changed
    React.useEffect(() => {
        if (lineList.length === 0) return; // initialising, ignore
        if (lineList.filter(l => l.id === props.theme[1]).length) return; // current city, ignore
        let newTheme = [props.theme[0], lineList[0].id, lineList[0].colour, lineList[0].fg || '#fff'];
        props.onUpdate('theme', newTheme);
    }, [lineList]);

    const lineChange = (event) => {
        let line = event.target.value;
        let newTheme = [
            props.theme[0], 
            line, 
            lineList.filter(l => l.id===line)[0].colour, 
            lineList.filter(l => l.id===line)[0].fg || '#fff', 
        ];
        props.onUpdate('theme', newTheme);
    }

    // Hook for updating hexTemp when props.hex changed
    // which means valid hex has been updated to props
    React.useEffect(() => {
        setHexTemp(props.theme[2]);
    }, [props.theme[2]]);

    const colourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let rgb = event.target.value;
        setHexTemp(rgb);

        if (props.theme[0] !== 'other') {
                // if hex valid, modify theme city and props.hex
                let newTheme = [
                    'other', 
                    props.theme[1], 
                    rgb, 
                    props.theme[3],
                ]
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (along with selection)
                // then line will be updated by hook
        } else {
                // if hex valid, modify props.hex
                let newTheme = props.theme.map((val,idx) => idx===2 ? rgb : val);
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (actually only hex is changed)
        }
    };

    const hexChange = (event) => {
        let hex = event.target.value;
        if (hex.match(/^#[0-9a-fA-f]{0,6}$/) === null) return;
        setHexTemp(hex);

        if (props.theme[0] !== 'other') {
            if (hex.match(/^#[0-9a-fA-f]{6}$/) !== null) {
                // if hex valid, modify theme city and props.hex
                let newTheme = [
                    'other', 
                    props.theme[1], 
                    hex, 
                    props.theme[3],
                ]
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (along with selection)
                // then line will be updated by hook
            } else {
                // if hex not valid, modify theme city only
                let newTheme = [
                    'other', 
                    props.theme[1], 
                    props.theme[2],
                    props.theme[3],
                ]
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (along with selection)
                // then line will be updated by hook
            }
        } else {
            if (hex.match(/^#[0-9a-fA-f]{6}$/) !== null) {
                // if hex valid, modify props.hex
                let newTheme = props.theme.map((val,idx) => idx===2 ? hex : val);
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (actually only hex is changed)
            } else {
                // if hex not valid, do nothing
            }
        }
    };

    const fgChange = (event) => {
        let newTheme = [
            'other', 'other', props.theme[2], event.target.value
        ];
        props.onUpdate('theme', newTheme);
    }

    const handleClose = () => {
        setHexTemp(props.theme[2]);
        props.onClose();
    }

    return (
        <Dialog onClose={handleClose} open={props.open}>
            <DialogTitle>{t('colour.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem className={classes.listItemPaper}>
                        <Paper className={classes.paperRoot}
                            style={{backgroundColor: props.theme[2]}}
                        >
                            <Icon color="action" className={classes.iconRoot}>edit</Icon>
                            <InputBase
                                value={props.lineName[0]}
                                classes={{
                                    root: classes.inputBaseRoot,
                                    input: classes.inputBaseInputZH
                                }}
                                style={{color: props.theme[3] || '#fff'}}
                                onChange={(e) => nameChange(e.target.value, 0)}
                            />
                            <InputBase
                                value={props.lineName[1]}
                                classes={{
                                    root: classes.inputBaseRoot,
                                    input: classes.inputBaseInputEN,
                                }}
                                style={{color: props.theme[3] || '#fff'}}
                                onChange={(e) => nameChange(e.target.value, 1)}
                            />
                        </Paper>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>location_city</Icon>
                        </ListItemIcon>
                        <TextField select 
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('colour.city')}
                            onChange={cityChange}
                            value={props.theme[0]} >
                            {cityList.map(c => (
                                <MenuItem key={c.id} value={c.id}>
                                    <span dangerouslySetInnerHTML={{
                                        __html: countryCode2Emoji(c.country) + 
                                            getTransText2(c.name, i18n.languages)
                                    }} />
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>subway</Icon>
                        </ListItemIcon>
                        <TextField select 
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('colour.line')}
                            onChange={lineChange}
                            value={props.theme[1]} >
                            {lineList.map(l => (
                                <MenuItem key={l.id} value={l.id}>
                                    <span className={classes.menuItemSpan}
                                        style={{
                                            backgroundColor: l.colour, 
                                            color: l.fg || '#fff', 
                                        }}>
                                        {getTransText2(l.name, i18n.languages)}
                                    </span>
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <div className={classes.buttonContainer}>
                            <input type="color" id="input-color" value={props.theme[2]}
                                onChange={colourChange} className={classes.inputColour} />
                            <label htmlFor="input-color">
                                <Button className={classes.button} style={{
                                    backgroundColor: props.theme[2], 
                                    borderColor: props.theme[3] || '#fff', 
                                }} variant="contained" component="span" />
                            </label>
                        </div>
                        <TextField 
                            error={!hexTemp?.match(/^#[0-9a-fA-f]{6}$/g)}
                            style={{width: '100%', marginRight:5}}
                            variant="outlined"
                            label={t('colour.colour')}
                            onChange={hexChange}
                            value={hexTemp?.toUpperCase()} >
                        </TextField>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('colour.fg')}
                            onChange={fgChange}
                            value={props.theme[3] || '#fff'} >
                            <MenuItem key="#fff" value="#fff">{t('colour.fgWhite')}</MenuItem>
                            <MenuItem key="#000" value="#000">{t('colour.fgBlack')}</MenuItem>
                        </TextField>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}