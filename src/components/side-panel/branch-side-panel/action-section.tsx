import classes from '../side-panel.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, HStack } from '@chakra-ui/react';
import { MdCached, MdFilter1, MdRotateLeft, MdRotateRight } from 'react-icons/md';
import AutoNumModal from '../../modal/auto-num-modal';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { Direction, Events, RmgStyle } from '../../../constants/constants';
import { reverseStations, rotateStations } from '../../../redux/param/action';
import ConnectDisconnectCard from './connect-disconnect-card';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Group, Title } from '@mantine/core';

export default function ActionSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { style, loop } = useRootSelector(state => state.param);
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const [isAutoNumModalOpen, setIsAutoNumModalOpen] = useState(false);

    const handleReverseStations = () => {
        dispatch(reverseStations(style === RmgStyle.SHMetro));
        rmgRuntime.event(Events.REVERSE_STATIONS, { style });
    };

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
                        <Heading as="h6" size="xs">
                            {t('Branch left end')}
                        </Heading>
                        <ConnectDisconnectCard direction={Direction.left} />
                        <Heading as="h6" size="xs">
                            {t('Branch right end')}
                        </Heading>
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
