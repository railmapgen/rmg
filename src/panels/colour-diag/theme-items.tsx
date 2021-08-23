import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@material-ui/core';
import { getTransText2 } from '../../utils';
import { CityCode, cityList } from '../../constants/city-config';
import { ColourHex, LanguageCode, MonoColour, PaletteEntry, Theme } from '../../constants/constants';

const useStyles = makeStyles(() =>
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
            height: 24,
            width: 24,
            minWidth: 0,
            marginRight: 8,
            // border: 'solid',
            padding: 0,
        },
        inputColour: {
            position: 'absolute',
            width: 0,
            height: 0,
            left: 27,
            top: 32,
        },
        buttonContainer: {
            display: 'flex',
            flexShrink: 1,
        },
    })
);

const useLineList = (theme: Theme) => {
    const [list, setList] = React.useState([] as PaletteEntry[]);

    const listPromise = theme[0]
        ? import(/* webpackChunkName: "colours" */ `../../constants/colours/${theme[0]}`).then(
              module => module.default as PaletteEntry[]
          )
        : Promise.resolve([] as PaletteEntry[]);

    useEffect(
        () => {
            if (typeof theme[0] === 'undefined') {
                return;
            }
            (async () => {
                const data = await listPromise;
                setList(
                    theme[0] === CityCode.Other
                        ? [{ ...data[0], colour: theme[2], fg: theme[3] || MonoColour.white }]
                        : data
                );
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme.toString()]
    );

    return list;
};

interface ColourDialogProps {
    theme: Theme;
    onUpdate: (key: string, value: any) => void;
}

export const PalettePanel = (props: ColourDialogProps) => {
    const { t, i18n } = useTranslation();
    const classes = useStyles();

    const cityChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        props.onUpdate('theme', [event.target.value, ...props.theme.slice(1)]);

    // Hook for fetching line list of current city
    const lineList = useLineList(props.theme);

    // Hook for updating props.theme when lineList changed
    useEffect(
        () => {
            if (lineList.length === 0) return; // initialising, ignore
            if (lineList.filter(l => l.id === props.theme[1]).length) return; // current city, ignore
            let { id, colour, fg } = lineList[0];
            let newTheme = [props.theme[0], id, colour, fg || MonoColour.white];
            props.onUpdate('theme', newTheme);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lineList]
    );

    const lineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let line = event.target.value;
        let { colour, fg } = lineList.filter(l => l.id === line)[0];
        let newTheme = [props.theme[0], line, colour, fg || MonoColour.white];
        props.onUpdate('theme', newTheme);
    };

    return (
        <List component="div" disablePadding>
            <CitySelectItem value={props.theme[0]} onChange={cityChange} />
            <Divider variant="middle" />
            <ListItem>
                <ListItemText primary={t('colour.line')} />
                <TextField
                    select
                    style={{ width: 166 }}
                    onChange={lineChange}
                    value={props.theme[1]}
                    disabled={props.theme[0] === 'other'}
                >
                    {lineList.map(l => (
                        <MenuItem key={l.id} value={l.id}>
                            <span
                                className={classes.menuItemSpan}
                                style={{
                                    backgroundColor: l.colour,
                                    color: l.fg || MonoColour.white,
                                }}
                            >
                                {getTransText2(l.name, i18n.languages as LanguageCode[])}
                            </span>
                        </MenuItem>
                    ))}
                </TextField>
            </ListItem>
        </List>
    );
};

export const CustomPanel = (props: ColourDialogProps) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [hexTemp, setHexTemp] = useState(props.theme[2]);

    useEffect(
        () => setHexTemp(props.theme[2]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.theme[2]]
    );

    const colourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let rgb = event.target.value;
        // setHexTemp(rgb);
        props.onUpdate('theme', [CityCode.Other, 'other', rgb, props.theme[3]]);
    };

    const hexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let hex = event.target.value;
        if (hex.match(/^#[0-9a-fA-F]{0,6}$/) === null) return;
        setHexTemp(hex as ColourHex);

        if (props.theme[0] !== 'other') {
            if (hex.match(/^#[0-9a-fA-f]{6}$/) !== null) {
                // if hex valid, modify theme city and props.hex
                let newTheme = [CityCode.Other, 'other', hex, props.theme[3]];
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (along with selection)
                // then line will be updated by hook
            } else {
                // if hex not valid, modify theme city only
                let newTheme = [CityCode.Other, 'other', ...props.theme.slice(2)];
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (along with selection)
                // then line will be updated by hook
            }
        } else {
            if (hex.match(/^#[0-9a-fA-F]{6}$/) !== null) {
                // if hex valid, modify props.hex
                let newTheme = props.theme.map((val, idx) => (idx === 2 ? hex : val));
                props.onUpdate('theme', newTheme);
                // then lineList will be updated by hook (actually only hex is changed)
            } else {
                // if hex not valid, do nothing
            }
        }
    };

    const fgChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let newTheme = [CityCode.Other, 'other', props.theme[2], event.target.value];
        props.onUpdate('theme', newTheme);
    };

    return (
        <List component="div" disablePadding>
            <ListItem>
                <ListItemText primary={t('colour.colour')} />
                <div className={classes.buttonContainer}>
                    <input
                        type="color"
                        id="input-color"
                        value={props.theme[2]}
                        onChange={colourChange}
                        className={classes.inputColour}
                        style={{ opacity: 0 }}
                    />
                    <label htmlFor="input-color">
                        <Tooltip title={t('colour.tooltip')} aria-label="colour picker">
                            <Button
                                className={classes.button}
                                style={{
                                    backgroundColor: props.theme[2],
                                    borderColor: props.theme[3] || MonoColour.white,
                                }}
                                variant="contained"
                                component="span"
                            >
                                {' '}
                            </Button>
                        </Tooltip>
                    </label>
                </div>
                <TextField
                    error={!hexTemp?.match(/^#[0-9a-fA-F]{6}$/g)}
                    style={{ width: 85 }}
                    onChange={hexChange}
                    value={hexTemp?.toUpperCase()}
                />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
                <ListItemText primary={t('colour.fg')} />
                <Select
                    native
                    style={{ width: 85 }}
                    label={t('colour.fg')}
                    onChange={fgChange}
                    value={props.theme[3] || MonoColour.white}
                >
                    <option value="#fff">{t('colour.fgWhite')}</option>
                    <option value="#000">{t('colour.fgBlack')}</option>
                </Select>
            </ListItem>
        </List>
    );
};

const CitySelectItem = (props: { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const { t, i18n } = useTranslation();
    const classes = useStyles();

    const items = useMemo(
        () =>
            cityList.map(c => (
                <MenuItem key={c.id} value={c.id}>
                    <span className={classes.cityItem}>
                        <CountryFlag code={c.country} />
                        <span>{getTransText2(c.name, i18n.languages as LanguageCode[])}</span>
                    </span>
                </MenuItem>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    return (
        <ListItem>
            <ListItemText primary={t('colour.city')} />
            <TextField select style={{ width: 166 }} value={props.value} onChange={props.onChange}>
                {items}
            </TextField>
        </ListItem>
    );
};

const useEmojiStyles = makeStyles(() =>
    createStyles({
        img: {
            height: 20,
            marginRight: '0.2rem',
        },
    })
);

/**
 * Convert ISO 3166 alpha-2 country code (followed by BS 6879 UK subdivision code, if applicable) to flag Emoji. For Windows platform, an `img` element with image source from OpenMoji is returned.
 */
function CountryFlag(props: { code: string }) {
    const { i18n } = useTranslation();
    const classes = useEmojiStyles();

    let codePoints = [] as string[];

    if (props.code.length === 2) {
        codePoints = props.code
            .toUpperCase()
            .split('')
            .map(char => ((char.codePointAt(0) || 0) + 127397).toString(16).toUpperCase());
    } else {
        codePoints = ['1F3F4'].concat(
            props.code
                .toUpperCase()
                .split('')
                .map(char => ((char.codePointAt(0) || 0) + 917536).toString(16).toUpperCase()),
            'E007F'
        );
    }

    // special case for simplified Chinese
    if (
        [LanguageCode.ChineseCN, LanguageCode.ChineseSimp].includes(i18n.language as LanguageCode) &&
        props.code === 'TW'
    )
        codePoints = ['1F3F4'];

    return navigator.platform.indexOf('Win32') !== -1 || navigator.platform.indexOf('Win64') !== -1 ? (
        <img
            src={process.env.PUBLIC_URL + `/images/flags/${codePoints.join('-')}.svg`}
            className={classes.img}
            alt={`Flag of ${props.code}`}
        />
    ) : (
        // <img src={process.env.PUBLIC_URL + `/images/flags/${codePoints.join('-')}.svg`} className={classes.img} />
        <span>{String.fromCodePoint(...codePoints.map(cp => parseInt(cp, 16)))}</span>
    );
}
