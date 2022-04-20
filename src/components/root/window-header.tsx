import React, { useState } from 'react';
import { Flex, Heading, HStack, Icon, IconButton, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { getEnvironment, getVersion } from '../../util/config';
import { Trans, useTranslation } from 'react-i18next';
import { MdHelp, MdLocationCity, MdOpenInNew, MdTranslate, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { LanguageCode, RmgStyle } from '../../constants/constants';
import { useDispatch } from 'react-redux';
import { setStyle } from '../../redux/param/action';
import * as ReactRouterDom from 'react-router-dom';
import { zoomIn, zoomOut } from '../../redux/app/action';
import HelpModal from '../modal/help-modal';
import { RmgEnvBadge } from '@railmapgen/rmg-components';

export default function WindowHeader() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const environment = getEnvironment();

    const handleChangeLanguage = async (language: LanguageCode) => {
        const t = await i18n.changeLanguage(language);
        document.documentElement.lang = language;
        document.title = t('WindowHeader.heading');
    };

    return (
        <Flex pl={2} pr={2} align="center">
            <Heading as="h4" size="md">
                {t('WindowHeader.heading')}
            </Heading>
            <RmgEnvBadge
                environment={environment}
                version={getVersion()}
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
                            color="teal.500"
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
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Zoom out"
                    icon={<MdZoomOut />}
                    onClick={() => dispatch(zoomOut())}
                />
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Zoom in"
                    icon={<MdZoomIn />}
                    onClick={() => dispatch(zoomIn())}
                />

                <Menu>
                    <MenuButton as={IconButton} icon={<MdLocationCity />} variant="ghost" size="sm" />
                    <MenuList>
                        {Object.values(RmgStyle).map(style => (
                            <ReactRouterDom.Link key={style} to={style}>
                                <MenuItem onClick={() => dispatch(setStyle(style))}>
                                    {t('WindowHeader.' + style)}
                                </MenuItem>
                            </ReactRouterDom.Link>
                        ))}
                    </MenuList>
                </Menu>

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
        </Flex>
    );
}
