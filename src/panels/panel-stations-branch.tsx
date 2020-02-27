import * as React from 'react';
import { List, ListItem, ListItemText, Divider, Icon, TextField, MenuItem, ListItemIcon } from '@material-ui/core';
import { BranchInfo, StationInfo } from '../types';

interface StationEditBranchTabProps {
    branch: BranchInfo;
    parents: string[];
    children: string[];
    stnList: {
        [stnId: string]: StationInfo;
    };
    onUpdate: (value: any, field: string) => void;
}

export default class StationEditBranchTab extends React.Component<StationEditBranchTabProps> {
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
                        <h3 style={{margin: 0}}>Branch on the Left</h3>
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
                        <h3 style={{margin: 0}}>Branch on the Right</h3>
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

interface BranchSelectSetProps {
    neighbours: string[];
    branch: BranchInfo;
    direction: 'left' | 'right';
    stnList: {
        [stnId: string]: StationInfo;
    }
    onUpdate: (action: 'close' | {type?: string, first?: string, pos?: string}) => void;
}

class BranchSelectSet extends React.Component<BranchSelectSetProps> {
    constructor(props) {
        super(props);
    }

    render() {
        let branchEntry = this.props.branch[this.props.direction];
        return (
            <div>
                <ListItem>
                    <ListItemIcon>
                        <Icon>merge_type</Icon>
                    </ListItemIcon>
                    <TextField select
                        style={{width: '100%'}}
                        variant="outlined"
                        label="Branch Type"
                        onChange={(e) => this.props.onUpdate({type: e.target.value})}
                        value={branchEntry[0] || 'na'} >
                        <MenuItem key="na" value="na" disabled={branchEntry.length!==0}>
                            (No Branches Found)
                        </MenuItem>
                        <MenuItem key="through" value="through" disabled={branchEntry.length===0}>
                            Through
                        </MenuItem>
                        <MenuItem key="nonthrough" value="nonthrough" disabled={branchEntry.length===0}>
                            Non-through
                        </MenuItem>
                    </TextField>
                </ListItem>
                {branchEntry[0] && <div>
                    <ListItem>
                        <ListItemIcon>
                            <Icon style={{transform: this.props.direction==='left' ? 'scale(-1)' : 'scale(1)'}}>
                                share
                            </Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label="First Station on Branch"
                            onChange={(e) => this.props.onUpdate({first: e.target.value})}
                            value={branchEntry[1] || this.props.neighbours[0]} >
                            {this.props.neighbours.map(stnId => (
                                <MenuItem key={stnId} value={stnId}>
                                    {this.props.stnList[stnId].name.join()}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>swap_vert</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label="Branch Position"
                            onChange={(e) => this.props.onUpdate({pos: e.target.value})}
                            value={this.props.neighbours.indexOf(branchEntry[1])===1 ? 'lower' : 'upper' } >
                            <MenuItem key="upper" value="upper">
                                Upper
                            </MenuItem>
                            <MenuItem key="lower" value="lower">
                                Lower
                            </MenuItem>
                        </TextField>
                    </ListItem>
                </div>}
            </div>
        )
    }
}