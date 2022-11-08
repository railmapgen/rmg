import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useSearchParams } from 'react-router-dom';
import { Button, Container, Heading, HStack, SystemStyleObject, useOutsideClick, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdInsertDriveFile, MdOpenInBrowser, MdUpload } from 'react-icons/md';
import { nanoid } from 'nanoid';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, LocalStorageKey, ParamConfig } from '../../constants/constants';
import ParamSelector from '../param-selector-view/param-selector';
import { getParamRegistry, importParam } from '../../util/param-manager-utils';
import TemplateModal from '../modal/template-modal';
import { readFileAsText } from '../../util/utils';

const paramSelectorCardStyle: SystemStyleObject = {
    flexDirection: 'column',
    p: 2,

    h3: {
        m: 2,
    },

    '& > div': {
        m: 2,
        flexWrap: 'wrap',

        '& > div:last-of-type': {
            alignSelf: 'flex-end',

            '& button': {
                w: '100%',
            },
        },
    },
};

export default function ParamSelectorView() {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const urlParamId = searchParams.get('project');

    const [paramRegistry, setParamRegistry] = useState<ParamConfig[]>([]);
    const [selectedParam, setSelectedParam] = useState<string>();
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // init paramRegistry state once
        setParamRegistry(getParamRegistry());
    }, []);

    useOutsideClick({ ref: selectorRef, handler: () => setSelectedParam(undefined) });

    const handleNew = () => {
        setSearchParams({ project: nanoid() });
        rmgRuntime.event(Events.NEW_PARAM, {});
    };

    const handleOpenTemplate = (param: Record<string, any>) => {
        const id = importParam(JSON.stringify(param));
        setSearchParams({ project: id });
    };

    const handleImportProject = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('handleImportProject():: received file', file);

        try {
            if (file?.type !== 'application/json') {
                // TODO
                // dispatch(setGlobalAlert({ status: 'error', message: t('OpenActions.invalidType') }));
            }

            const paramStr = await readFileAsText(file!);
            const id = importParam(paramStr);
            setSearchParams({ project: id });
            rmgRuntime.event(Events.UPLOAD_PARAM, {});
        } catch (err) {
            // TODO
            // dispatch(setGlobalAlert({ status: 'error', message: t('OpenActions.unknownError') }));
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

    const handleDelete = (id: string) => {
        window.localStorage.removeItem(LocalStorageKey.PARAM_BY_ID + id);
        window.localStorage.removeItem(LocalStorageKey.PARAM_CONFIG_BY_ID + id);

        setSelectedParam(undefined);
        setParamRegistry(getParamRegistry());

        rmgRuntime.event(Events.REMOVE_PARAM, {});
    };

    const isProjectLimitReached = paramRegistry.length >= 10;

    return (
        <RmgPage justifyContent="center">
            {urlParamId && <RmgLoader isIndeterminate />}
            <Container>
                <RmgCard sx={paramSelectorCardStyle}>
                    <Heading as="h3" size="lg">
                        {t('Saved projects')}
                    </Heading>

                    <HStack ref={selectorRef}>
                        <ParamSelector
                            paramRegistry={paramRegistry}
                            selectedParam={selectedParam}
                            onParamSelect={setSelectedParam}
                            onParamRemove={handleDelete}
                        />

                        <VStack>
                            <Button leftIcon={<MdAdd />} onClick={handleNew} isDisabled={isProjectLimitReached}>
                                {t('Blank project')}
                            </Button>
                            <Button
                                leftIcon={<MdInsertDriveFile />}
                                onClick={() => setIsTemplateModalOpen(true)}
                                isDisabled={isProjectLimitReached}
                            >
                                {t('Open template')}
                            </Button>
                            <Button
                                leftIcon={<MdUpload />}
                                onClick={() => fileInputRef.current?.click()}
                                isDisabled={isProjectLimitReached}
                            >
                                {t('Import project')}
                            </Button>
                            <Button
                                colorScheme="primary"
                                leftIcon={<MdOpenInBrowser />}
                                onClick={handleOpenSelected}
                                isDisabled={selectedParam === undefined}
                            >
                                {t('Open selected')}
                            </Button>
                        </VStack>
                    </HStack>
                </RmgCard>
            </Container>

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
        </RmgPage>
    );
}
