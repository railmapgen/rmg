import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineHelpOutline } from 'react-icons/md';
import HelpModal from '../modal/help-modal';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RMEnvBadge, RMWindowHeader } from '@railmapgen/mantine-components';
import { ActionIcon, Group, Title } from '@mantine/core';

export const WindowHeader = () => {
    const { t } = useTranslation();

    const environment = rmgRuntime.getEnv();
    const appVersion = rmgRuntime.getAppVersion();

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <RMWindowHeader>
            <Title>{t('Rail Map Generator')}</Title>
            <RMEnvBadge env={environment} ver={appVersion} />

            <Group gap="xs" ml="auto">
                <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="gray"
                    aria-label="Help"
                    onClick={() => setIsHelpModalOpen(true)}
                >
                    <MdOutlineHelpOutline />
                </ActionIcon>
            </Group>

            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </RMWindowHeader>
    );
};

export const ImportViewWindowHeader = () => {
    const { t } = useTranslation();

    return (
        <RMWindowHeader isAppClipHeader>
            <Title>{t('Rail Map Generator') + ' - ' + t('Project Selector')}</Title>
        </RMWindowHeader>
    );
};
