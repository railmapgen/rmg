import { Button, HStack, useToast } from '@chakra-ui/react';
import { RmgSidePanelFooter } from '@railmapgen/rmg-components';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setCurrentStation, setLoopMidpointStation } from '../../../redux/param/param-slice';
import { useTranslation } from 'react-i18next';
import { Events, RmgStyle, SidePanelMode } from '../../../constants/constants';
import { checkStationCouldBeRemoved, removeStation } from '../../../redux/param/remove-station-action';
import { setSelectedStation, setSidePanelMode } from '../../../redux/app/app-slice';
import { removeInvalidColineOnRemoveStation } from '../../../redux/param/coline-action';
import rmgRuntime from '@railmapgen/rmg-runtime';

export default function StationSidePanelFooter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const toast = useToast();

    const { selectedStation } = useRootSelector(state => state.app);
    const { loop, style } = useRootSelector(state => state.param);

    const handleRemove = () => {
        const result = dispatch(checkStationCouldBeRemoved(selectedStation));
        if (result) {
            dispatch(setSidePanelMode(SidePanelMode.CLOSE));
            dispatch(setSelectedStation('linestart'));
            dispatch(removeInvalidColineOnRemoveStation(selectedStation));
            dispatch(removeStation(selectedStation));
        } else {
            toast({
                title: t('Unable to remove this station.'),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        rmgRuntime.event(Events.REMOVE_STATION, { success: result });
    };

    return (
        <RmgSidePanelFooter>
            <HStack>
                <Button size="sm" variant="outline" onClick={() => dispatch(setCurrentStation(selectedStation))}>
                    {t('StationSidePanel.footer.current')}
                </Button>
                {style === RmgStyle.GZMTR && loop && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dispatch(setLoopMidpointStation(selectedStation))}
                    >
                        {t('Set as midpoint')}
                    </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleRemove}>
                    {t('StationSidePanel.footer.remove')}
                </Button>
            </HStack>
        </RmgSidePanelFooter>
    );
}
