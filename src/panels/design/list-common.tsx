import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Name } from '../../types';
import {
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    TextField,
    Divider,
    makeStyles,
    createStyles,
    Button,
} from '@material-ui/core';
import ColourDialog from '../colour-diag';
import { ParamContext } from '../../context';

const useStyles = makeStyles(theme =>
    createStyles({
        dividerVertical: {
            margin: theme.spacing(0, 2),
        },
    })
);

const DesignList = () => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    const [isCDiagOpen, setIsCDiagOpen] = React.useState(false);

    const nameDialogUpdate = (key: string, value: any) => {
        if (key === 'name') {
            dispatch({ type: 'SET_LINE_NAME', name: Object.values(value) as Name });
        }
        if (key === 'theme') {
            dispatch({ type: 'SET_THEME', theme: value });
        }
    };

    return (
        <>
            <ListItem button onClick={() => setIsCDiagOpen(true)}>
                <ListItemIcon>
                    <Icon>color_lens</Icon>
                </ListItemIcon>
                <ListItemText
                    primary={t('design.theme')}
                    secondary={
                        <span
                            style={{
                                backgroundColor: param.theme[2],
                                color: param.theme[3],
                                padding: '.1rem .3rem',
                            }}
                        >
                            {Object.values(param.line_name).join()}
                        </span>
                    }
                />
                <Icon color="action">open_in_new</Icon>
            </ListItem>
            <ColourDialog
                open={isCDiagOpen}
                theme={param.theme}
                lineName={param.line_name}
                onUpdate={nameDialogUpdate}
                onClose={() => setIsCDiagOpen(false)}
            />
            <Divider />
            <DirectionLi />
            <Divider />
            <PlatformNumLi />
        </>
    );
};

export default DesignList;

const DirectionLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>directions</Icon>
                </ListItemIcon>
                <ListItemText
                    primary={t('design.direction.button')}
                    secondary={t('design.direction.' + param.direction)}
                />
                <Divider orientation="vertical" flexItem className={classes.dividerVertical} />
                <Button variant="outlined" color="primary" onClick={() => dispatch({ type: 'SET_DIRECTION' })}>
                    {t('design.direction.switch')}
                </Button>
            </ListItem>
        ),
        [classes.dividerVertical, param.direction]
    );
};

const PlatformNumLi = () => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.platform')} />
                <TextField
                    value={param.platform_num}
                    onChange={e => dispatch({ type: 'SET_PLATFORM', platform: e.target.value })}
                />
            </ListItem>
        ),
        [param.platform_num]
    );
};
