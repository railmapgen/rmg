import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    createStyles,
    Divider,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Select,
} from '@material-ui/core';
import { formatStnName } from '../../../utils';
import { ParamContext } from '../../../context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';

const useStyles = makeStyles(() =>
    createStyles({
        select: {
            width: 166,
        },
    })
);

function StationEditBranchTab(props: { stnId: string }) {
    const { t } = useTranslation();

    return (
        <List>
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.left')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={props.stnId} direction="left" />
            <Divider />
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.right')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={props.stnId} direction="right" />
        </List>
    );
}

export default StationEditBranchTab;

interface BranchSelectSetProps {
    stnId: string;
    direction: 'left' | 'right';
}

const BranchSelectSet = (props: BranchSelectSetProps) => {
    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const { param } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];

    return React.useMemo(
        () => (
            <>
                <BranchTypeItem {...props} />
                {branchEntry[0] && (
                    <>
                        <BranchFirstItem {...props} />
                        {rmgStyle !== RmgStyle.SHMetro && <BranchPosItem {...props} />}
                    </>
                )}
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, props.direction, branchEntry[0]]
    );
};

interface ItemProps {
    stnId: string;
    direction: 'left' | 'right';
}

const BranchTypeItem = (props: ItemProps) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchType = event.target.value as 'na' | 'through' | 'nonthrough';
        if (branchType === 'na') {
            // no changes
            return;
        } else if (branchType === branchEntry[0]) {
            // no changes
            return;
        } else {
            dispatch({
                type: 'UPDATE_STATION_BRANCH_TYPE',
                stnId: props.stnId,
                direction: props.direction,
                branchType,
            });
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>merge_type</Icon>
                </ListItemIcon>
                <ListItemText primary={t('stations.edit.branch.type.title')} />
                <Select native onChange={handleChange} value={branchEntry[0] || 'na'} className={classes.select}>
                    <option value="na" disabled={branchEntry.length !== 0}>
                        {t('stations.edit.branch.type.na')}
                    </option>
                    <option value="through" disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.through')}
                    </option>
                    <option value="nonthrough" disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.nonThrough')}
                    </option>
                </Select>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[0]]
    );
};

const BranchFirstItem = (props: ItemProps) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const { param, dispatch } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];
    const neighbours = props.direction === 'left' ? stnInfo.parents : stnInfo.children;

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchFirst = event.target.value as string;
        if (branchEntry[1] === branchFirst) {
            // no changes
            return;
        } else {
            let branchEndId = branchFirst;
            let branchEndFirst: string;
            let stnList = param.stn_list;
            if (props.direction === 'right') {
                while (stnList[branchEndId].parents.length === 1) {
                    branchEndId = stnList[branchEndId].children[0];
                }
                branchEndFirst = stnList[branchEndId].parents[neighbours.indexOf(branchFirst)];
            } else {
                while (stnList[branchEndId].children.length === 1) {
                    branchEndId = stnList[branchEndId].parents[0];
                }
                branchEndFirst = stnList[branchEndId].children[neighbours.indexOf(branchFirst)];
            }
            dispatch({
                type: 'UPDATE_STATION_BRANCH_FIRST',
                branches: [
                    {
                        stnId: props.stnId,
                        direction: props.direction,
                        first: branchFirst,
                    },
                    {
                        stnId: branchEndId,
                        direction: props.direction === 'left' ? 'right' : 'left',
                        first: branchEndFirst,
                    },
                ],
            });
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon style={{ transform: props.direction === 'left' ? 'scale(-1)' : 'scale(1)' }}>share</Icon>
                </ListItemIcon>
                <ListItemText primary={t('stations.edit.branch.first')} />
                <Select
                    native
                    onChange={handleChange}
                    value={branchEntry[1] || neighbours[0]}
                    className={classes.select}
                >
                    {neighbours.map(stnId => (
                        <option key={stnId} value={stnId}>
                            {formatStnName(param.stn_list[stnId], rmgStyle)}
                        </option>
                    ))}
                </Select>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[1], neighbours.toString()]
    );
};

const BranchPosItem = (props: ItemProps) => {
    // mount only if branchEntry[0] is not undefined

    const { t } = useTranslation();
    const classes = useStyles();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction] as ['through' | 'nonthrough', string];
    const neighbours = props.direction === 'left' ? stnInfo.parents : stnInfo.children;

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchPos: 0 | 1 = event.target.value === 'lower' ? 1 : 0;
        if (neighbours.indexOf(branchEntry[1]) === branchPos) {
            // no changes
            return;
        } else {
            let branchEndId = branchEntry[1];
            let stnList = param.stn_list;
            if (props.direction === 'right') {
                while (stnList[branchEndId].parents.length === 1) {
                    branchEndId = stnList[branchEndId].children[0];
                }
                dispatch({
                    type: 'UPDATE_STATION_BRANCH_POS',
                    right: props.stnId,
                    left: branchEndId,
                });
            } else {
                while (stnList[branchEndId].children.length === 1) {
                    branchEndId = stnList[branchEndId].parents[0];
                }
                dispatch({
                    type: 'UPDATE_STATION_BRANCH_POS',
                    left: props.stnId,
                    right: branchEndId,
                });
            }
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>swap_vert</Icon>
                </ListItemIcon>
                <ListItemText primary={t('stations.edit.branch.pos.title')} />
                <Select
                    native
                    onChange={handleChange}
                    value={neighbours.indexOf(branchEntry[1]) === 1 ? 'lower' : 'upper'}
                    className={classes.select}
                >
                    {['upper', 'lower'].map(p => (
                        <option key={p} value={p}>
                            {t('stations.edit.branch.pos.' + p)}
                        </option>
                    ))}
                </Select>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[1], neighbours.toString()]
    );
};
