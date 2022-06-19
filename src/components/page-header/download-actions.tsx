import React, { useState } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdExpandMore } from 'react-icons/md';
import { downloadAs } from '../../util/utils';
import { useRootSelector } from '../../redux';
import { useTranslation } from 'react-i18next';
import DownloadModal from '../modal/download-modal';

export default function DownloadActions() {
    const { t } = useTranslation();

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    const param = useRootSelector(state => state.param);

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
                <MenuItem onClick={() => setIsDownloadModalOpen(true)}>{t('DownloadActions.images')}</MenuItem>
            </MenuList>

            <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
        </Menu>
    );
}
