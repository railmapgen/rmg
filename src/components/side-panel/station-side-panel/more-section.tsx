import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { FACILITIES, Facilities, RmgStyle, Services } from '../../../constants/constants';
import {
    updateStationFacility,
    updateStationIntPadding,
    updateStationIntPaddingToAll,
    updateStationLoopPivot,
    updateStationOneLine,
    updateStationServices,
} from '../../../redux/param/action';
import { RmgButtonGroup, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

export default function MoreSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const { style, loop } = useRootSelector(state => state.param);
    const { services, facility, loop_pivot, one_line, int_padding } = useRootSelector(
        state => state.param.stn_list[selectedStation]
    );

    const serviceSelections = Object.values(Services).map(service => {
        return {
            label: t('StationSidePanel.more.' + service),
            value: service,
            disabled: service === Services.local && style !== RmgStyle.SHMetro,
        };
    });

    const mtrFacilityOptions = Object.fromEntries(
        Object.entries(FACILITIES)
            .filter(([f]) => !['railway'].includes(f))
            .map(([f, name]) => [f, t(name)])
    );
    const shmetroFacilityOptions = Object.fromEntries(
        Object.entries(FACILITIES)
            .filter(([f]) => !['np360'].includes(f))
            .map(([f, name]) => [f, t(name)])
    );

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
            value: facility || '',
            options: { '': t('None'), ...(style === RmgStyle.MTR ? mtrFacilityOptions : shmetroFacilityOptions) },
            onChange: value => dispatch(updateStationFacility(selectedStation, value as Facilities | '')),
            hidden: ![RmgStyle.MTR, RmgStyle.SHMetro].includes(style),
        },
        {
            type: 'switch',
            label: t('StationSidePanel.more.pivot'),
            isChecked: loop_pivot,
            onChange: checked => dispatch(updateStationLoopPivot(selectedStation, checked)),
            hidden: ![RmgStyle.SHMetro].includes(style) || !loop,
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'switch',
            label: t('StationSidePanel.more.oneLine'),
            isChecked: one_line,
            onChange: checked => dispatch(updateStationOneLine(selectedStation, checked)),
            hidden: ![RmgStyle.SHMetro].includes(style),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'input',
            label: t('StationSidePanel.more.intPadding'),
            value: int_padding.toString(),
            validator: val => Number.isInteger(val),
            onChange: val => dispatch(updateStationIntPadding(selectedStation, Number(val))),
            hidden: ![RmgStyle.SHMetro].includes(style),
        },
        {
            type: 'custom',
            label: t('StationSidePanel.more.intPaddingApplyGlobal'),
            component: (
                <RmgButtonGroup
                    selections={[{ label: t('StationSidePanel.more.apply'), value: '', disabled: false }]}
                    defaultValue=""
                    onChange={_ => dispatch(updateStationIntPaddingToAll(selectedStation))}
                />
            ),
            oneLine: true,
            hidden: ![RmgStyle.SHMetro].includes(style),
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
