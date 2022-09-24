import React, { useState } from 'react';
import {
    Heading,
    HStack,
    Icon,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorModeValue,
} from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import { MdHelp, MdOpenInNew, MdTranslate } from 'react-icons/md';
import HelpModal from '../modal/help-modal';
import { RmgEnvBadge, RmgWindowHeader } from '@railmapgen/rmg-components';
import { LanguageCode } from '@railmapgen/rmg-translate';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { handleLanguageChange } from '../../i18n/config';

export default function WindowHeader() {
    const { t } = useTranslation();
    const linkColour = useColorModeValue('primary.500', 'primary.300');

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const environment = rmgRuntime.getEnv();
    const appVersion = rmgRuntime.getAppVersion();

    const handleChangeLanguage = async (language: LanguageCode) => {
        rmgRuntime.setLanguage(language);
        handleLanguageChange(language);
    };

    return (
        <RmgWindowHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator')}
            </Heading>
            <RmgEnvBadge
                environment={environment}
                version={appVersion}
                popoverHeader={
                    <Trans i18nKey="WindowHeader.popoverHeader" environment={environment}>
                        You're on {{ environment }} environment!
                    </Trans>
                }
                popoverBody={
                    <Trans i18nKey="WindowHeader.popoverBody">
                        This is a testing environment where we don't guarantee the stability and compatibility. Please
                        switch back to{' '}
                        <Link
                            color={linkColour}
                            href={'https://railmapgen.github.io' + window.location.pathname}
                            isExternal={true}
                        >
                            Production environment <Icon as={MdOpenInNew} />
                        </Link>
                        .
                    </Trans>
                }
            />

            <HStack ml="auto">
                <Menu>
                    <MenuButton as={IconButton} icon={<MdTranslate />} variant="ghost" size="sm" />
                    <MenuList>
                        <MenuItem onClick={() => handleChangeLanguage(LanguageCode.English)}>English</MenuItem>
                        <MenuItem onClick={() => handleChangeLanguage(LanguageCode.ChineseSimp)}>简体中文</MenuItem>
                        <MenuItem onClick={() => handleChangeLanguage(LanguageCode.ChineseTrad)}>繁體中文</MenuItem>
                    </MenuList>
                </Menu>

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
}
