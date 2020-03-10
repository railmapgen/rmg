import * as React from 'react';

import { List } from '@material-ui/core';
import { Name } from '../../../types';

import NameListItems from './name-list-items';
import NumListItem from './num-list-item';
import { ParamContext } from '../../../context';

interface Props {
    stnId: string;
}

const NameTab = (props: Props) => {
    const { param, dispatch } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'UPDATE_STATION_NAME', 
            stnId: props.stnId, 
            name: stnInfo.name.map((val, i) => index===i ? event.target.value : val) as Name,
        });
    };

    return (
        <List>
            <NameListItems name={stnInfo.name} onUpdate={handleUpdate} />
            {window.urlParams.get('style') === 'gzmtr' && <NumListItem stnId={props.stnId} />}
        </List>
    );
};

export default NameTab;