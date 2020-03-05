import * as React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Icon, Divider, Button, ListItemIcon, RadioGroup, FormControlLabel, Radio, Switch, Chip, withStyles, Dialog, DialogTitle, DialogContent, Avatar, TextField, DialogActions, Tooltip } from '@material-ui/core';
import { StationTransfer, InterchangeInfo, Name } from '../../../types';
import ColourDialog from '../../colour-diag';
import NameListItems from './name-list-items';

interface StationEditInterchangeTabProps {
    t: any;
    stnTrans: StationTransfer;
    onUpdate: (trans: StationTransfer) => void;
}

interface StationEditInterchangeTabState {
    osiNameDialogOpened: boolean;
}

class StationEditInterchangeTab extends React.Component<StationEditInterchangeTabProps, StationEditInterchangeTabState> {
    constructor(props) {
        super(props);

        this.state = {
            osiNameDialogOpened: false,
        }
    }

    addClick(index: number) {
        let ns = this.props.stnTrans.info.map(inf => inf.length);
        if (ns.length === 1) {ns[1] = 0;}
        ns[index] += 1;
        let changeType: string;
        if (ns[0] === 3 && ns[1] === 0) {
            changeType = 'int3'; // was int4
        } else if (ns[0] === 2 && ns[1] === 1) {
            changeType = 'osi31';
        } else if (ns[0] === 2 && ns[1] === 0) {
            changeType = 'int3'
        } else if (ns[0] === 1 && ns[1] === 2) {
            changeType = 'osi22'; 
        } else if (ns[0] === 1 && ns[1] === 1) {
            changeType = 'osi21';
        } else if (ns[0] === 1 && ns[1] === 0) {
            changeType = 'int2';
        } else if (ns[0] === 0 && ns[1] === 3) {
            changeType = 'osi13';
        } else if (ns[0] === 0 && ns[1] === 2) {
            changeType = 'osi12';
        } else if (ns[0] === 0 && ns[1] === 1) {
            changeType = 'osi11';
        } else if (ns[0] === 0 && ns[1] === 0) {
            changeType = 'none';
        } else {
            // sum(ns) > 3
            changeType = 'int3';
        }
        console.log(changeType);
        if (this.props.stnTrans.info.length === 1 && index === 1) {
            let transInfo = {
                ...this.props.stnTrans,
                type: changeType as any, 
                osi_names: changeType.includes('osi') ? [this.props.stnTrans.osi_names[0] || ['車站名','Stn Name']] : [], 
                info: this.props.stnTrans.info.concat([[[,,,,,,]]])
            }
            console.log(transInfo)
            this.props.onUpdate(transInfo);
        } else {
            let transInfo = {
                ...this.props.stnTrans,
                type: changeType as any, 
                osi_names: changeType.includes('osi') ? [this.props.stnTrans.osi_names[0] || ['車站名','Stn Name']] : [], 
                info: this.props.stnTrans.info
                    .map((inf, idx) => idx===index ? 
                        inf.concat([[,,,,,,]]) : inf)
            }
            console.log(transInfo)
            this.props.onUpdate(transInfo);
        }
    }

    deleteClick(index: number, i: number) {
        let ns = this.props.stnTrans.info.map(inf => inf.length);
        if (ns.length === 1) {ns[1] = 0;}
        ns[index] -= 1;
        let changeType: string;
        if (ns[0] === 3 && ns[1] === 0) {
            changeType = 'int3'; // was int4
        } else if (ns[0] === 2 && ns[1] === 1) {
            changeType = 'osi31';
        } else if (ns[0] === 2 && ns[1] === 0) {
            changeType = 'int3'
        } else if (ns[0] === 1 && ns[1] === 2) {
            changeType = 'osi22'; 
        } else if (ns[0] === 1 && ns[1] === 1) {
            changeType = 'osi21';
        } else if (ns[0] === 1 && ns[1] === 0) {
            changeType = 'int2';
        } else if (ns[0] === 0 && ns[1] === 3) {
            changeType = 'osi13';
        } else if (ns[0] === 0 && ns[1] === 2) {
            changeType = 'osi12';
        } else if (ns[0] === 0 && ns[1] === 1) {
            changeType = 'osi11';
        } else if (ns[0] === 0 && ns[1] === 0) {
            changeType = 'none';
        } else {
            // sum(ns) > 3
            changeType = 'int3';
        }
        console.log(changeType);

        let transInfo = {
            ...this.props.stnTrans, 
            type: changeType as any,
            osi_names: changeType.includes('osi') ? [this.props.stnTrans.osi_names[0] || ['車站名','Stn Name']] : [], 
            info: this.props.stnTrans.info
                .map((inf, idx) => idx===index ? inf.slice(0,i).concat(inf.slice(i+1)) : inf)
        };
        console.log(transInfo)
        this.props.onUpdate(transInfo);
    }

    chipUpdate(index: number, val: InterchangeInfo[]) {
        let transInfo = {
            ...this.props.stnTrans, 
            info: this.props.stnTrans.info
                .map((inf, idx) => idx===index ? val : inf),
        }
        console.log(transInfo)
        this.props.onUpdate(transInfo);
    }

    osiNameUpdate(value: string, index: number) {
        let transInfo = {
            ...this.props.stnTrans, 
            osi_names: [this.props.stnTrans.osi_names[0] ? 
                this.props.stnTrans.osi_names[0].map((val, idx) => idx===index ? value : val) :
                ['',''].map((val, idx) => idx===index ? value : val)
            ] as Name[],
        };
        this.props.onUpdate(transInfo);
    }

    tickDirecChange(event: React.ChangeEvent<HTMLInputElement>) {
        let transInfo = {
            ...this.props.stnTrans, 
            tick_direc: event.target.value as 'l' | 'r',
        };
        this.props.onUpdate(transInfo);
    }

    paidAreaChange(event) {
        let transInfo = {
            ...this.props.stnTrans, 
            paid_area: event.target.checked, 
        };
        this.props.onUpdate(transInfo);
    }

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemText>
                        <h3 style={{margin: 0}}>{this.props.t('stations.edit.interchange.within')}</h3>
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <Tooltip title={this.props.t('stations.edit.interchange.add')} aria-label="add">
                            <IconButton onClick={() => this.addClick(0)}>
                                <Icon>add_circle</Icon>
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <StyledInterchangeChipSet
                        intInfos={this.props.stnTrans.info[0]}
                        onDelete={(i) => this.deleteClick(0, i)}
                        onUpdate={(val) => this.chipUpdate(0, val)}/>
                </ListItem>
                {['mtr','shmetro'].includes(window.urlParams.get('style')) && <div><Divider />
                <ListItem>
                    <ListItemText>
                        <h3 style={{margin: 0}}>{this.props.t('stations.edit.interchange.osi')}</h3>
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <Button
                            variant="outlined" color="primary"
                            style={{lineHeight: '1rem', whiteSpace: 'pre', marginRight: 5}}
                            onClick={() => this.setState({osiNameDialogOpened: true})}
                        >
                            {this.props.stnTrans.osi_names[0] ? this.props.stnTrans.osi_names[0].join('\r\n') : '車站名\r\nStn Name'}
                        </Button>
                        <OSINameDialog
                            open={this.state.osiNameDialogOpened}
                            osiName={this.props.stnTrans.osi_names[0] || ['', '']}
                            onClose={() => this.setState({osiNameDialogOpened: false})}
                            onUpdate={this.osiNameUpdate.bind(this)} />
                        <Tooltip title={this.props.t('stations.edit.interchange.add')} aria-label="add">
                            <IconButton onClick={() => this.addClick(1)}>
                                <Icon>add_circle</Icon>
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <StyledInterchangeChipSet
                        intInfos={this.props.stnTrans.info[1] || []} 
                        onDelete={(i) => this.deleteClick(1, i)}
                        onUpdate={(val) => this.chipUpdate(1, val)}
                    />
                </ListItem>
                <ListItem>
                    <span>{this.props.t('stations.edit.interchange.note')}</span>
                </ListItem></div>}
                {window.urlParams.get('style')==='mtr' && <div><Divider />
                <ListItem>
                    <ListItemText>
                        <h3 style={{margin: 0}}>{this.props.t('stations.edit.interchange.settings')}</h3>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>format_textdirection_l_to_r</Icon>
                    </ListItemIcon>
                    <ListItemText 
                        primary={this.props.t('stations.edit.interchange.tickDirec.label')}
                        secondary={
                            <RadioGroup name="tick_direc" row
                                    value={this.props.stnTrans.tick_direc}
                                    onChange={this.tickDirecChange.bind(this)}
                                >
                                <FormControlLabel
                                    value="l"
                                    control={<Radio color="secondary" />}
                                    label={this.props.t('stations.edit.interchange.tickDirec.l')}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="r"
                                    control={<Radio color="secondary" />}
                                    label={this.props.t('stations.edit.interchange.tickDirec.r')}
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        }
                        secondaryTypographyProps={{['component' as any]: 'div'}} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>attach_money</Icon>
                    </ListItemIcon>
                    <ListItemText primary={this.props.t('stations.edit.interchange.paidArea')} />
                    <ListItemSecondaryAction>
                        <Switch
                            edge="end"
                            onChange={this.paidAreaChange.bind(this)}
                            checked={this.props.stnTrans.paid_area}
                        />
                    </ListItemSecondaryAction>
                </ListItem></div>}
            </List>
        )
    }
}

export default withTranslation()(StationEditInterchangeTab);

// const NameDialog = React.lazy(() => import(/* webpackChunkName: "panelNameDiag" */ './panel-name-diag'));\

const intChipSetStyles = {
    intChip: {
        borderRadius: 4.5,
        height: 40,
        lineHeight: '1rem',
        margin: 2
    }, 
    intChipText: {
        display: 'block',
        textAlign: 'center' as 'center'
    },
    intChipTextZH: {
        fontSize: 18, 
        fontFamily: 'Helvetica, Noto Serif KR, Noto Serif JP, Noto Serif TC, Noto Serif SC, serif', 
        lineHeight: '1.2rem',
    }, 
    intChipTextEN: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '.75rem', 
        lineHeight: '.9rem', 
        whiteSpace: 'pre-wrap' as 'pre-wrap'
    }, 
    intChipLabel: {
        paddingLeft: 6, 
        paddingRight: 6,
    }, 
    intChipDeleteIcon: {
        marginLeft: -3
    }
}

interface InterchangeChipSetProps {
    classes: any;
    intInfos: InterchangeInfo[];
    onDelete: (i: number) => void;
    onUpdate: (value: InterchangeInfo[]) => void;
}

interface InterchangeChipSetState {
    chipSelected: number;
    nameDialogOpened: boolean;
    nameDialogTheme: [string, string, string, '#000' | '#fff'];
    nameDialogName: Name;
}

class InterchangeChipSet extends React.Component<InterchangeChipSetProps, InterchangeChipSetState> {
    constructor(props) {
        super(props);

        this.state = {
            chipSelected: 0, 
            nameDialogOpened: false,
            nameDialogTheme: [] as any as [string, string, string, '#000' | '#fff'], 
            nameDialogName: [] as any as Name,
        }
    }

    handleClick(index: number) {
        this.setState({
            nameDialogTheme: [
                this.props.intInfos[index][0], 
                this.props.intInfos[index][1], 
                this.props.intInfos[index][2], 
                this.props.intInfos[index][3] as '#fff' | '#000', 
            ], 
            nameDialogName: [
                this.props.intInfos[index][4], 
                this.props.intInfos[index][5], 
            ], 
            nameDialogOpened: true, 
            chipSelected: index,
        })
    }

    nameDialogUpdate(key, value) {
        if (key === 'theme') {
            let newInfos = this.props.intInfos
                .map((inf, idx) => idx===this.state.chipSelected ? [
                    ...value as string[], inf[4], inf[5]
                ] as any as InterchangeInfo : inf);
            this.props.onUpdate(newInfos);
            this.setState({nameDialogTheme: value});
            console.log(newInfos)
        }
        if (key === 'name') {
            let newInfos = this.props.intInfos
                .map((inf, idx) => idx===this.state.chipSelected ? [
                    inf[0], inf[1], inf[2], inf[3], value[0], value[1]
                ] as any as InterchangeInfo : inf);
            this.props.onUpdate(newInfos);
            this.setState({nameDialogName: value});
            console.log(newInfos)
        }
    }

    render() {
        let { classes } = this.props;
        let intChips = this.props.intInfos.map((intInfo, i) => {
            let label = (
                <span style={{color: intInfo[3]}}>
                    <span className={`${classes.intChipText} ${classes.intChipTextZH}`}>
                        {intInfo[4]}
                    </span>
                    <span className={`${classes.intChipText} ${classes.intChipTextEN}`}>
                        {intInfo[5]}
                    </span>
                </span>
            )
            return (
                <Chip 
                    key={i} 
                    label={label}
                    className={classes.intChip}
                    classes={{
                        label: classes.intChipLabel, 
                        deleteIcon: classes.intChipDeleteIcon
                    }}
                    style={{backgroundColor: intInfo[2]}}
                    onDelete={() => this.props.onDelete(i)}
                    onClick={() => this.handleClick(i)} />
            )
        })
        return (
            <div>
                {intChips}

                <ColourDialog
                    open={this.state.nameDialogOpened}
                    theme={this.state.nameDialogTheme} lineName={this.state.nameDialogName}
                    onUpdate={this.nameDialogUpdate.bind(this)}
                    onClose={() => this.setState({nameDialogOpened: false})}
                />
            </div>
        )
    }
}

const StyledInterchangeChipSet = withStyles(intChipSetStyles)(InterchangeChipSet);

interface OSINameDialogProps {
    open: boolean;
    osiName: Name;
    onUpdate: (value: string, index: number) => void;
    onClose: () => void;
}

const OSINameDialog = React.memo((props: OSINameDialogProps) => {
    const { t } = useTranslation();

    const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onUpdate(event.target.value, index);
    };


    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{t('stations.edit.interchange.osiName')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <NameListItems onUpdate={handleUpdate} name={props.osiName} />
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}, (prevProps, nextProps) => {
    if (prevProps.open !== nextProps.open) {
        return false;
    } else {
        return prevProps.osiName.toString() === nextProps.osiName.toString();
    }
})