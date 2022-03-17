import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    DialogActions,
    Button,
    makeStyles,
    createStyles,
    ListItemText,
    Select,
    Divider,
} from '@material-ui/core';
import { formatStnName } from '../../utils';
import { getYShareMTR } from '../../methods';
import { useAppDispatch, useAppSelector } from '../../redux';
import { StationDict, StationInfo } from '../../constants/constants';
import { addStationLegacy } from '../../redux/param/add-station-action';

const newBranchPossibleEnd = (prep: 'before' | 'after', pivot: string, stnList: StationDict) => {
    let res: string[] = [];
    if (prep === 'before') {
        while (stnList[pivot].parents.length === 1) {
            pivot = stnList[pivot].parents[0];
            res.unshift(pivot);
        }
        res.pop();
    } else {
        while (stnList[pivot].children.length === 1) {
            pivot = stnList[pivot].children[0];
            res.push(pivot);
        }
        res.shift();
    }
    return res;
};

const newStnPossibleLoc = (
    prep: 'before' | 'after',
    pivot: string,
    stnList: { [stnId: string]: StationInfo }
): [number, number, number, string[], string[]] => {
    let deg = stnList[pivot] ? stnList[pivot][prep === 'before' ? 'parents' : 'children'].length : 0;
    switch (deg) {
        case 2:
            // 1 -> 2
            return [1, 1, 1, [], []];
        case 1:
            let y = getYShareMTR(pivot, stnList);
            if (y === 0) {
                // 1 -> 1
                let state: string[] | 0 = newBranchPossibleEnd(prep, pivot, stnList);
                state = state.length ? state : [];
                return [1, 0, 0, state, state];
                // [1,0,0,1,1];
            } else if (y < 0) {
                if (prep === 'before') {
                    return [stnList[stnList[pivot].parents[0]].children.length - 1, 0, 1, [], []];
                } else {
                    return [stnList[stnList[pivot].children[0]].parents.length - 1, 0, 1, [], []];
                }
            } else {
                if (prep === 'before') {
                    return [stnList[stnList[pivot].parents[0]].children.length - 1, 1, 0, [], []];
                } else {
                    return [stnList[stnList[pivot].children[0]].parents.length - 1, 1, 0, [], []];
                }
            }
    }
    return [0, 0, 0, [], []];
};

const useStyles = makeStyles(() =>
    createStyles({
        dialogContent: {
            padding: 8,
        },
        select: {
            width: 166,
            marginLeft: 8,
        },
    })
);

interface StationAddDialogProps {
    open: boolean;
    onClose: (action: 'close' | string) => void;
}

export default React.memo(
    function StationAddDialog(props: StationAddDialogProps) {
        const { t } = useTranslation();
        const classes = useStyles();
        const dispatch = useAppDispatch();

        const rmgStyle = useAppSelector(store => store.param.style);
        const stnList = useAppSelector(store => store.param.stn_list);
        const { tpo } = useAppSelector(store => store.helper);

        const allLocs = {
            centre: t('stations.add.centre'),
            upper: t('stations.add.upper'),
            lower: t('stations.add.lower'),
            newupper: t('stations.add.newUpper'),
            newlower: t('stations.add.newLower'),
        };

        const [prep, setPrep] = React.useState('before' as 'before' | 'after');
        const [pivot, setPivot] = React.useState(tpo[0]);
        const [loc, setLoc] = React.useState(Object.keys(allLocs)[0]);
        const [locOK, setLocOK] = React.useState(Array(5).fill(true) as boolean[]);

        const [end, setEnd] = React.useState('');
        const [endList, setEndList] = React.useState([] as string[]);

        // Hook for updating loc list and end lists when pivot changed
        const newLocs = useMemo(() => newStnPossibleLoc(prep, pivot, stnList), [prep, pivot, stnList]);
        useEffect(
            () => {
                setLocOK(newLocs.map(p => (typeof p === 'number' ? Boolean(p) : Boolean(p.length))));
                setEndList(newLocs[3]);
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [newLocs.toString()]
        );

        // Hook for updating loc selection (first available) when locOK list changed
        useEffect(
            () => setLoc(Object.keys(allLocs)[locOK.indexOf(true)]),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [locOK]
        );

        // Hook for updating end selection when end list changed
        useEffect(() => {
            if (endList.length === 0) return;
            setEnd(endList[0]);
        }, [endList]);

        // Hook for setting new pivot in case of previous one being deleted
        useEffect(
            () => {
                if (!(pivot in stnList)) setPivot(tpo[0]);
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [Object.keys(stnList).toString()]
        );

        const handleClick = (action: string) => {
            if (action === 'close') {
                props.onClose('close');
            } else {
                const newId = dispatch(addStationLegacy(prep, pivot, loc as any, end));
                props.onClose(newId);
            }
        };

        return (
            <Dialog open={props.open} onClose={() => handleClick('close')}>
                <DialogTitle>{t('stations.add.title')}</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <List component="div" disablePadding>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>control_camera</Icon>
                            </ListItemIcon>
                            <ListItemText primary={t('stations.add.prep')} />
                            <Select
                                native
                                onChange={e => setPrep(e.target.value as 'before' | 'after')}
                                value={prep}
                                className={classes.select}
                            >
                                {['before', 'after'].map(p => (
                                    <option key={p} value={p}>
                                        {t('stations.add.' + p)}
                                    </option>
                                ))}
                            </Select>
                        </ListItem>
                        <Divider variant="middle" />
                        <ListItem>
                            <ListItemIcon>
                                <Icon>near_me</Icon>
                            </ListItemIcon>
                            <ListItemText primary={t('stations.add.pivot')} />
                            <Select
                                native
                                onChange={e => setPivot(e.target.value as string)}
                                value={pivot}
                                className={classes.select}
                            >
                                {tpo.map(stnId => (
                                    <option key={stnId} value={stnId}>
                                        {formatStnName(stnList[stnId], rmgStyle)}
                                    </option>
                                ))}
                            </Select>
                        </ListItem>
                        <Divider variant="middle" />
                        <ListItem>
                            <ListItemIcon>
                                <Icon>share</Icon>
                            </ListItemIcon>
                            <ListItemText primary={t('stations.add.loc')} />
                            <Select
                                native
                                onChange={e => setLoc(e.target.value as string)}
                                value={loc}
                                className={classes.select}
                            >
                                {(Object.keys(allLocs) as (keyof typeof allLocs)[]).map((key, idx) => (
                                    <option key={key} value={key} disabled={!locOK[idx]}>
                                        {allLocs[key]}
                                    </option>
                                ))}
                            </Select>
                        </ListItem>
                        <Divider
                            variant="middle"
                            style={{ display: ['newupper', 'newlower'].includes(loc) ? 'flex' : 'none' }}
                        />
                        <ListItem style={{ display: ['newupper', 'newlower'].includes(loc) ? 'flex' : 'none' }}>
                            <ListItemIcon>
                                <Icon>undo</Icon>
                            </ListItemIcon>
                            <ListItemText primary={t('stations.add.end')} />
                            <Select
                                native
                                onChange={e => setEnd(e.target.value as string)}
                                value={end}
                                className={classes.select}
                            >
                                {endList.map(stnId => (
                                    <option key={stnId} value={stnId}>
                                        {formatStnName(stnList[stnId], rmgStyle)}
                                    </option>
                                ))}
                            </Select>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClick('close')} color="primary">
                        {t('dialog.cancel')}
                    </Button>
                    <Button onClick={() => handleClick('accept')} color="primary" autoFocus>
                        {t('dialog.ok')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    },
    (prevProps, nextProps) => prevProps.open === nextProps.open
);
