import { Box } from '@chakra-ui/react';
import React from 'react';
import EditableStack, { EditableField } from '../editable-stack';
import RmgButtonGroup from '../../common/rmg-button-group';
import { useAppSelector } from '../../../redux';
import { Services } from '../../../constants/constants';
import { useDispatch } from 'react-redux';
import { updateStationServices } from '../../../redux/param/action';

export default function MoreSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const { services } = useAppSelector(state => state.param.stn_list[selectedStation]);

    const serviceSelections = Object.values(Services).map(service => {
        return {
            label: service,
            value: service,
            disabled: service === Services.local,
        };
    });

    const fields: EditableField[] = [
        {
            type: 'custom',
            label: 'Train services',
            component: (
                <RmgButtonGroup
                    selections={serviceSelections}
                    defaultValue={services}
                    onChange={services => dispatch(updateStationServices(selectedStation, services))}
                    multiSelect
                />
            ),
        },
    ];

    return (
        <Box>
            <EditableStack fields={fields} />
        </Box>
    );
}
