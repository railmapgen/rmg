import React, { useContext } from 'react';
import {
    Collapse,
    createStyles,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Switch,
    TextField,
} from '@material-ui/core';
import { ParamContext } from '../../../context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { updateStationName, updateStationNum, updateStationSecondaryName } from "../../../redux/param/action";

interface Props {
    stnId: string;
}

const NameTab = (props: Props) => {
    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);

    return (
        <List component="div">
            {rmgStyle === RmgStyle.GZMTR && <NumInput {...props} />}
            <NameInput {...props} />
            {rmgStyle === RmgStyle.GZMTR && <SecondaryNameInput {...props} />}
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
    const reduxDispatch = useDispatch();
    
    const { param, dispatch } = useContext(ParamContext);
    const lineNum = useSelector((store: RootState) => store.param.line_num);

    return (
        <ListItem style={{ justifyContent: 'center' }}>
            <div className={classes.lineNumRoot}>
                <span>{lineNum}</span>
            </div>
            <TextField
                fullWidth
                className={classes.numInput}
                value={param.stn_list[props.stnId]?.num}
                onChange={e => {
                    dispatch({ type: 'UPDATE_STATION_NUM', stnId: props.stnId, num: e.target.value });
                    reduxDispatch(updateStationNum(props.stnId, e.target.value));
                }}
            />
        </ListItem>
    );
};

const NameInput = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();
    
    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const { param, dispatch } = useContext(ParamContext);
    const { name } = param.stn_list[props.stnId] || param.stn_list.linestart;
    return (
        <ListItem style={{ flexDirection: 'column' }}>
            <TextField
                fullWidth
                placeholder={t('editor.zh')}
                className={`${classes.nameInputZH} ${
                    rmgStyle === RmgStyle.GZMTR
                        ? classes['nameInputZH-gzmtr']
                        : rmgStyle === RmgStyle.MTR
                        ? classes['nameInputZH-mtr']
                        : ''
                }`}
                value={name[0]}
                onChange={e => {
                    dispatch({ type: 'UPDATE_STATION_NAME', stnId: props.stnId, name: [e.target.value, name[1]] });
                    reduxDispatch(updateStationName(props.stnId, [e.target.value, name[1]]));
                }}
                autoFocus
            />
            <TextField
                fullWidth
                placeholder={t('editor.en')}
                className={`${classes.nameInputEN} ${rmgStyle === RmgStyle.MTR ? classes['nameInputEN-mtr'] : ''}`}
                value={name[1]}
                onChange={e => {
                    dispatch({ type: 'UPDATE_STATION_NAME', stnId: props.stnId, name: [name[0], e.target.value] });
                    reduxDispatch(updateStationName(props.stnId, [name[0], e.target.value]));
                }}
                helperText={t('editor.backslashToWrap')}
            />
        </ListItem>
    );
};

const SecondaryNameInput = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();
    
    const { param, dispatch } = useContext(ParamContext);
    const { secondaryName } = param.stn_list[props.stnId] || param.stn_list.linestart;
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
                        onChange={(_, checked) => {
                            dispatch({
                                type: 'UPDATE_STATION_SECONDARY_NAME',
                                stnId: props.stnId,
                                name: checked ? ['', ''] : false,
                            });
                            reduxDispatch(updateStationSecondaryName(props.stnId, checked ? ['', ''] : false));
                        }}
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
                            onChange={e => {
                                dispatch({
                                    type: 'UPDATE_STATION_SECONDARY_NAME',
                                    stnId: props.stnId,
                                    name: [e.target.value, secondaryName ? secondaryName[1] : ''],
                                });
                                reduxDispatch(
                                    updateStationSecondaryName(props.stnId, [
                                        e.target.value,
                                        secondaryName ? secondaryName[1] : '',
                                    ])
                                );
                            }}
                        />
                        <TextField
                            fullWidth
                            placeholder={t('editor.en')}
                            value={secondaryName ? secondaryName[1] : ''}
                            onChange={e => {
                                dispatch({
                                    type: 'UPDATE_STATION_SECONDARY_NAME',
                                    stnId: props.stnId,
                                    name: [secondaryName ? secondaryName[0] : '', e.target.value],
                                });
                                reduxDispatch(
                                    updateStationSecondaryName(props.stnId, [
                                        secondaryName ? secondaryName[0] : '',
                                        e.target.value,
                                    ])
                                );
                            }}
                        />
                    </div>
                    <span className={classes.secondaryNameParenthesis}>{')'}</span>
                </div>
            </Collapse>
        </>
    );
};
