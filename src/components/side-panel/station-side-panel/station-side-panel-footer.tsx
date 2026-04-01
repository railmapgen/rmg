import classes from '../side-panel.module.css';
import { useState } from 'react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import RemoveConfirmModal from '../../modal/remove-confirm-modal';
import { setCurrentStation, setLoopMidpointStation } from '../../../redux/param/param-slice';
import { useTranslation } from 'react-i18next';
import { RmgStyle } from '../../../constants/constants';
import { Button, Divider, Group, Stack } from '@mantine/core';
import { MdOutlineContrast, MdOutlineDeleteOutline, MdOutlineMyLocation } from 'react-icons/md';

export default function StationSidePanelFooter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { selectedStation } = useRootSelector(state => state.app);
    const {
        loop,
        loop_info: loopInfo,
        style,
        current_stn_idx: currentStationId,
        stn_list: stationList,
    } = useRootSelector(state => state.param);

    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const isValidStation = !['linestart', 'lineend'].includes(selectedStation);

    return (
        <Stack component="footer" className={classes['tab-footer']} gap="xs">
            <Divider />
            <Group gap="xs" grow>
                <Button
                    variant={selectedStation === currentStationId ? 'filled' : 'default'}
                    leftSection={<MdOutlineMyLocation />}
                    onClick={() => dispatch(setCurrentStation(selectedStation))}
                    disabled={!isValidStation || !Object.keys(stationList).includes(selectedStation)}
                >
                    {t('Current')}
                </Button>
                {style === RmgStyle.GZMTR && loop && (
                    <Button
                        variant={selectedStation === loopInfo?.midpoint_station ? 'filled' : 'default'}
                        leftSection={<MdOutlineContrast />}
                        onClick={() => dispatch(setLoopMidpointStation(selectedStation))}
                        disabled={!isValidStation || !Object.keys(stationList).includes(selectedStation)}
                    >
                        {t('Midpoint')}
                    </Button>
                )}
                <Button
                    variant="default"
                    leftSection={<MdOutlineDeleteOutline />}
                    onClick={() => setIsRemoveModalOpen(true)}
                    disabled={!isValidStation || !Object.keys(stationList).includes(selectedStation)}
                >
                    {t('StationSidePanel.footer.remove')}
                </Button>
            </Group>

            <RemoveConfirmModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} />
        </Stack>
    );
}
