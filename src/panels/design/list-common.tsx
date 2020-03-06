import * as React from 'react';
import { Name, StationInfo } from '../../types';
import { Paper, List, ListItem, ListItemIcon, Icon, ListItemText, TextField } from '@material-ui/core';
import ColourDialog from '../colour-diag';
import { useTranslation } from 'react-i18next';
// import {reverseStations} from './utils';
// import { setParams } from '../../utils';

interface Props {
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    direction: 'l' | 'r';
    platformNum: string;
    stnList: {[stnId: string]: StationInfo};
    paramUpdate: (key, data) => void;
}

const DesignList = (props: Props) => {
    const { t } = useTranslation();

    const [isCDiagOpen, setIsCDiagOpen] = React.useState(false);

    const nameDialogUpdate = (key: string, value: any) => {
        if (key === 'name') {
            window.myLine.lineNames = Object.values(value) as Name;
            props.paramUpdate('line_name', Object.values(value) as Name);
        }
        if (key === 'theme') {
            window.myLine.theme = value;
            props.paramUpdate('theme', value);
        }
    };

    const directionClick = () => {
        if (props.direction === 'r') {
            props.paramUpdate('direction', 'l');
            window.myLine.direction = 'l';
        } else {
            props.paramUpdate('direction', 'r');
            window.myLine.direction = 'r';
        }
    };

    const platformNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.paramUpdate('platform_num', event.target.value);
        window.myLine.platformNum = event.target.value;
    };

    // const reverseClick = () => {
    //     // window.myLine.reverseStns();
    //     let newStnList = reverseStations(props.stnList);
    //     // console.log(newStnList);
    //     setParams('stn_list', newStnList);
    //     location.reload(true);
    // };

    return (
        <div>
            <Paper>
                <List component="nav">
                    <ListItem button onClick={() => setIsCDiagOpen(true)}>
                        <ListItemIcon>
                            <Icon>color_lens</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.theme')} secondary={
                            <span style={{
                                backgroundColor: props.theme[2],
                                color: props.theme[3],
                                padding: '.1rem .3rem',
                            }}>{Object.values(props.lineName).join()}</span>
                        } />
                    </ListItem>
                    <ListItem button onClick={directionClick}>
                        <ListItemIcon>
                            <Icon>directions</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={t('design.direction.button')}
                            secondary={t('design.direction.' + props.direction)} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>looks_one</Icon>
                        </ListItemIcon>
                        <TextField
                            label={t('design.platform')}
                            variant="outlined"
                            value={props.platformNum}
                            onChange={platformNumChange} />
                    </ListItem>
                    {/* <ListItem button onClick={reverseClick}>
                        <ListItemIcon>
                            <Icon>cached</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.reverse')} />
                    </ListItem> */}
                </List>
            </Paper>

            <ColourDialog
                open={isCDiagOpen}
                theme={props.theme} lineName={props.lineName}
                onUpdate={nameDialogUpdate}
                onClose={() => setIsCDiagOpen(false)}
            />
        </div>
    );
}

export default DesignList;