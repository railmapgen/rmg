import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Button,
    Chip,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Icon,
    InputBase,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Paper,
    Tab,
    Tabs,
} from '@material-ui/core';
import { CustomPanel, PalettePanel } from './theme-items';
import { InterchangeInfo, MonoColour, Name, Theme } from '../../constants/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

const useStyles = makeStyles(theme =>
    createStyles({
        contentWrapper: {
            display: 'flex',
            overflow: 'hidden',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column',
            },
        },
        contentLeft: {
            maxWidth: 280,
        },
        contentControl: {
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            width: 270,
        },

        paperRoot: {
            maxWidth: 250,
        },
        listItemPaper: {
            justifyContent: 'center',
        },
        iconRoot: {
            position: 'absolute',
            color: theme.palette.action.active,
        },
        inputBaseRoot: {
            display: 'block',
        },
        inputBaseInputZH: {
            textAlign: 'center',
            fontSize: 36,
            padding: 0,
            paddingTop: 6,
            height: 45,
        },
        inputBaseInputEN: {
            textAlign: 'center',
            fontSize: 18,
            padding: 0,
            paddingBottom: 6,
            height: 'auto',
        },

        chipWrapper: {
            overflowX: 'auto',
            display: 'flex',
        },
        chipRoot: {
            borderRadius: 4.5,
            height: 32,
            lineHeight: '1rem',
            margin: 2,
        },
        chipLabel: {
            padding: '0 6px',
            '& > span': {
                display: 'block',
                textAlign: 'center',
            },
            '& > span:first-child': {
                fontSize: '1rem',
            },
            '& > span:last-child': {
                lineHeight: '0.8rem',
            },
        },
    })
);

interface Props {
    open: boolean;
    theme: Theme;
    lineName: Name;
    onUpdate: (key: string, value: any) => void;
    onClose: () => void;
}

const Dialog2 = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{t('colour.title')}</DialogTitle>
            <DialogContent className={classes.contentWrapper}>
                <List component="div" disablePadding className={classes.contentLeft}>
                    <LineNameInput theme={props.theme} lineName={props.lineName} onUpdate={props.onUpdate} />
                    <Divider />
                    <RecentChipSet onUpdate={props.onUpdate} />
                </List>
                <div className={classes.contentControl}>
                    <ColourControl theme={props.theme} onUpdate={props.onUpdate} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Dialog2;

const LineNameInput = (props: { lineName: Name; theme: Theme; onUpdate: Props['onUpdate'] }) => {
    const classes = useStyles();

    const nameChange = (value: string, index: number) => {
        let newName = props.lineName.map((val, idx) => (idx === index ? value : val));
        props.onUpdate('name', newName);
    };

    return (
        <ListItem style={{ justifyContent: 'center' }}>
            <Paper className={classes.paperRoot} style={{ backgroundColor: props.theme[2] }}>
                <Icon className={classes.iconRoot}>edit</Icon>
                <InputBase
                    value={props.lineName[0]}
                    classes={{
                        root: classes.inputBaseRoot,
                        input: classes.inputBaseInputZH,
                    }}
                    style={{ color: props.theme[3] || MonoColour.white }}
                    onChange={e => nameChange(e.target.value, 0)}
                    autoFocus
                />
                <InputBase
                    value={props.lineName[1]}
                    classes={{
                        root: classes.inputBaseRoot,
                        input: classes.inputBaseInputEN,
                    }}
                    style={{ color: props.theme[3] || MonoColour.white }}
                    onChange={e => nameChange(e.target.value, 1)}
                />
            </Paper>
        </ListItem>
    );
};

const RecentChipSet = (props: { onUpdate: Props['onUpdate'] }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const theme = useSelector((store: RootState) => store.param.theme);
    const lineName = useSelector((store: RootState) => store.param.line_name);
    const stationList = useSelector((store: RootState) => store.param.stn_list);

    const allInfos = useMemo(
        () =>
            new Set(
                Object.values(stationList)
                    .reduce(
                        (acc, { transfer }) => {
                            const { info } = transfer;
                            return acc.concat(...info);
                        },
                        [[...theme, ...lineName]]
                    )
                    .map(val => JSON.stringify(val))
                    .reverse()
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const chips = useMemo(
        () =>
            [...allInfos].map((x, i) => {
                const info: InterchangeInfo = JSON.parse(x);
                const label = info.slice(4).map((txt, i) => (
                    <span key={i} style={{ color: info[3] }}>
                        {txt}
                    </span>
                ));

                return (
                    <Chip
                        key={i}
                        onClick={() => {
                            props.onUpdate('theme', info.slice(0, 4));
                            props.onUpdate('name', info.slice(4));
                        }}
                        style={{ backgroundColor: info[2] }}
                        className={classes.chipRoot}
                        classes={{ label: classes.chipLabel }}
                        {...{ label }}
                    />
                );
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <ListItem>
            <ListItemText
                primary={t('colour.recent')}
                secondary={chips}
                secondaryTypographyProps={{ component: 'div' }}
                classes={{ secondary: classes.chipWrapper }}
            />
        </ListItem>
    );
};

const ColourControl = (props: { theme: Theme; onUpdate: Props['onUpdate'] }) => {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState(props.theme[0] === 'other' ? 1 : 0);

    const tabNav = (
        <Tabs
            value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, val) => setTabIndex(val)}
            variant="fullWidth"
            scrollButtons="off"
        >
            <Tab label={t('colour.palette')} style={{ minWidth: 'unset' }} />
            <Tab label={t('colour.custom')} style={{ minWidth: 'unset' }} />
        </Tabs>
    );

    const panel = (idx => {
        switch (idx) {
            case 0:
                return <PalettePanel {...props} />;
            case 1:
                return <CustomPanel {...props} />;
            default:
                return <></>;
        }
    })(tabIndex);

    return (
        <>
            {tabNav}
            {panel}
        </>
    );
};
