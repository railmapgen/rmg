import React from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../redux';
import { BranchStyle, Direction, RmgStyle } from '../../../constants/constants';
import {
    flipStationBranchPositionLegacy,
    updateStationBranchFirstStationLegacy,
    UpdateStationBranchFirstStationLegacyArgType,
    updateStationBranchType,
} from '../../../redux/param/action';

const useStyles = makeStyles(() =>
    createStyles({
        select: {
            width: 166,
        },
    })
);

export default function StationEditBranchTab(props: { stnId: string }) {
    const { stnId } = props;
    const { t } = useTranslation();

    return (
        <List>
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.left')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={stnId} direction={Direction.left} />
            <Divider />
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.right')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={stnId} direction={Direction.right} />
        </List>
    );
}

interface BranchSelectSetProps {
    stnId: string;
    direction: Direction;
}

const BranchSelectSet = (props: BranchSelectSetProps) => {
    const { stnId, direction } = props;
    const rmgStyle = useAppSelector(store => store.param.style);
    const branchEntry = useAppSelector(store => store.param.stn_list[stnId].branch[direction]);

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
        [stnId, direction, branchEntry[0]]
    );
};

interface ItemProps {
    stnId: string;
    direction: Direction;
}

const BranchTypeItem = (props: ItemProps) => {
    const { stnId, direction } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const branchEntry = useAppSelector(store => store.param.stn_list[stnId].branch[direction]);

    const handleChange = ({ target: { value } }: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchType = value as 'na' | BranchStyle;
        if (branchType === 'na') {
            // no changes
            return;
        } else if (branchType === branchEntry[0]) {
            // no changes
            return;
        } else {
            dispatch(updateStationBranchType(stnId, direction, branchType));
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
                    <option value={BranchStyle.through} disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.through')}
                    </option>
                    <option value={BranchStyle.nonThrough} disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.nonThrough')}
                    </option>
                </Select>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stnId, branchEntry[0]]
    );
};

const BranchFirstItem = (props: ItemProps) => {
    const { stnId, direction } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.param.style);
    const stnList = useAppSelector(store => store.param.stn_list);
    const stnInfo = stnList[stnId];
    const branchEntry = stnInfo.branch[direction];
    const neighbours = direction === Direction.left ? stnInfo.parents : stnInfo.children;

    const handleChange = ({ target: { value } }: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchFirst = value as string;
        if (branchEntry[1] === branchFirst) {
            // no changes
            return;
        } else {
            let branchEndId = branchFirst;
            let branchEndFirst: string;
            if (direction === Direction.right) {
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
            const branchesArg: [
                UpdateStationBranchFirstStationLegacyArgType,
                UpdateStationBranchFirstStationLegacyArgType
            ] = [
                { stnId, direction, first: branchFirst },
                {
                    stnId: branchEndId,
                    direction: direction === Direction.left ? Direction.right : Direction.left,
                    first: branchEndFirst,
                },
            ];
            dispatch(updateStationBranchFirstStationLegacy(branchesArg));
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon style={{ transform: direction === Direction.left ? 'scale(-1)' : 'scale(1)' }}>share</Icon>
                </ListItemIcon>
                <ListItemText primary={t('stations.edit.branch.first')} />
                <Select
                    native
                    onChange={handleChange}
                    value={branchEntry[1] || neighbours[0]}
                    className={classes.select}
                >
                    {neighbours.map(id => (
                        <option key={id} value={id}>
                            {formatStnName(stnList[id], rmgStyle)}
                        </option>
                    ))}
                </Select>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stnId, branchEntry[1], neighbours.toString()]
    );
};

const BranchPosItem = (props: ItemProps) => {
    const { stnId, direction } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const stnList = useAppSelector(store => store.param.stn_list);
    const stnInfo = stnList[stnId];
    const branchEntry = stnInfo.branch[direction] as [BranchStyle, string]; // mount only if branchEntry[0] is not undefined
    const neighbours = direction === Direction.left ? stnInfo.parents : stnInfo.children;

    const handleChange = ({ target: { value } }: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        let branchPos: 0 | 1 = value === 'lower' ? 1 : 0;
        if (neighbours.indexOf(branchEntry[1]) === branchPos) {
            // no changes
            return;
        } else {
            let branchEndId = branchEntry[1];
            if (direction === Direction.right) {
                while (stnList[branchEndId].parents.length === 1) {
                    branchEndId = stnList[branchEndId].children[0];
                }
                dispatch(flipStationBranchPositionLegacy(branchEndId, stnId));
            } else {
                while (stnList[branchEndId].children.length === 1) {
                    branchEndId = stnList[branchEndId].parents[0];
                }
                dispatch(flipStationBranchPositionLegacy(stnId, branchEndId));
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
        [stnId, branchEntry[1], neighbours.toString()]
    );
};
