import * as React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { List, ListItem, ListItemText, Divider, Icon, TextField, MenuItem, ListItemIcon } from '@material-ui/core';
import { BranchInfo, StationInfo } from '../../../types';
import { formatStnName } from '../../../utils';

interface StationEditBranchTabProps {
    t: any;
    branch: BranchInfo;
    parents: string[];
    children: string[];
    stnList: {
        [stnId: string]: StationInfo;
    };
    onUpdate: (value: any, field: string) => void;
}

class StationEditBranchTab extends React.Component<StationEditBranchTabProps> {
    constructor(props) {
        super(props);
    }

    handleUpdate(direc: 'left' | 'right', action: 'close' | {type?: string, first?: string, pos?: string}) {
        if (action === 'close') {
            return;
        } else if ('type' in action) {
            let _val = action.type;
            if (_val === 'na') {
                // alway na
                return;
            } else if (this.props.branch[direc][0] === _val) {
                // no changes
                return;
            } else {
                let newBranch = {
                    ...this.props.branch, 
                    [direc]: (this.props.branch[direc] as string[])
                        .map((val,i) => i===0 ? _val : val)
                };
                this.props.onUpdate(newBranch, 'type.'+direc);
            }
        } else if ('first' in action) {
            let _val = action.first;
            if (this.props.branch[direc][1] === _val) {
                // no changes
                return;
            } else {
                let newBranch = {
                    ...this.props.branch, 
                    [direc]: (this.props.branch[direc] as string[])
                        .map((val,i) => i===1 ? _val : val)
                };
                this.props.onUpdate(newBranch, 'first.'+direc);
            }
        } else if ('pos' in action) {
            let _val = action.pos==='upper' ? 0 : 1;
            this.props.onUpdate(_val, 'pos.'+direc);
        }
    }

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemText>
                        <h3 style={{margin: 0}}>{this.props.t('stations.edit.branch.left')}</h3>
                    </ListItemText>
                </ListItem>
                <BranchSelectSet
                    neighbours={this.props.parents}
                    branch={this.props.branch}
                    direction="left"
                    stnList={this.props.stnList}
                    onUpdate={(action) => this.handleUpdate('left', action)}
                 />
                <Divider />
                <ListItem>
                    <ListItemText>
                        <h3 style={{margin: 0}}>{this.props.t('stations.edit.branch.right')}</h3>
                    </ListItemText>
                </ListItem>
                <BranchSelectSet
                    neighbours={this.props.children}
                    branch={this.props.branch}
                    direction="right"
                    stnList={this.props.stnList}
                    onUpdate={(action) => this.handleUpdate('right', action)}
                 />
            </List>
        )
    }
}

export default withTranslation()(StationEditBranchTab);

interface BranchSelectSetProps {
    neighbours: string[];
    branch: BranchInfo;
    direction: 'left' | 'right';
    stnList: {
        [stnId: string]: StationInfo;
    }
    onUpdate: (action: 'close' | {type?: string, first?: string, pos?: string}) => void;
}

function BranchSelectSet(props: BranchSelectSetProps) {
    const { t } = useTranslation();
    const branchEntry = props.branch[props.direction];

    return (
        <div>
            <ListItem>
                <ListItemIcon>
                    <Icon>merge_type</Icon>
                </ListItemIcon>
                <TextField select
                    style={{width: '100%'}}
                    variant="outlined"
                    label={t('stations.edit.branch.type.title')}
                    onChange={(e) => props.onUpdate({type: e.target.value})}
                    value={branchEntry[0] || 'na'} >
                    <MenuItem key="na" value="na" disabled={branchEntry.length!==0}>
                        {t('stations.edit.branch.type.na')}
                    </MenuItem>
                    <MenuItem key="through" value="through" disabled={branchEntry.length===0}>
                        {t('stations.edit.branch.type.through')}
                    </MenuItem>
                    <MenuItem key="nonthrough" value="nonthrough" disabled={branchEntry.length===0}>
                        {t('stations.edit.branch.type.nonThrough')}
                    </MenuItem>
                </TextField>
            </ListItem>
            {branchEntry[0] && <>
                <ListItem>
                    <ListItemIcon>
                        <Icon style={{transform: props.direction==='left' ? 'scale(-1)' : 'scale(1)'}}>
                            share
                        </Icon>
                    </ListItemIcon>
                    <TextField select
                        style={{width: '100%'}}
                        variant="outlined"
                        label={t('stations.edit.branch.first')}
                        onChange={(e) => props.onUpdate({first: e.target.value})}
                        value={branchEntry[1] || props.neighbours[0]} >
                        {props.neighbours.map(stnId => (
                            <MenuItem key={stnId} value={stnId}>
                                {formatStnName(props.stnList[stnId])}
                            </MenuItem>
                        ))}
                    </TextField>
                </ListItem>
                {window.urlParams.get('style')!=='shmetro' && <ListItem>
                    <ListItemIcon>
                        <Icon>swap_vert</Icon>
                    </ListItemIcon>
                    <TextField select
                        style={{width: '100%'}}
                        variant="outlined"
                        label={t('stations.edit.branch.pos.title')}
                        onChange={(e) => props.onUpdate({pos: e.target.value})}
                        value={props.neighbours.indexOf(branchEntry[1])===1 ? 'lower' : 'upper' } >
                        <MenuItem key="upper" value="upper">
                            {t('stations.edit.branch.pos.upper')}
                        </MenuItem>
                        <MenuItem key="lower" value="lower">
                            {t('stations.edit.branch.pos.lower')}
                        </MenuItem>
                    </TextField>
                </ListItem>}
            </>}
        </div>
    )
}