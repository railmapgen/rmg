import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    Icon,
    InputBase,
    makeStyles,
    DialogActions,
    Button,
    createStyles,
    Tabs,
    Tab,
} from '@material-ui/core';
import { PalettePanel, CustomPanel } from './theme-items';

const useStyles = makeStyles((theme) =>
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
            flexShrink: 0,
            padding: 'unset',
            margin: `0 ${theme.spacing(1)}px`,
        },
        contentControl: {
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            width: 270,
        },
        contentRoot: {
            padding: 'unset',
            '&:first-child': {
                paddingTop: 'unset',
            },
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
    })
);

interface Props {
    open: boolean;
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    onUpdate: (key: string, value: any) => void;
    onClose: () => void;
}

const Dialog2 = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const nameChange = (value: string, index: number) => {
        let newName = props.lineName.map((val, idx) => (idx === index ? value : val));
        props.onUpdate('name', newName);
        // props.onUpdate('all', [...props.theme, ...newName]);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth={false}>
            <DialogTitle>{t('colour.title')}</DialogTitle>
            <div className={classes.contentWrapper}>
                <DialogContent className={classes.contentLeft}>
                    <Paper className={classes.paperRoot} style={{ backgroundColor: props.theme[2] }}>
                        <Icon className={classes.iconRoot}>edit</Icon>
                        <InputBase
                            value={props.lineName[0]}
                            classes={{
                                root: classes.inputBaseRoot,
                                input: classes.inputBaseInputZH,
                            }}
                            style={{ color: props.theme[3] || '#fff' }}
                            onChange={(e) => nameChange(e.target.value, 0)}
                            autoFocus
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
                </DialogContent>
                <div className={classes.contentControl}>
                    <DialogContent classes={{ root: classes.contentRoot }}>
                        <ColourControl theme={props.theme} onUpdate={props.onUpdate} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose} color="primary">
                            {t('dialog.done')}
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default Dialog2;

const ColourControl = (props: { theme: Theme; onUpdate: Props['onUpdate'] }) => {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState(props.theme[0] === 'other' ? 1 : 0);

    const handleTabChange = (_: React.ChangeEvent<{}>, value: any) => {
        if (value === 1) {
            // props.onUpdate('theme', ['other', 'other', ...props.theme.slice(2)]);
        }
        setTabIndex(value);
    };

    const tabNav = (
        <Tabs
            value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            variant="fullWidth"
            scrollButtons="off"
        >
            <Tab label={t('colour.palette')} style={{ minWidth: 'unset' }} />
            <Tab label={t('colour.custom')} style={{ minWidth: 'unset' }} />
        </Tabs>
    );

    const panel = ((idx) => {
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
