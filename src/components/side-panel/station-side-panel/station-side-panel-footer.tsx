import { Button, HStack } from '@chakra-ui/react';
import { RmgSidePanelFooter } from '@railmapgen/rmg-components';
import { useState } from 'react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import RemoveConfirmModal from '../../modal/remove-confirm-modal';
import { setCurrentStation, setLoopMidpointStation } from '../../../redux/param/param-slice';
import { useTranslation } from 'react-i18next';
import { RmgStyle } from '../../../constants/constants';

export default function StationSidePanelFooter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { selectedStation } = useRootSelector(state => state.app);
    const { loop, style } = useRootSelector(state => state.param);

    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

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
                <Button size="sm" variant="outline" onClick={() => setIsRemoveModalOpen(true)}>
                    {t('StationSidePanel.footer.remove')}
                </Button>
            </HStack>

            <RemoveConfirmModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} />
        </RmgSidePanelFooter>
    );
}
