// 项目选择与管理界面：项目操作区。
import classes from './param-selector-view.module.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdAdd, MdDescription, MdInsertDriveFile, MdOpenInBrowser, MdUpload } from 'react-icons/md';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';
import { Events, RMGParam, RmgStyle } from '../../constants/constants';
import { insertParam } from '../../util/param-manager-utils';
import { readFileAsText } from '../../util/utils';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { initParam } from '../../redux/param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';
import RmgTemplatesAppClip from '../app-clip/rmg-templates-app-clip';
import { Button, Stack } from '@mantine/core';
import StationListImportModal from './station-list-import-modal';

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
    const [isStationListModalOpen, setIsStationListModalOpen] = useState(false);
    const jsonFileInputRef = useRef<HTMLInputElement>(null);
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

    const importParamJson = (paramStr: string, name?: string) => {
        const id = insertParam(paramStr, name);
        setSearchParams({ project: id });
        rmgRuntime.event(Events.UPLOAD_PARAM, {});
    };

    const handleImportProject = async (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const file = event.target.files?.[0];
        logger.info('handleImportProject(), received file', file);

        try {
            if (!file) {
                onError(t('OpenActions.unknownError'));
            } else if (file.type !== 'application/json' && !file.name.toLowerCase().endsWith('.json')) {
                onError(t('OpenActions.invalidType'));
            } else {
                const paramStr = await readFileAsText(file);
                importParamJson(paramStr);
            }
        } catch (err) {
            onError(t('OpenActions.unknownError'));
            logger.error('handleImportProject(), Unknown error occurred while parsing the uploaded file', err);
        } finally {
            // 清空字段以便下一次上传
            input.value = '';
        }
    };

    const handleImportStationList = (param: RMGParam, projectName: string) => {
        // TXT 先转换为 RMGParam，再序列化为 JSON，复用完整项目导入链路。
        importParamJson(JSON.stringify(param), projectName);
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
                onClick={() => jsonFileInputRef.current?.click()}
                disabled={disableNew}
            >
                {t('Import project')} (.json)
            </Button>
            <Button
                variant="default"
                leftSection={<MdDescription />}
                onClick={() => setIsStationListModalOpen(true)}
                disabled={disableNew}
            >
                {t('OpenActions.importStationList')}
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
                ref={jsonFileInputRef}
                type="file"
                accept=".json,application/json"
                hidden={true}
                onChange={handleImportProject}
                data-testid="json-file-upload"
            />
            <RmgTemplatesAppClip
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onImport={handleOpenTemplate}
            />
            <StationListImportModal
                isOpen={isStationListModalOpen}
                onClose={() => setIsStationListModalOpen(false)}
                onImport={handleImportStationList}
            />
        </Stack>
    );
}
