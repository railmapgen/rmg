import classes from './param-selector-view.module.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdAdd, MdInsertDriveFile, MdOpenInBrowser, MdUpload } from 'react-icons/md';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';
import { Events, RmgStyle } from '../../constants/constants';
import { insertParam } from '../../util/param-manager-utils';
import { readFileAsText } from '../../util/utils';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { initParam } from '../../redux/param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';
import RmgTemplatesAppClip from '../app-clip/rmg-templates-app-clip';
import { Button, Stack } from '@mantine/core';

interface SelectorActionsProps {
    selectedParam?: string;
    disableNew?: boolean;
    onError: (msg: string) => void;
}

export default function SelectorActions(props: SelectorActionsProps) {
    const { selectedParam, disableNew, onError } = props;
    const { t } = useTranslation();

    const [, setSearchParams] = useRootSearchParams();

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const openSelectedRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (selectedParam) {
            openSelectedRef.current?.focus();
        }
    }, [selectedParam]);

    const handleNew = () => {
        const newParam = initParam(RmgStyle.MTR, rmgRuntime.getLanguage() as LanguageCode);
        const id = insertParam(JSON.stringify(newParam));
        setSearchParams({ project: id });
        rmgRuntime.event(Events.NEW_PARAM, {});
    };

    const handleOpenTemplate = (param: Record<string, any>, name: string) => {
        const id = insertParam(JSON.stringify(param), name);
        setSearchParams({ project: id });
    };

    const handleImportProject = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        logger.info('handleImportProject(), received file', file);

        try {
            if (!file) {
                onError(t('OpenActions.unknownError'));
            } else if (file.type !== 'application/json') {
                onError(t('OpenActions.invalidType'));
            } else {
                const paramStr = await readFileAsText(file);
                const id = insertParam(paramStr);
                setSearchParams({ project: id });
                rmgRuntime.event(Events.UPLOAD_PARAM, {});
            }
        } catch (err) {
            onError(t('OpenActions.unknownError'));
            logger.error('handleImportProject(), Unknown error occurred while parsing the uploaded file', err);
        }

        // clear field for next upload
        event.target.value = '';
    };

    const handleOpenSelected = () => {
        if (selectedParam) {
            setSearchParams({ project: selectedParam });
            rmgRuntime.event(Events.OPEN_PARAM, {});
        }
    };

    return (
        <Stack className={classes.actions}>
            <Button variant="light" leftSection={<MdAdd />} onClick={handleNew} disabled={disableNew}>
                {t('Blank project')}
            </Button>
            <Button
                variant="default"
                leftSection={<MdInsertDriveFile />}
                onClick={() => setIsTemplateModalOpen(true)}
                disabled={disableNew}
            >
                {t('Open template')}
            </Button>
            <Button
                variant="default"
                leftSection={<MdUpload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={disableNew}
            >
                {t('Import project')}
            </Button>
            <Button
                ref={openSelectedRef}
                leftSection={<MdOpenInBrowser />}
                onClick={handleOpenSelected}
                disabled={selectedParam === undefined}
            >
                {t('Open selected')}
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                hidden={true}
                onChange={handleImportProject}
                data-testid="file-upload"
            />
            <RmgTemplatesAppClip
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onImport={handleOpenTemplate}
            />
        </Stack>
    );
}
