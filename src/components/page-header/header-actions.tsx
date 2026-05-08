import classes from './page-header.module.css';
import { MdOutlineDownload, MdOutlineExpandMore, MdOutlineFolder, MdOutlineSettings } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setIsSidePanelOpen, setParamConfig } from '../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import DownloadModal from '../modal/download-modal';
import { useState } from 'react';
import { useRootSelector } from '../../redux';
import { sanitiseParam } from '../../util/param-updater-utils';
import { downloadAs } from '../../util/utils';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events } from '../../constants/constants';

export default function HeaderActions() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [, setSearchParams] = useRootSearchParams();
    const { paramConfig } = useRootSelector(state => state.app);
    const param = useRootSelector(state => state.param);

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    const handleDownloadJson = () => {
        const sanitisedParam = sanitiseParam(param);
        downloadAs(`RMG_${paramConfig?.id}.json`, 'application/json', JSON.stringify(sanitisedParam));
        rmgRuntime.event(Events.DOWNLOAD_PARAM, { style: param.style });
    };

    const handleGoToSelectorView = () => {
        // reset param config to stop param update trigger
        dispatch(setIsSidePanelOpen(false));
        dispatch(setParamConfig(undefined));
        setSearchParams({});
    };

    const downloadMenuDropdown = (
        <Menu.Dropdown>
            <Menu.Item onClick={handleDownloadJson}>{t('DownloadActions.configFile')}</Menu.Item>
            <Menu.Item onClick={() => setIsDownloadModalOpen(true)}>{t('DownloadActions.images')}</Menu.Item>
        </Menu.Dropdown>
    );

    return (
        <Group ml="auto" gap="xs">
            <Button
                visibleFrom="xs"
                variant="default"
                leftSection={<MdOutlineFolder />}
                onClick={handleGoToSelectorView}
            >
                {t('All projects')}
            </Button>

            <Menu>
                <Menu.Target>
                    <Button
                        visibleFrom="xs"
                        variant="default"
                        leftSection={<MdOutlineDownload />}
                        rightSection={<MdOutlineExpandMore />}
                    >
                        {t('DownloadActions.downloads')}
                    </Button>
                </Menu.Target>
                {downloadMenuDropdown}
            </Menu>

            <Button
                visibleFrom="xs"
                leftSection={<MdOutlineSettings />}
                onClick={() => dispatch(setIsSidePanelOpen(true))}
            >
                {t('Settings')}
            </Button>

            <ActionIcon.Group hiddenFrom="xs">
                <ActionIcon
                    variant="default"
                    className={classes['mobile-action-icon']}
                    aria-label={t('All projects')}
                    title={t('All projects')}
                    onClick={handleGoToSelectorView}
                >
                    <MdOutlineFolder />
                </ActionIcon>

                <Menu>
                    <Menu.Target>
                        <ActionIcon
                            variant="default"
                            className={classes['mobile-action-icon']}
                            aria-label={t('DownloadActions.downloads')}
                            title={t('DownloadActions.downloads')}
                        >
                            <MdOutlineDownload />
                        </ActionIcon>
                    </Menu.Target>
                    {downloadMenuDropdown}
                </Menu>

                <ActionIcon
                    className={classes['mobile-action-icon']}
                    aria-label={t('Settings')}
                    title={t('Settings')}
                    onClick={() => dispatch(setIsSidePanelOpen(true))}
                >
                    <MdOutlineSettings />
                </ActionIcon>
            </ActionIcon.Group>

            <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
        </Group>
    );
}
