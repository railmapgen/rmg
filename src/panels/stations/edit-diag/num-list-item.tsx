import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, Icon, TextField } from '@material-ui/core';
import { ParamContext } from '../../../context';

interface Props {
    stnId: string;
}

const NumListItem = (props: Props) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <TextField
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('stations.edit.name.num')}
                    onChange={e =>
                        dispatch({
                            type: 'UPDATE_STATION_NUM',
                            stnId: props.stnId,
                            num: e.target.value,
                        })
                    }
                    value={param.stn_list[props.stnId].num}
                />
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, param.stn_list[props.stnId].num]
    );
};

export default NumListItem;
