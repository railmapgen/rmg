import React from 'react';
import { Button, HStack } from '@chakra-ui/react';
import DownloadActions from './download-actions';
import { MdFolder, MdPalette } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { SidePanelMode } from '../../constants/constants';
import { setParamConfig, setSidePanelMode } from '../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import OpenActions from './open-actions';
import rmgRuntime, { RmgEnv } from '@railmapgen/rmg-runtime';
import { useSearchParams } from 'react-router-dom';

export default function HeaderActions() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [, setSearchParams] = useSearchParams();

    const handleGoToSelectorView = () => {
        // reset param config to stop param update trigger
        dispatch(setParamConfig(undefined));
        setSearchParams({});
    };

    return (
        <HStack ml="auto" w="fit-content">
            {rmgRuntime.getEnv() !== RmgEnv.PRD && (
                <Button variant="ghost" size="sm" leftIcon={<MdFolder />} onClick={handleGoToSelectorView}>
                    {t('All projects')}
                </Button>
            )}

            <DownloadActions />

            {rmgRuntime.getEnv() === RmgEnv.PRD && <OpenActions />}

            <Button
                variant="solid"
                size="sm"
                colorScheme="primary"
                leftIcon={<MdPalette />}
                onClick={() => dispatch(setSidePanelMode(SidePanelMode.STYLE))}
            >
                {t('HeaderActions.editStyle')}
            </Button>
        </HStack>
    );
}
