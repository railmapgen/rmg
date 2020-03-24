import React, { useState, useContext, useMemo, memo } from 'react';
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
import { ParamContext, CanvasContext } from '../../context';

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
    const { rmgStyle } = useContext(CanvasContext);
    return (
        <>
            <SizeLi />
            <Divider />
            {rmgStyle !== 'shmetro' && (
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

    const { param, dispatch } = useContext(ParamContext);
    const { canvasAvailable } = useContext(CanvasContext);

    const [isOpen, setIsOpen] = useState(false);

    return useMemo(
        () => (
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
                        {canvasAvailable.map(canvas => (
                            <React.Fragment key={canvas}>
                                <ListItem>
                                    <ListItemText primary={t('layout.size.width.' + canvas)} />
                                    <TextField
                                        value={param.svgWidth[canvas].toString()}
                                        onChange={e =>
                                            !isNaN(Number(e.target.value)) &&
                                            dispatch({
                                                type: 'SET_WIDTH',
                                                targetId: canvas,
                                                value: Number(e.target.value),
                                            })
                                        }
                                        className={classes.textField}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">px</InputAdornment>,
                                        }}
                                    />
                                </ListItem>
                                <Divider variant="middle" />
                            </React.Fragment>
                        ))}
                        <ListItem>
                            <ListItemText primary={t('layout.size.height')} />
                            <TextField
                                value={param.svg_height.toString()}
                                onChange={e =>
                                    !isNaN(Number(e.target.value)) &&
                                    dispatch({ type: 'SET_HEIGHT', value: Number(e.target.value) })
                                }
                                className={classes.textField}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                                }}
                            />
                        </ListItem>
                    </List>
                </Collapse>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(param.svgWidth), param.svg_height, isOpen, classes.nestedList]
    );
};

const YLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = useContext(ParamContext);

    return useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>vertical_align_center</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.y')} />
                <Slider
                    className={classes.slider}
                    value={param.y_pc}
                    onChange={(_, value) => dispatch({ type: 'SET_Y', value: value as number })}
                    step={0.01}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 100, label: '100%' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.y_pc, classes.slider]
    );
};

const BranchSpacingLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = useContext(ParamContext);

    return useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>format_line_spacing</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.branchSpacing')} />
                <Slider
                    className={classes.slider}
                    value={param.branch_spacing}
                    onChange={(_, value) => dispatch({ type: 'SET_BRANCH_SPACING', value: value as number })}
                    step={0.01}
                    marks={[
                        { value: 0, label: '0px' },
                        { value: 100, label: '100px' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.branch_spacing, classes.slider]
    );
};

const PaddingLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = useContext(ParamContext);

    return useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>stay_current_landscape</Icon>
                </ListItemIcon>
                <ListItemText primary={t('layout.padding')} />
                <Slider
                    className={classes.slider}
                    value={param.padding}
                    onChange={(_, value) => dispatch({ type: 'SET_PADDING', value: value as number })}
                    step={0.01}
                    max={50}
                    marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                    ]}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.padding, classes.slider]
    );
};
