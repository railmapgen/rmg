import { useState } from 'react';
import { MdOutlineDownload, MdOutlineExpandMore } from 'react-icons/md';
import { downloadAs } from '../../util/utils';
import { useRootSelector } from '../../redux';
import { useTranslation } from 'react-i18next';
import DownloadModal from '../modal/download-modal';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events } from '../../constants/constants';
import { sanitiseParam } from '../../util/param-updater-utils';
import { Button, Menu } from '@mantine/core';

export default function DownloadActions() {
    const { t } = useTranslation();

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    const { paramConfig } = useRootSelector(state => state.app);
    const param = useRootSelector(state => state.param);

    const handleDownloadJson = () => {
        const sanitisedParam = sanitiseParam(param);
        downloadAs(`RMG_${paramConfig?.id}.json`, 'application/json', JSON.stringify(sanitisedParam));
        rmgRuntime.event(Events.DOWNLOAD_PARAM, { style: param.style });
    };

    return (
        <Menu>
            <Menu.Target>
                <Button variant="default" leftSection={<MdOutlineDownload />} rightSection={<MdOutlineExpandMore />}>
                    {t('DownloadActions.downloads')}
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={handleDownloadJson}>{t('DownloadActions.configFile')}</Menu.Item>
                <Menu.Item onClick={() => setIsDownloadModalOpen(true)}>{t('DownloadActions.images')}</Menu.Item>
            </Menu.Dropdown>

            <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
        </Menu>
    );
}
