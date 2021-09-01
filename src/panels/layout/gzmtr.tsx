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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { ChangeEvent } from 'react';
import { setDirectionIndicatorX, setDirectionIndicatorY } from '../../redux/param/action';

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
    const dispatch = useDispatch();

    const directionIndicatorX = useSelector((store: RootState) => store.param.direction_gz_x);
    const directionIndicatorY = useSelector((store: RootState) => store.param.direction_gz_y);

    const [isOpen, setIsOpen] = React.useState(false);

    return React.useMemo(() => {
        const handleXChange = (_: ChangeEvent<{}>, value: number | number[]) => {
            dispatch(setDirectionIndicatorX(value as number));
        };

        const handleYChange = (_: ChangeEvent<{}>, value: number | number[]) => {
            dispatch(setDirectionIndicatorY(value as number));
        };

        return (
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
                                value={directionIndicatorX}
                                onChange={handleXChange}
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
                                value={directionIndicatorY}
                                onChange={handleYChange}
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
        );
    }, [directionIndicatorX, directionIndicatorY, isOpen, classes.nestedList, classes.slider, t, dispatch]);
};
