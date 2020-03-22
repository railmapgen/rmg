import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Slider,
    ListItem,
    ListItemText,
    Icon,
    Collapse,
    makeStyles,
    createStyles,
    List,
    ListItemIcon,
    Divider,
} from '@material-ui/core';
import { ParamContext } from '../../context';

const useStyles = makeStyles(theme =>
    createStyles({
        nestedList: {
            paddingLeft: theme.spacing(5),
        },
        slider: {
            width: 168,
            marginLeft: 8,
            marginRight: 8,
        },
    })
);

export default React.memo(function LayoutGZMTR() {
    return (
        <>
            <Divider />
            <DirectionGZLi />
        </>
    );
});

const DirectionGZLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = React.useContext(ParamContext);

    const [isOpen, setIsOpen] = React.useState(false);

    return React.useMemo(
        () => (
            <>
                <ListItem button onClick={() => setIsOpen(prevOpen => !prevOpen)}>
                    <ListItemIcon>
                        <Icon>open_with</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('layout.directionGZ.title')} />
                    {isOpen ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
                </ListItem>
                <Collapse in={isOpen} unmountOnExit>
                    <List component="div" disablePadding className={classes.nestedList}>
                        <ListItem>
                            <ListItemText primary={t('layout.directionGZ.horizontal')} />
                            <Slider
                                className={classes.slider}
                                value={param.direction_gz_x}
                                onChange={(_event, value) =>
                                    dispatch({ type: 'SET_DIRECTION_GZ_X', value: value as number })
                                }
                                step={0.01}
                                marks={[
                                    { value: 0, label: t('layout.directionGZ.left') },
                                    { value: 100, label: t('layout.directionGZ.right') },
                                ]}
                                valueLabelDisplay="auto"
                            />
                        </ListItem>
                        <Divider variant="middle" />
                        <ListItem>
                            <ListItemText primary={t('layout.directionGZ.vertical')} />
                            <Slider
                                className={classes.slider}
                                value={param.direction_gz_y}
                                onChange={(_event, value) =>
                                    dispatch({ type: 'SET_DIRECTION_GZ_Y', value: value as number })
                                }
                                step={0.01}
                                marks={[
                                    { value: 0, label: t('layout.directionGZ.top') },
                                    { value: 100, label: t('layout.directionGZ.bottom') },
                                ]}
                                valueLabelDisplay="auto"
                            />
                        </ListItem>
                    </List>
                </Collapse>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.direction_gz_x, param.direction_gz_y, isOpen, classes.nestedList, classes.slider]
    );
};
