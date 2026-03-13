import DownloadActions from './download-actions';
import { MdOutlineFolder, MdOutlineSettings } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setIsSidePanelOpen, setParamConfig } from '../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { ActionIcon, Button } from '@mantine/core';

export default function HeaderActions() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [, setSearchParams] = useRootSearchParams();

    const handleGoToSelectorView = () => {
        // reset param config to stop param update trigger
        dispatch(setIsSidePanelOpen(false));
        dispatch(setParamConfig(undefined));
        setSearchParams({});
    };

    return (
        <>
            <Button
                visibleFrom="xs"
                variant="default"
                leftSection={<MdOutlineFolder />}
                ml="auto"
                onClick={handleGoToSelectorView}
            >
                {t('All projects')}
            </Button>
            <ActionIcon
                hiddenFrom="xs"
                variant="default"
                size="2.25rem"
                aria-label={t('All projects')}
                title={t('All projects')}
                ml="auto"
                onClick={handleGoToSelectorView}
            >
                <MdOutlineFolder />
            </ActionIcon>

            <DownloadActions />

            <Button
                visibleFrom="xs"
                leftSection={<MdOutlineSettings />}
                onClick={() => dispatch(setIsSidePanelOpen(true))}
            >
                {t('Settings')}
            </Button>
            <ActionIcon
                hiddenFrom="xs"
                size="2.25rem"
                aria-label={t('Settings')}
                title={t('Settings')}
                onClick={() => dispatch(setIsSidePanelOpen(true))}
            >
                <MdOutlineSettings />
            </ActionIcon>
        </>
    );
}
