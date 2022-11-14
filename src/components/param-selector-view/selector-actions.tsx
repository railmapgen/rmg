import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, Flex, SystemStyleObject } from '@chakra-ui/react';
import { MdAdd, MdInsertDriveFile, MdOpenInBrowser, MdUpload } from 'react-icons/md';
import TemplateModal from '../modal/template-modal';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, RmgStyle } from '../../constants/constants';
import { importParam } from '../../util/param-manager-utils';
import { readFileAsText } from '../../util/utils';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { initParam } from '../../redux/param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';

interface SelectorActionsProps {
    selectedParam?: string;
    disableNew?: boolean;
    onError: (msg: string) => void;
}

const styles: SystemStyleObject = {
    flexWrap: 'wrap',
    flex: '1 1 0%',
    minW: 120,

    '& button': {
        w: '100%',
        m: 1,
    },
};

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
        const id = importParam(JSON.stringify(newParam));
        setSearchParams({ project: id });
        rmgRuntime.event(Events.NEW_PARAM, {});
    };

    const handleOpenTemplate = (param: Record<string, any>, name: string) => {
        const id = importParam(JSON.stringify(param), name);
        setSearchParams({ project: id });
    };

    const handleImportProject = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('handleImportProject():: received file', file);

        try {
            if (file?.type !== 'application/json') {
                onError(t('OpenActions.invalidType'));
            } else {
                const paramStr = await readFileAsText(file!);
                const id = importParam(paramStr);
                setSearchParams({ project: id });
                rmgRuntime.event(Events.UPLOAD_PARAM, {});
            }
        } catch (err) {
            onError(t('OpenActions.unknownError'));
            console.error('handleImportProject():: Unknown error occurred while parsing the uploaded file', err);
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
        <Flex sx={styles}>
            <Button leftIcon={<MdAdd />} onClick={handleNew} isDisabled={disableNew}>
                {t('Blank project')}
            </Button>
            <Button
                leftIcon={<MdInsertDriveFile />}
                onClick={() => setIsTemplateModalOpen(true)}
                isDisabled={disableNew}
            >
                {t('Open template')}
            </Button>
            <Button leftIcon={<MdUpload />} onClick={() => fileInputRef.current?.click()} isDisabled={disableNew}>
                {t('Import project')}
            </Button>
            <Button
                ref={openSelectedRef}
                colorScheme="primary"
                leftIcon={<MdOpenInBrowser />}
                onClick={handleOpenSelected}
                isDisabled={selectedParam === undefined}
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
            <TemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onOpenParam={handleOpenTemplate}
            />
        </Flex>
    );
}
