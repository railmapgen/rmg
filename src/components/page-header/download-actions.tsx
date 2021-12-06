import React from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdExpandMore } from 'react-icons/md';
import { downloadAs } from '../../util/utils';
import { useAppSelector } from '../../redux';
import { useTranslation } from 'react-i18next';

export default function DownloadActions() {
    const { t } = useTranslation();

    const param = useAppSelector(state => state.param);

    const handleDownloadJson = () => {
        downloadAs(`RMG_${new Date().valueOf()}.json`, 'application/json', JSON.stringify(param));
    };

    return (
        <Menu>
            <MenuButton as={Button} variant="ghost" size="sm" rightIcon={<MdExpandMore />}>
                {t('DownloadActions.downloads')}
            </MenuButton>
            <MenuList>
                <MenuItem onClick={handleDownloadJson}>{t('DownloadActions.configFile')}</MenuItem>
                <MenuItem>{t('DownloadActions.images')}</MenuItem>
            </MenuList>
        </Menu>
    );
}
