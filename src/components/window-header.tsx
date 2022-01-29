import React from 'react';
import { Flex, Heading, Badge, Menu, MenuButton, MenuItem, MenuList, IconButton } from '@chakra-ui/react';
import { Environments, getEnvironment, getVersion } from '../util/config';
import { useTranslation } from 'react-i18next';
import { MdLocationCity, MdTranslate, MdZoomOut } from 'react-icons/md';
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

    return (
        <Flex pl={2} pr={2} pb={1} pt={1} align="center">
            <Heading as="h4" size="md" mr="auto">
                {t('WindowHeader.heading')}
                <Badge ml={1} colorScheme={getBadgeColour(environment)}>
                    {environment === Environments.PRD ? getVersion() : environment}
                </Badge>
            </Heading>

            <IconButton
                size="xs"
                variant="ghost"
                aria-label="Zoom out"
                icon={<MdZoomOut />}
                onClick={() => dispatch(zoomOut())}
            />
            <IconButton
                size="xs"
                variant="ghost"
                aria-label="Zoom in"
                icon={<MdZoomOut />}
                onClick={() => dispatch(zoomIn())}
            />

            <Menu>
                <MenuButton as={IconButton} icon={<MdLocationCity />} variant="ghost" size="xs" />
                <MenuList>
                    {Object.values(RmgStyle).map(style => (
                        <Link key={style} to={'/v5/' + style}>
                            <MenuItem onClick={() => dispatch(setStyle(style))}>{style}</MenuItem>
                        </Link>
                    ))}
                </MenuList>
            </Menu>

            <Menu>
                <MenuButton as={IconButton} icon={<MdTranslate />} variant="ghost" size="xs" />
                <MenuList>
                    <MenuItem onClick={() => i18n.changeLanguage(LanguageCode.English)}>English</MenuItem>
                    <MenuItem onClick={() => i18n.changeLanguage(LanguageCode.ChineseSimp)}>中文（简体）</MenuItem>
                    <MenuItem onClick={() => i18n.changeLanguage(LanguageCode.ChineseTrad)}>中文（繁體）</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
