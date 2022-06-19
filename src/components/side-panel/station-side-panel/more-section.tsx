import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import RmgButtonGroup from '../../common/rmg-button-group';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { Facilities, RmgStyle, Services } from '../../../constants/constants';
import { updateStationFacility, updateStationLoopPivot, updateStationServices } from '../../../redux/param/action';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

export default function MoreSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const style = useRootSelector(state => state.param.style);
    const { services, facility, loop_pivot } = useRootSelector(state => state.param.stn_list[selectedStation]);

    const serviceSelections = Object.values(Services).map(service => {
        return {
            label: t('StationSidePanel.more.' + service),
            value: service,
            disabled: service === Services.local && style !== RmgStyle.SHMetro,
        };
    });

    const mtrFacilityOptions = {
        [Facilities.none]: t('StationSidePanel.more.none'),
        [Facilities.airport]: t('StationSidePanel.more.airport'),
        [Facilities.hsr]: t('StationSidePanel.more.hsr'),
        [Facilities.disney]: t('StationSidePanel.more.disney'),
    };

    const shmetroFacilityOptions = {
        [Facilities.none]: t('StationSidePanel.more.none'),
        [Facilities.airport]: t('StationSidePanel.more.airport'),
        [Facilities.railway]: t('StationSidePanel.more.railway'),
        [Facilities.disney]: t('StationSidePanel.more.disney'),
    };

    const fields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('StationSidePanel.more.service'),
            component: (
                <RmgButtonGroup
                    selections={serviceSelections}
                    defaultValue={services}
                    onChange={services => dispatch(updateStationServices(selectedStation, services))}
                    multiSelect
                />
            ),
            hidden: ![RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style),
        },
        {
            type: 'select',
            label: t('StationSidePanel.more.facility'),
            value: facility,
            options: style === RmgStyle.MTR ? mtrFacilityOptions : shmetroFacilityOptions,
            onChange: value => dispatch(updateStationFacility(selectedStation, value as Facilities)),
            hidden: ![RmgStyle.MTR, RmgStyle.SHMetro].includes(style),
        },
        {
            type: 'switch',
            label: t('StationSidePanel.more.pivot'),
            isChecked: loop_pivot,
            onChange: checked => dispatch(updateStationLoopPivot(selectedStation, checked)),
            hidden: ![RmgStyle.SHMetro].includes(style),
            minW: 'full',
            oneLine: true,
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StationSidePanel.more.title')}
            </Heading>

            <RmgFields fields={fields} />
        </Box>
    );
}
