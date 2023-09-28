import { useState } from 'react';
import { Heading, HStack, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdHelp } from 'react-icons/md';
import HelpModal from '../modal/help-modal';
import { RmgEnvBadge, RmgWindowHeader } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';

export const WindowHeader = () => {
    const { t } = useTranslation();

    const environment = rmgRuntime.getEnv();
    const appVersion = rmgRuntime.getAppVersion();

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <RmgWindowHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator')}
            </Heading>
            <RmgEnvBadge environment={environment} version={appVersion} />

            <HStack ml="auto">
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Help"
                    icon={<MdHelp />}
                    onClick={() => setIsHelpModalOpen(true)}
                />
            </HStack>

            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </RmgWindowHeader>
    );
};

export const ImportViewWindowHeader = () => {
    const { t } = useTranslation();

    return (
        <RmgWindowHeader isAppClipHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator') + ' - ' + t('Project Selector')}
            </Heading>
        </RmgWindowHeader>
    );
};
