import { useState } from 'react';
import { Heading, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdHelp, MdTranslate } from 'react-icons/md';
import HelpModal from '../modal/help-modal';
import { RmgEnvBadge, RmgWindowHeader } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import RMPlogo from '../../img/rmp.png';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@railmapgen/rmg-translate';

export default function WindowHeader() {
    const { t } = useTranslation();

    const environment = rmgRuntime.getEnv();
    const appVersion = rmgRuntime.getAppVersion();

    const handleOpenRMP = () => {
        if (rmgRuntime.isStandaloneWindow()) {
            window.open('/rmp', '_blank');
        } else {
            rmgRuntime.openApp('rmp');
        }
    };

    const handleChangeLanguage = (language: SupportedLanguageCode) => {
        rmgRuntime.setLanguage(language);
        rmgRuntime.getI18nInstance().changeLanguage(language);
    };

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <RmgWindowHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator')}
            </Heading>
            <RmgEnvBadge environment={environment} version={appVersion} />

            <HStack ml="auto">
                {rmgRuntime.isStandaloneWindow() && (
                    <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Open RMP"
                        icon={<Image src={RMPlogo} width="3.5" height="3.5" />}
                        onClick={handleOpenRMP}
                    />
                )}

                {rmgRuntime.isStandaloneWindow() && (
                    <Menu>
                        <MenuButton as={IconButton} icon={<MdTranslate />} variant="ghost" size="sm" />
                        <MenuList>
                            {SUPPORTED_LANGUAGES.map(lang => (
                                <MenuItem key={lang} onClick={() => handleChangeLanguage(lang)}>
                                    {LANGUAGE_NAMES[lang][lang]}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                )}

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
