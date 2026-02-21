import { Box, Heading } from '@chakra-ui/react';
import { RmgFields } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Facilities, Services, TEMP } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import {
    updateStationCharacterSpacing,
    updateStationCharacterSpacingToAll,
    updateStationFacility,
    updateStationIntPadding,
    updateStationIntPaddingToAll,
    updateStationLoopPivot,
    updateStationOneLine,
    updateStationServices,
    updateStationUnderConstruction,
} from '../../../redux/param/action';
import { useStationEditFields } from './use-station-edit-fields';

export default function MoreSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStations[0]);
    const { style, loop } = useRootSelector(state => state.param);
    const { services, facility, loop_pivot, one_line, int_padding, character_spacing, underConstruction } =
        useRootSelector(state => state.param.stn_list[selectedStation]);

    const fields = useStationEditFields({
        style,
        loop,
        values: {
            services,
            facility: facility || '',
            loop_pivot,
            one_line,
            int_padding,
            character_spacing,
            underConstruction,
        },
        handlers: {
            onServicesChange: (val: Services[]) => dispatch(updateStationServices(selectedStation, val)),
            onFacilityChange: (val: string | number) =>
                dispatch(updateStationFacility(selectedStation, val as Facilities | '')),
            onLoopPivotChange: (val: boolean) => dispatch(updateStationLoopPivot(selectedStation, val)),
            onOneLineChange: (val: boolean) => dispatch(updateStationOneLine(selectedStation, val)),
            onIntPaddingChange: (val: number) => dispatch(updateStationIntPadding(selectedStation, val)),
            onCharacterSpacingChange: (val: number) => dispatch(updateStationCharacterSpacing(selectedStation, val)),
            onUnderConstructionChange: (val: boolean | TEMP) =>
                dispatch(updateStationUnderConstruction(selectedStation, val)),
            onApplyIntPaddingToAll: () => dispatch(updateStationIntPaddingToAll(selectedStation)),
            onApplyCharacterSpacingToAll: () => dispatch(updateStationCharacterSpacingToAll(selectedStation)),
        },
    });

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StationSidePanel.more.title')}
            </Heading>

            <RmgFields fields={fields} />
        </Box>
    );
}

