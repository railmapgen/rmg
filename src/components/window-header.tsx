import React from 'react';
import { Badge, Flex, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Environments, getEnvironment, getVersion } from '../util/config';
import { useTranslation } from 'react-i18next';
import { MdHelp, MdLocationCity, MdTranslate, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { LanguageCode, RmgStyle } from '../constants/constants';
import { useDispatch } from 'react-redux';
import { setStyle } from '../redux/param/action';
import { Link } from 'react-router-dom';
import { zoomIn, zoomOut } from '../redux/app/action';

export default function WindowHeader() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const environment = getEnvironment();
    const getBadgeColour = (env: Environments) => {
        switch (env) {
            case Environments.DEV:
                return 'red';
            case Environments.UAT:
                return 'orange';
            case Environments.PRD:
                return 'green';
        }
    };

    const handleChangeLanguage = async (language: LanguageCode) => {
        const t = await i18n.changeLanguage(language);
        document.documentElement.lang = language;
        document.title = t('WindowHeader.heading');
    };

    return (
        <Flex pl={2} pr={2} align="center">
            <Heading as="h4" size="md">
                {t('WindowHeader.heading')}
                <Badge ml={1} colorScheme={getBadgeColour(environment)}>
                    {environment === Environments.PRD ? getVersion() : environment}
                </Badge>
            </Heading>

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
                            <Link key={style} to={style}>
                                <MenuItem onClick={() => dispatch(setStyle(style))}>
                                    {t('WindowHeader.' + style)}
                                </MenuItem>
                            </Link>
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
                    onClick={() => window.open('https://github.com/railmapgen/rmg', '_blank')}
                />
            </HStack>
        </Flex>
    );
}
