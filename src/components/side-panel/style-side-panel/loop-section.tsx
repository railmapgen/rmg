import classes from '../side-panel.module.css';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setLoop } from '../../../redux/param/param-slice';
import { useTranslation } from 'react-i18next';
import { MdOutlineSettings } from 'react-icons/md';
import { SidePanelMode } from '../../../constants/constants';
import { setSelectedBranch, setSidePanelMode } from '../../../redux/app/app-slice';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Group, Switch, Title } from '@mantine/core';
import clsx from 'clsx';

export default function LoopSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { loop } = useRootSelector(state => state.param);

    const handleOpenMoreSettings = () => {
        dispatch(setSelectedBranch(0));
        dispatch(setSidePanelMode(SidePanelMode.BRANCH));
    };

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('Loop line')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Group gap="xs">
                    <Switch
                        label={t('StyleSidePanel.loop.isLoop')}
                        checked={loop}
                        onChange={({ currentTarget: { checked } }) => dispatch(setLoop(checked))}
                    />
                </Group>

                {loop && (
                    <Group gap="xs">
                        <Button variant="default" leftSection={<MdOutlineSettings />} onClick={handleOpenMoreSettings}>
                            {t('More settings')}
                        </Button>
                    </Group>
                )}
            </RMSectionBody>
        </RMSection>
    );
}
