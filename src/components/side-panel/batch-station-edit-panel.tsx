import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { RmgFields, RmgSidePanelFooter } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Facilities, Services, TEMP } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { updateStationsProperty } from '../../redux/param/action';
import { checkStationCouldBeRemoved, removeStation } from '../../redux/param/remove-station-action';
import { setSelectedStations } from '../../redux/app/app-slice';

import { SidePanelMode } from '../../constants/constants';
import { setSidePanelMode } from '../../redux/app/app-slice';
import { useStationEditFields } from './station-side-panel/use-station-edit-fields';

export default function BatchStationEditPanel() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStations = useRootSelector(state => state.app.selectedStations);
    const { style, stn_list, loop } = useRootSelector(state => state.param);

    if (!selectedStations || selectedStations.length <= 1) return null;

    const firstStation = stn_list[selectedStations[0]];
    const commonServices = firstStation?.services || [];
    const commonFacility = firstStation?.facility || '';
    const commonOneLine = firstStation?.one_line || false;
    const commonIntPadding = firstStation?.int_padding;
    const commonCharacterSpacing = firstStation?.character_spacing;
    const commonUnderConstruction = firstStation?.underConstruction;

    const fields = useStationEditFields({
        style,
        loop,
        values: {
            services: commonServices,
            facility: commonFacility,
            one_line: commonOneLine,
            int_padding: commonIntPadding,
            character_spacing: commonCharacterSpacing,
            underConstruction: commonUnderConstruction,
        },
        handlers: {
            onServicesChange: (val: Services[]) => dispatch(updateStationsProperty(selectedStations, 'services', val)),
            onFacilityChange: (val: string | number) =>
                dispatch(updateStationsProperty(selectedStations, 'facility', val as Facilities)),
            onOneLineChange: (val: boolean) => dispatch(updateStationsProperty(selectedStations, 'one_line', val)),
            onIntPaddingChange: (val: number) => dispatch(updateStationsProperty(selectedStations, 'int_padding', val)),
            onCharacterSpacingChange: (val: number) =>
                dispatch(updateStationsProperty(selectedStations, 'character_spacing', val)),
            onUnderConstructionChange: (val: boolean | TEMP) =>
                dispatch(updateStationsProperty(selectedStations, 'underConstruction', val)),
        },
    });

    const handleDelete = () => {
        dispatch((dispatch, getState) => {
            const currentSelected = getState().app.selectedStations;
            currentSelected.forEach(id => {
                if (getState().param.stn_list[id]) {
                    if (checkStationCouldBeRemoved(id)(dispatch, getState)) {
                        dispatch(removeStation(id));
                    }
                }
            });
            dispatch(setSelectedStations([]));
            dispatch(setSidePanelMode(SidePanelMode.CLOSE));
        });
    };

    return (
        <VStack spacing={4} align="stretch">
            <Box p={4}>
                <Text mb={4}>
                    {t('StationSidePanel.batch_selected', {
                        count: selectedStations.length,
                        defaultValue: `Selected ${selectedStations.length} stations`,
                    })}
                </Text>
                <RmgFields fields={fields} />
            </Box>

            <RmgSidePanelFooter>
                <HStack justify="space-between">
                    <Button size="sm" variant="outline" onClick={handleDelete}>
                        {t('StationSidePanel.footer.remove')}
                    </Button>
                </HStack>
            </RmgSidePanelFooter>
        </VStack>
    );
}

