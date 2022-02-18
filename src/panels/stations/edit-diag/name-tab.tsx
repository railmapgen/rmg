import React from 'react';
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
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { updateStationName, updateStationNum, updateStationSecondaryName } from '../../../redux/param/action';

interface Props {
    stnId: string;
}

const NameTab = (props: Props) => {
    const rmgStyle = useAppSelector(store => store.param.style);
    const showStationNumber = useAppSelector(store => store.param.showStationNumber);

    return (
        <List component="div">
            {(rmgStyle === RmgStyle.GZMTR || (rmgStyle === RmgStyle.SHMetro && showStationNumber)) && <NumInput {...props} />}
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
            width: 'auto',
            height: 32,
            '& .MuiInputBase-root': {
                marginTop: 1.7,
            },
            '& .MuiInputBase-input': {
                fontSize: '1.5rem',
                padding: 'unset',
                textAlign: 'center',
            },
            '& input': {
                width: 50,
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
                fontFamily: ['Myriad Pro', 'Vegur', 'GenYoMin TW', 'HiraMinProN-W6', 'serif'].join(),
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
    const { stnId } = props;
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const lineNum = useAppSelector(store => store.param.line_num);
    const stationInfo = useAppSelector(store => store.param.stn_list[stnId]);

    return (
        <ListItem style={{ justifyContent: 'center' }}>
            <div className={classes.lineNumRoot}>
                <span>{lineNum}</span>
            </div>
            <TextField
                fullWidth
                className={classes.numInput}
                value={stationInfo?.num}
                onChange={({ target: { value } }) => {
                    dispatch(updateStationNum(stnId, value));
                }}
            />
        </ListItem>
    );
};

const NameInput = (props: Props) => {
    const { stnId } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.param.style);
    const { name } = useAppSelector(store => store.param.stn_list[stnId]);
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
                onChange={({ target: { value } }) => dispatch(updateStationName(stnId, [value, name[1]]))}
                autoFocus
            />
            <TextField
                fullWidth
                placeholder={t('editor.en')}
                className={`${classes.nameInputEN} ${rmgStyle === RmgStyle.MTR ? classes['nameInputEN-mtr'] : ''}`}
                value={name[1]}
                onChange={({ target: { value } }) => dispatch(updateStationName(stnId, [name[0], value]))}
                helperText={t('editor.backslashToWrap')}
            />
        </ListItem>
    );
};

const SecondaryNameInput = (props: Props) => {
    const { stnId } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const { secondaryName } = useAppSelector(store => store.param.stn_list[stnId]);
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
                            dispatch(updateStationSecondaryName(stnId, checked ? ['', ''] : false));
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
                            onChange={({ target: { value } }) => {
                                dispatch(
                                    updateStationSecondaryName(stnId, [value, secondaryName ? secondaryName[1] : ''])
                                );
                            }}
                        />
                        <TextField
                            fullWidth
                            placeholder={t('editor.en')}
                            value={secondaryName ? secondaryName[1] : ''}
                            onChange={({ target: { value } }) => {
                                dispatch(
                                    updateStationSecondaryName(stnId, [secondaryName ? secondaryName[0] : '', value])
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
