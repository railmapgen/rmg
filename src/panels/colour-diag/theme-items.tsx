import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, Icon, TextField, MenuItem, Button, makeStyles, createStyles } from '@material-ui/core';
import { CityEntry, LineEntry } from '../../types';
import { getTransText2 } from '../../utils';

const useStyles = makeStyles(theme => (
    createStyles({
        cityItem: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
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
        console.log('fetching city list');
        fetch('data/city_list.json')
            .then(response => response.json())
            .then(data => setList(data));
    }, []);

    return list;
};

const useLineList = (theme) => {
    const [list, setList] = React.useState([] as LineEntry[]);

    const listPromise = React.useMemo(() => {
        if (!theme[0]) return;
        console.log('fetching line list: ' + theme[0]);
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
                        data.map((l, i) => i === 0 ?
                            { ...l, colour: theme[2], fg: theme[3] || '#fff' } :
                            { ...l })
                    );
                });
        } else {
            listPromise.then(data => setList(data));
        }
    }, [theme.toString()]);

    return list;
}

interface ColourDialogProps {
    theme: [string, string, string, '#000' | '#fff'];
    onUpdate: (key: string, value: any) => void;
}

export default React.memo((props: ColourDialogProps) => {
    console.log('rerender')
    const classes = useStyles();
    const { t, i18n } = useTranslation();

    const cityList = useCityList();

    const [hexTemp, setHexTemp] = React.useState(props.theme[2]);

    const cityChange = (event) => {
        let newTheme = props.theme.map((val, idx) => idx === 0 ? event.target.value : val);
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
            lineList.filter(l => l.id === line)[0].colour,
            lineList.filter(l => l.id === line)[0].fg || '#fff',
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
            let newTheme = props.theme.map((val, idx) => idx === 2 ? rgb : val);
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
                let newTheme = props.theme.map((val, idx) => idx === 2 ? hex : val);
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

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon>location_city</Icon>
                </ListItemIcon>
                <TextField select
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('colour.city')}
                    onChange={cityChange}
                    value={props.theme[0]} >
                    {cityList.map(c => (
                        <MenuItem key={c.id} value={c.id}>
                            <span className={classes.cityItem}>
                                <CountryFlag code={c.country} />
                                <span>{getTransText2(c.name, i18n.languages)}</span>
                            </span>
                        </MenuItem>
                    ))}
                </TextField>
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <Icon>subway</Icon>
                </ListItemIcon>
                <TextField select
                    style={{ width: '100%' }}
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
                    style={{ width: '100%', marginRight: 5 }}
                    variant="outlined"
                    label={t('colour.colour')}
                    onChange={hexChange}
                    value={hexTemp?.toUpperCase()} >
                </TextField>
                <TextField select
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('colour.fg')}
                    onChange={fgChange}
                    value={props.theme[3] || '#fff'} >
                    <MenuItem key="#fff" value="#fff">{t('colour.fgWhite')}</MenuItem>
                    <MenuItem key="#000" value="#000">{t('colour.fgBlack')}</MenuItem>
                </TextField>
            </ListItem>

        </>
    )
}, (prevProps, nextProps) => prevProps.theme.toString() === nextProps.theme.toString());

const useEmojiStyles = makeStyles(() => (
    createStyles({
        img: {
            height: 20,
            marginRight: '0.2rem'
        }
    })
))

interface CountryFlagProps {
    code: string;
}

/**
 * Convert ISO 3166 alpha-2 country code (followed by BS 6879 UK subdivision code, if applicable) to flag Emoji. For Windows platform, an `img` element with image source from OpenMoji is returned. 
 */
function CountryFlag(props: CountryFlagProps) {
    const { i18n } = useTranslation();
    const classes = useEmojiStyles();

    let codePoints = [] as string[];

    if (props.code.length === 2) {
        codePoints = props.code
            .toUpperCase().split('')
            .map(char => (char.codePointAt(0) + 127397).toString(16).toUpperCase());
    } else {
        codePoints = ['1F3F4', 'E007F'];
        codePoints.splice(1, 0,
            ...props.code
                .toUpperCase().split('')
                .map(char => (char.codePointAt(0) + 917536).toString(16).toUpperCase())
        );
    }

    if (['zh-CN', 'zh-Hans'].includes(i18n.language) && props.code === 'TW') codePoints = ['1F3F4'];

    return (
        (navigator.platform.indexOf('Win32') !== -1 || navigator.platform.indexOf('Win64') !== -1) ?
            <img src={`./images/flags/${codePoints.join('-')}.svg`} className={classes.img} /> :
            <span>{String.fromCodePoint(...codePoints.map(cp => parseInt(cp, 16)))}</span>
    );
}