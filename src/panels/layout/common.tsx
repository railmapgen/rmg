import React, { ChangeEvent, memo, useMemo, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TextField,
    Slider,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    makeStyles,
    createStyles,
    Collapse,
    Divider,
    InputAdornment,
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../redux';
import { canvasConfig, CanvasType, RmgStyle } from '../../constants/constants';
import {
    setBranchSpacing,
    setPaddingPercentage,
    setSvgHeight,
    setSvgWidth,
    setYPercentage,
} from '../../redux/param/action';

const useStyles = makeStyles(theme =>
    createStyles({
        nestedList: {
            paddingLeft: theme.spacing(5),
        },
        textField: {
            maxWidth: 168,
        },
        slider: {
            width: 168,
            marginLeft: 8,
            marginRight: 8,
        },
    })
);

export default memo(function LayoutCommon() {
    const rmgStyle = useAppSelector(store => store.param.style);
    return (
        <>
            <SizeLi />
            <Divider />
            {rmgStyle !== RmgStyle.SHMetro && (
                <>
                    <YLi />
                    <Divider />
                </>
            )}
            <BranchSpacingLi />
            <Divider />
            <PaddingLi />
        </>
    );
});

const SizeLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.param.style);
    const svgHeight = useAppSelector(store => store.param.svg_height);
    const svgWidths = useAppSelector(store => store.param.svgWidth);

    const [isOpen, setIsOpen] = useState(false);

    const handleSvgWidthChange =
        (canvas: CanvasType) =>
        ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            if (!isNaN(Number(value))) {
                dispatch(setSvgWidth(Number(value), canvas));
            }
        };

    const handleSvgHeightChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(value))) {
            dispatch(setSvgHeight(Number(value)));
        }
    };

    return (
        <>
            <ListItem button onClick={() => setIsOpen(prevOpen => !prevOpen)}>
                <ListItemIcon>
                    <Icon>panorama_horizontal</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.size.title')} />
                {isOpen ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
            </ListItem>
            <Collapse in={isOpen} unmountOnExit>
                <List component="div" disablePadding className={classes.nestedList}>
                    {canvasConfig[rmgStyle].map(canvas => (
                        <Fragment key={canvas + '.width'}>
                            <ListItem>
                                <ListItemText primary={t('layout.size.width.' + canvas)} />
                                <TextField
                                    defaultValue={svgWidths[canvas].toString()}
                                    onChange={handleSvgWidthChange(canvas)}
                                    className={classes.textField}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">px</InputAdornment>,
                                    }}
                                />
                            </ListItem>
                            <Divider variant="middle" />
                        </Fragment>
                    ))}
                    <ListItem>
                        <ListItemText primary={t('layout.size.height')} />
                        <TextField
                            value={svgHeight.toString()}
                            onChange={handleSvgHeightChange}
                            className={classes.textField}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">px</InputAdornment>,
                            }}
                        />
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
};

const YLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const yPercentage = useAppSelector(store => store.param.y_pc);

    return useMemo(() => {
        const handleSliderChange = (_: ChangeEvent<{}>, value: number | number[]) => {
            dispatch(setYPercentage(value as number));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon>vertical_align_center</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.y')} />
                <Slider
                    className={classes.slider}
                    value={yPercentage}
                    onChange={handleSliderChange}
                    step={0.01}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 100, label: '100%' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        );
    }, [yPercentage, classes.slider, t, dispatch]);
};

const BranchSpacingLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const branchSpacing = useAppSelector(store => store.param.branch_spacing);

    return useMemo(() => {
        const handleSliderChange = (_: ChangeEvent<{}>, value: number | number[]) => {
            dispatch(setBranchSpacing(value as number));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon>format_line_spacing</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.branchSpacing')} />
                <Slider
                    className={classes.slider}
                    value={branchSpacing}
                    onChange={handleSliderChange}
                    step={0.01}
                    marks={[
                        { value: 0, label: '0px' },
                        { value: 100, label: '100px' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        );
    }, [branchSpacing, classes.slider, t, dispatch]);
};

const PaddingLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const paddingPercentage = useAppSelector(store => store.param.padding);

    return useMemo(() => {
        const handleSliderChange = (_: ChangeEvent<{}>, value: number | number[]) => {
            dispatch(setPaddingPercentage(value as number));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon>stay_current_landscape</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.padding')} />
                <Slider
                    className={classes.slider}
                    value={paddingPercentage}
                    onChange={handleSliderChange}
                    step={0.01}
                    max={50}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        );
    }, [paddingPercentage, classes.slider, t, dispatch]);
};
