import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, Icon, TextField, MenuItem, DialogActions, Button } from '@material-ui/core';
import { StationInfo } from '../../types';
import { formatStnName, setParams } from '../../utils';
import { getYShareMTR } from '../../methods';
import { addStation } from './utils';
import { RMGLineGZ } from '../../Line/LineGZ';
import { RMGLineHK } from '../../Line/LineHK';

const newBranchPossibleEnd = (prep: 'before' | 'after', pivot: string, stnList: { [stnId: string]: StationInfo }) => {
    let res: string[] = [];
    if (prep == 'before') {
        while (stnList[pivot].parents.length == 1) {
            pivot = stnList[pivot].parents[0];
            res.unshift(pivot);
        }
        res.pop();
    } else {
        while (stnList[pivot].children.length == 1) {
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
            if (y == 0) {
                // 1 -> 1
                let state: string[] | 0 = newBranchPossibleEnd(prep, pivot, stnList);
                state = (state.length) ? state : [];
                return [1, 0, 0, state, state];
                // [1,0,0,1,1];
            } else if (y < 0) {
                if (prep == 'before') {
                    return [stnList[stnList[pivot].parents[0]].children.length - 1,
                        0, 1, [], []
                    ];
                } else {
                    return [stnList[stnList[pivot].children[0]].parents.length - 1,
                        0, 1, [], []
                    ];
                }
            } else {
                if (prep == 'before') {
                    return [stnList[stnList[pivot].parents[0]].children.length - 1,
                        1, 0, [], []
                    ];
                } else {
                    return [stnList[stnList[pivot].children[0]].parents.length - 1,
                        1, 0, [], []
                    ];
                }
            }
    }
    return [0, 0, 0, [], []];
};

interface StationAddDialogProps {
    open: boolean;
    stnList: {
        [stnId: string]: StationInfo;
    };
    tpo: string[];
    onClose: (action: 'close' | string) => void;
    paramUpdate: (key, data) => void;
}

const StationAddDialog = (props: StationAddDialogProps) => {
    const { t } = useTranslation();

    const allLocs = {
        centre: t('stations.add.centre'),
        upper: t('stations.add.upper'),
        lower: t('stations.add.lower'),
        newupper: t('stations.add.newUpper'),
        newlower: t('stations.add.newLower'),
    };

    const [prep, setPrep] = React.useState('before' as 'before' | 'after');
    const [pivot, setPivot] = React.useState(props.tpo[0]);
    const [loc, setLoc] = React.useState(Object.keys(allLocs)[0]);
    const [locOK, setLocOK] = React.useState(Array(5).fill(true) as boolean[]);

    const [end, setEnd] = React.useState('');
    const [endList, setEndList] = React.useState([] as string[]);

    // Hook for updating loc list and end lists when pivot changed
    const newLocs = React.useMemo(() => newStnPossibleLoc(prep, pivot, props.stnList), [prep, pivot, props.stnList]);
    React.useEffect(() => {
        console.log('new')
        setLocOK(newLocs.map(p => typeof p === 'number' ? Boolean(p) : Boolean(p.length)));
        setEndList(newLocs[3]);
    }, [newLocs.toString()]);

    // Hook for updating loc selection (first available) when locOK list changed
    React.useEffect(() => {
        setLoc(Object.keys(allLocs)[locOK.indexOf(true)]);
    }, [locOK]);

    // Hook for updating end selection when end list changed
    React.useEffect(() => {
        if (endList.length === 0) return;
        setEnd(endList[0]);
    }, [endList]);

    // Hook for setting new pivot in case of previous one being deleted
    React.useEffect(() => {
        if (!(pivot in props.stnList)) setPivot(props.tpo[0]);
    }, [Object.keys(props.stnList).toString()]);

    const handleClick = (action: string) => {
        if (action === 'close') {
            props.onClose('close');
        } else {
            let [newId, res] = addStation(
                prep as 'before' | 'after',
                pivot,
                loc as 'centre' | 'upper' | 'lower' | 'newupper' | 'newlower',
                end as string,
                props.stnList
            );
            // let [newId, newInfo] = window.myLine.addStn(action[0] as 'before' | 'after', action[1], action[2], action[3]);

            // this.props.paramUpdate('stn_list', getParams().stn_list);
            props.paramUpdate('stn_list', res);

            // handle redrawing (will be removed)
            setParams('stn_list', res);
            Object.keys(res).forEach(stnId => {
                window.myLine.stations[stnId] = window.myLine._initStnInstance(stnId, res[stnId]);
            });
            Object.keys(res).forEach(stnId => {
                if (['linestart', 'lineend'].includes(stnId)) return;
                window.myLine._updateStnInstance(stnId);
            });

            $('#stn_icons, #line_main, #line_pass').empty();
            window.myLine.drawStns();
            window.myLine.drawLine();
            window.myLine.drawStrip();
            window.myLine.drawDestInfo();

            if (window.urlParams.get('style') === 'gzmtr') {
                (window.myLine as RMGLineGZ).loadLineNum();
                (window.myLine as RMGLineGZ).loadDirection();
            }
            if (window.urlParams.get('style') === 'mtr') {
                (window.myLine as RMGLineHK).updateStnNameBg();
            }

            props.onClose(newId);
        }
    };

    return (
        <Dialog open={props.open} onClose={() => handleClick('close')}>
            <DialogTitle>{t('stations.add.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>control_camera</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{ width: '100%' }}
                            variant="outlined"
                            label={t('stations.add.prep')}
                            onChange={(e) => setPrep(e.target.value as 'before' | 'after')}
                            value={prep} >
                            <MenuItem key="before" value="before">{t('stations.add.before')}</MenuItem>
                            <MenuItem key="after" value="after">{t('stations.add.after')}</MenuItem>
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>near_me</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{ width: '100%' }}
                            variant="outlined"
                            label={t('stations.add.pivot')}
                            onChange={(e) => setPivot(e.target.value)}
                            value={pivot} >
                            {props.tpo.map(stnId => (
                                <MenuItem key={stnId} value={stnId}>
                                    {formatStnName(props.stnList[stnId])}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>share</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{ width: '100%' }}
                            variant="outlined"
                            label={t('stations.add.loc')}
                            onChange={(e) => setLoc(e.target.value)}
                            value={loc} >
                            {Object.keys(allLocs).map((key, idx) => (
                                <MenuItem key={key} value={key} disabled={!locOK[idx]}>{allLocs[key]}</MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem style={{ display: ['newupper', 'newlower'].includes(loc) ? 'flex' : 'none' }}>
                        <ListItemIcon>
                            <Icon>undo</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{ width: '100%' }}
                            variant="outlined"
                            label={t('stations.add.end')}
                            onChange={(e) => setEnd(e.target.value)}
                            value={end} >
                            {endList.map(stnId => (
                                <MenuItem key={stnId} value={stnId}>
                                    {formatStnName(props.stnList[stnId])}
                                </MenuItem>
                            ))}
                        </TextField>
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
    )
};

export default StationAddDialog;