import classes from '../side-panel.module.css';
import { isColineBranch } from '../../../redux/param/coline-action';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCached, MdFilter1, MdRotateLeft, MdRotateRight, MdSwapHoriz } from 'react-icons/md';
import AutoNumModal from '../../modal/auto-num-modal';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { Direction, Events, RmgStyle } from '../../../constants/constants';
import { reverseStations, rotateStations } from '../../../redux/param/action';
import { swapBranch } from '../../../redux/param/swap-branch';
import ConnectDisconnectCard from './connect-disconnect-card';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Group, Title } from '@mantine/core';

export default function ActionSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { style, loop, stn_list } = useRootSelector(state => state.param);
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const branches = useRootSelector(state => state.helper.branches);
    const [isAutoNumModalOpen, setIsAutoNumModalOpen] = useState(false);

    const handleReverseStations = () => {
        dispatch(reverseStations(style === RmgStyle.SHMetro));
        rmgRuntime.event(Events.REVERSE_STATIONS, { style });
    };

    const isColine =
        selectedBranch !== 0 && style === RmgStyle.SHMetro && isColineBranch(branches[selectedBranch], stn_list);

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('BranchSidePanel.action.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={classes['section-body']}>
                {selectedBranch !== 0 && style !== RmgStyle.SHMetro && (
                    <>
                        <Title order={4} size="h5">
                            {t('Branch left end')}
                        </Title>
                        <ConnectDisconnectCard direction={Direction.left} />
                        <Title order={4} size="h5">
                            {t('Branch right end')}
                        </Title>
                        <ConnectDisconnectCard direction={Direction.right} />
                    </>
                )}

                {style === RmgStyle.GZMTR && (
                    <Button
                        size="sm"
                        variant="default"
                        leftSection={<MdFilter1 />}
                        onClick={() => setIsAutoNumModalOpen(true)}
                    >
                        {t('BranchSidePanel.action.autoNum')}
                    </Button>
                )}

                <Button size="sm" variant="default" leftSection={<MdCached />} onClick={handleReverseStations}>
                    {style === RmgStyle.SHMetro
                        ? t('BranchSidePanel.action.flip')
                        : t('BranchSidePanel.action.reverse')}
                </Button>

                {selectedBranch !== 0 && !isColine && (
                    <Button
                        size="sm"
                        variant="default"
                        leftSection={<MdSwapHoriz />}
                        onClick={() => dispatch(swapBranch(selectedBranch))}
                    >
                        {t('BranchSidePanel.action.swap')}
                    </Button>
                )}

                {loop && style === RmgStyle.GZMTR && (
                    <Group gap="xs">
                        <Button
                            size="sm"
                            variant="default"
                            leftSection={<MdRotateLeft />}
                            onClick={() => dispatch(rotateStations(false))}
                        >
                            {t('Rotate anticlockwise')}
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            leftSection={<MdRotateRight />}
                            onClick={() => dispatch(rotateStations(true))}
                        >
                            {t('Rotate clockwise')}
                        </Button>
                    </Group>
                )}
            </RMSectionBody>

            <AutoNumModal isOpen={isAutoNumModalOpen} onClose={() => setIsAutoNumModalOpen(false)} />
        </RMSection>
    );
}
