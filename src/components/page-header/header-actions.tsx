import DownloadActions from './download-actions';
import { MdOutlineFolder, MdOutlinePalette } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { SidePanelMode } from '../../constants/constants';
import { setParamConfig, setSidePanelMode } from '../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { Button } from '@mantine/core';

export default function HeaderActions() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [, setSearchParams] = useRootSearchParams();

    const handleGoToSelectorView = () => {
        // reset param config to stop param update trigger
        dispatch(setSidePanelMode(SidePanelMode.CLOSE));
        dispatch(setParamConfig(undefined));
        setSearchParams({});
    };

    return (
        <>
            <Button variant="default" leftSection={<MdOutlineFolder />} ml="auto" onClick={handleGoToSelectorView}>
                {t('All projects')}
            </Button>

            <DownloadActions />

            <Button leftSection={<MdOutlinePalette />} onClick={() => dispatch(setSidePanelMode(SidePanelMode.STYLE))}>
                {t('HeaderActions.editStyle')}
            </Button>
        </>
    );
}
