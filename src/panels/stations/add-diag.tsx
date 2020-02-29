import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, Icon, TextField, MenuItem, DialogActions, Button } from '@material-ui/core';
import { StationInfo } from '../../types';
import { formatStnName } from '../../utils';

interface StationAddDialogProps {
    open: boolean;
    stnList: {
        [stnId: string]: StationInfo;
    };
    onClose: (action: 'close' | string[]) => void;
}

export default (props: StationAddDialogProps) => {
    const {t, i18n} = useTranslation();

    const allLocs = {
        centre: t('stations.add.centre'), 
        upper: t('stations.add.upper'), 
        lower: t('stations.add.lower'), 
        newupper: t('stations.add.newUpper'), 
        newlower: t('stations.add.newLower'), 
    };
    
    const [prep, setPrep] = React.useState('before');
    const [pivot, setPivot] = React.useState(
        Object.keys(props.stnList).filter(stnId => !['linestart','lineend'].includes(stnId))[0]
    );
    const [loc, setLoc] = React.useState(Object.keys(allLocs)[0]);
    const [locOK, setLocOK] = React.useState(Array(5).fill(true) as boolean[]);

    const [end, setEnd] = React.useState('');
    const [endList, setEndList] = React.useState([] as string[]);

    // Hook for updating loc list and end lists when pivot changed
    React.useEffect(() => {
        let possibleLocs = window.myLine.newStnPossibleLoc(
            prep as 'before' | 'after', 
            pivot
        );
        console.log(possibleLocs);
        setLocOK(possibleLocs.map(p => typeof p === 'number' ? Boolean(p) : Boolean(p.length)));
        setEndList(possibleLocs[3]);
    }, [pivot, prep]);

    // Hook for updating loc selection (first available) when locOK list changed
    React.useEffect(() => {
        setLoc(Object.keys(allLocs)[locOK.indexOf(true)]);
    }, [locOK]);

    // Hook for updating end selection when end list changed
    React.useEffect(() => {
        if (endList.length === 0) return;
        setEnd(endList[0]);
    }, [endList]);

    const handleClick = (action: string) => {
        if (action === 'close') {
            props.onClose('close');
        } else {
            props.onClose([
                prep, pivot, loc, end
            ]);
        }
    }

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
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.prep')}
                            onChange={(e) => setPrep(e.target.value)}
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
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.pivot')}
                            onChange={(e) => setPivot(e.target.value)}
                            value={pivot} >
                            {window.myLine.tpo.map(stnId => (
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
                            style={{width: '100%'}}
                            variant="outlined"
                            label={t('stations.add.loc')}
                            onChange={(e) => setLoc(e.target.value)}
                            value={loc} >
                            {Object.keys(allLocs).map((key, idx) => (
                                <MenuItem key={key} value={key} disabled={!locOK[idx]}>{allLocs[key]}</MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem style={{display: ['newupper','newlower'].includes(loc) ? 'flex' : 'none'}}>
                        <ListItemIcon>
                            <Icon>undo</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
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
}