import React, { useContext } from 'react';
import {
    TextField,
    makeStyles,
    createStyles,
    List,
    ListItem,
    ListItemSecondaryAction,
    Switch,
    ListItemText,
    Collapse,
    ListItemIcon,
    Icon,
} from '@material-ui/core';
import { ParamContext, CanvasContext } from '../../../context';
import { useTranslation } from 'react-i18next';

interface Props {
    stnId: string;
}

const NameTab = (props: Props) => {
    const { rmgStyle } = useContext(CanvasContext);

    return (
        <List component="div">
            {rmgStyle === 'gzmtr' && <NumInput {...props} />}
            <NameInput {...props} />
            {rmgStyle === 'gzmtr' && <SecondaryNameInput {...props} />}
        </List>
    );
};

export default NameTab;

const useStyles = makeStyles(() =>
    createStyles({
        lineNumRoot: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'solid 2px',
            borderRightWidth: 1,
            borderRadius: '32px 0 0 32px',
            padding: '2px 5px',
            minWidth: 32,
            height: 32,
            fontSize: '1.5rem',
        },
        numInput: {
            display: 'inline-block',
            border: 'solid 2px',
            borderLeftWidth: 1,
            borderRadius: '0 32px 32px 0',
            padding: '2px 5px',
            width: 32,
            height: 32,
            '& .MuiInputBase-root': {
                marginTop: 1.7,
            },
            '& .MuiInputBase-input': {
                fontSize: '1.5rem',
                padding: 'unset',
                textAlign: 'center',
            },
        },
        nameInputZH: {
            '& .MuiInputBase-input': {
                textAlign: 'center',
                fontSize: '3rem',
                lineHeight: '3rem',
            },
        },
        nameInputEN: {
            '& .MuiInputBase-input': {
                textAlign: 'center',
                fontSize: '1.2rem',
                lineHeight: '1.2rem',
            },
        },
        'nameInputZH-mtr': {
            '& .MuiInputBase-input': {
                fontFamily: [
                    'Myriad Pro',
                    'Vegur',
                    'Noto Serif KR',
                    'Noto Serif JP',
                    'Noto Serif TC',
                    'Noto Serif SC',
                    'HiraMinProN-W6',
                    'serif',
                ].join(),
            },
        },
        'nameInputEN-mtr': {
            '& .MuiInputBase-input': {
                fontFamily: ['Myriad Pro', 'Vegur', 'Arial', 'sans-serif'].join(),
            },
        },
        'nameInputZH-gzmtr': {
            '& .MuiInputBase-input': {
                fontFamily: ['Arial', 'STKaiti', 'KaiTi', 'sans-serif'].join(),
            },
        },
        collapseWrapper: {
            justifyContent: 'center',
        },
        collapseWrapperInner: {
            width: '65%',
        },
        secondaryNameRoot: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiInputBase-input': {
                textAlign: 'center',
            },
        },
        secondaryNameParenthesis: {
            fontSize: '4rem',
        },
        secondaryNameInputRoot: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        secondaryNameInputZH: {
            '& .MuiInputBase-input': {
                fontSize: '1.5rem',
                lineHeight: '1.5rem',
            },
        },
    })
);

const NumInput = (props: Props) => {
    const classes = useStyles();
    const { param, dispatch } = useContext(ParamContext);
    return (
        <ListItem style={{ justifyContent: 'center' }}>
            <div className={classes.lineNumRoot}>
                <span>{param.line_num}</span>
            </div>
            <TextField
                fullWidth
                className={classes.numInput}
                value={param.stn_list[props.stnId].num}
                onChange={e => dispatch({ type: 'UPDATE_STATION_NUM', stnId: props.stnId, num: e.target.value })}
            />
        </ListItem>
    );
};

const NameInput = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { rmgStyle } = useContext(CanvasContext);
    const { param, dispatch } = useContext(ParamContext);
    const { name } = param.stn_list[props.stnId];
    return (
        <ListItem style={{ flexDirection: 'column' }}>
            <TextField
                fullWidth
                placeholder={t('editor.zh')}
                className={`${classes.nameInputZH} ${
                    rmgStyle === 'gzmtr'
                        ? classes['nameInputZH-gzmtr']
                        : rmgStyle === 'mtr'
                        ? classes['nameInputZH-mtr']
                        : ''
                }`}
                value={name[0]}
                onChange={e =>
                    dispatch({ type: 'UPDATE_STATION_NAME', stnId: props.stnId, name: [e.target.value, name[1]] })
                }
                autoFocus
            />
            <TextField
                fullWidth
                placeholder={t('editor.en')}
                className={`${classes.nameInputEN} ${rmgStyle === 'mtr' ? classes['nameInputEN-mtr'] : ''}`}
                value={name[1]}
                onChange={e =>
                    dispatch({ type: 'UPDATE_STATION_NAME', stnId: props.stnId, name: [name[0], e.target.value] })
                }
                helperText={t('editor.backslashToWrap')}
            />
        </ListItem>
    );
};

const SecondaryNameInput = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { param, dispatch } = useContext(ParamContext);
    const { secondaryName } = param.stn_list[props.stnId];
    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon>text_fields</Icon>
                </ListItemIcon>
                <ListItemText primary={t('stations.edit.name.secondary')} />
                <ListItemSecondaryAction>
                    <Switch
                        color="primary"
                        edge="end"
                        checked={secondaryName !== false}
                        onChange={(_, checked) =>
                            dispatch({
                                type: 'UPDATE_STATION_SECONDARY_NAME',
                                stnId: props.stnId,
                                name: checked ? ['', ''] : false,
                            })
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse
                in={secondaryName !== false}
                unmountOnExit
                classes={{ wrapper: classes.collapseWrapper, wrapperInner: classes.collapseWrapperInner }}
            >
                <div className={classes.secondaryNameRoot}>
                    <span className={classes.secondaryNameParenthesis}>{'('}</span>
                    <div className={classes.secondaryNameInputRoot}>
                        <TextField
                            fullWidth
                            placeholder={t('editor.zh')}
                            className={classes.secondaryNameInputZH}
                            value={secondaryName ? secondaryName[0] : ''}
                            onChange={e =>
                                dispatch({
                                    type: 'UPDATE_STATION_SECONDARY_NAME',
                                    stnId: props.stnId,
                                    name: [e.target.value, secondaryName ? secondaryName[1] : ''],
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            placeholder={t('editor.en')}
                            value={secondaryName ? secondaryName[1] : ''}
                            onChange={e =>
                                dispatch({
                                    type: 'UPDATE_STATION_SECONDARY_NAME',
                                    stnId: props.stnId,
                                    name: [secondaryName ? secondaryName[0] : '', e.target.value],
                                })
                            }
                        />
                    </div>
                    <span className={classes.secondaryNameParenthesis}>{')'}</span>
                </div>
            </Collapse>
        </>
    );
};
