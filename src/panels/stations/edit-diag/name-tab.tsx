import React, { useContext } from 'react';

import { List } from '@material-ui/core';

import NameListItems from './name-list-items';
import NumListItem from './num-list-item';
import { ParamContext, CanvasContext } from '../../../context';

const NameTab = (props: { stnId: string }) => {
    const { rmgStyle } = useContext(CanvasContext);
    const { param, dispatch } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'UPDATE_STATION_NAME',
            stnId: props.stnId,
            name: stnInfo.name.map((val, i) => (index === i ? event.target.value : val)) as Name,
        });
    };

    return (
        <List>
            <NameListItems name={stnInfo.name} onUpdate={handleUpdate} />
            {rmgStyle === 'gzmtr' && <NumListItem stnId={props.stnId} />}
        </List>
    );
};

export default NameTab;
