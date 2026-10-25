// 项目选择与管理界面：TXT 车站列表导入对话框。
import classes from './station-list-import-modal.module.css';
import commonClasses from '../modal/common-modal.module.css';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageCode } from '@railmapgen/rmg-translate';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';
import { MdDescription } from 'react-icons/md';
import {
    Alert,
    Button,
    Group,
    Modal,
    NativeSelect,
    Stack,
    Text,
    Textarea,
    TextInput,
    UnstyledButton,
} from '@mantine/core';
import clsx from 'clsx';
import { Name, RMGParam, RmgStyle } from '../../constants/constants';
import { initParam } from '../../redux/param/util';
import { readFileAsText } from '../../util/utils';
import { convertStationListToParam, StationListImportError } from '../../util/station-list-import-utils';

interface StationListImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (param: RMGParam, name: string) => void;
}

const DEFAULT_STYLE = RmgStyle.GZMTR;

const getDefaultLineName = (): Name => {
    return initParam(DEFAULT_STYLE, rmgRuntime.getLanguage() as LanguageCode).line_name;
};

export default function StationListImportModal(props: StationListImportModalProps) {
    const { isOpen, onClose, onImport } = props;
    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [style, setStyle] = useState<RmgStyle>(DEFAULT_STYLE);
    const [lineName, setLineName] = useState<Name>(getDefaultLineName);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(undefined);
            setStyle(DEFAULT_STYLE);
            setLineName(getDefaultLineName());
            setIsDragging(false);
            setIsSubmitting(false);
            setError(undefined);
        }
    }, [isOpen]);

    const selectFile = (file?: File) => {
        setError(undefined);
        if (!file) return;

        if (file.type !== 'text/plain' && !file.name.toLowerCase().endsWith('.txt')) {
            setSelectedFile(undefined);
            setError(t('OpenActions.invalidTextType'));
            return;
        }

        setSelectedFile(file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        selectFile(event.currentTarget.files?.[0]);
        // 清空字段，以便再次选择同一个文件时仍会触发 change。
        event.currentTarget.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    const handleDragEnter = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDragging(false);
        selectFile(event.dataTransfer.files?.[0]);
    };

    const handleCreate = async () => {
        if (!selectedFile) return;

        setIsSubmitting(true);
        setError(undefined);
        try {
            const text = await readFileAsText(selectedFile);
            const param = convertStationListToParam(text, rmgRuntime.getLanguage() as LanguageCode, style);
            param.line_name = [lineName[0].trim(), lineName[1].trim()];

            const projectName = selectedFile.name.replace(/\.[^.]+$/, '') || t('OpenActions.importStationList');
            onImport(param, projectName);
        } catch (err) {
            setError(
                t(err instanceof StationListImportError ? 'OpenActions.invalidStationList' : 'OpenActions.unknownError')
            );
            logger.error('StationListImportModal(), Failed to import the station list', err);
            setIsSubmitting(false);
        }
    };

    const styleOptions = Object.values(RmgStyle).map(value => ({
        value,
        label: t('RmgStyle.' + value),
    }));
    const isCreateDisabled = !selectedFile || !lineName[0].trim() || !lineName[1].trim();

    return (
        <Modal opened={isOpen} onClose={onClose} size="lg" title={t('OpenActions.importStationList')}>
            <Stack>
                <Stack className={commonClasses.body}>
                    <UnstyledButton
                        className={clsx(classes.dropzone, { [classes.dragging]: isDragging })}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        data-testid="station-list-dropzone"
                        aria-label={t('OpenActions.dropzoneTitle')}
                    >
                        <MdDescription size={40} />
                        {selectedFile ? (
                            <>
                                <Text fw={600} truncate>
                                    {selectedFile.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {t('OpenActions.fileSelected')}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text fw={600}>{t('OpenActions.dropzoneTitle')}</Text>
                                <Text size="sm" c="dimmed">
                                    {t('OpenActions.dropzoneDescription')}
                                </Text>
                            </>
                        )}
                    </UnstyledButton>

                    <Textarea
                        label={t('OpenActions.formatLabel')}
                        value={t('OpenActions.formatRules')}
                        readOnly
                        rows={7}
                    />
                </Stack>

                <Group className={commonClasses.body} align="flex-start">
                    <TextInput
                        label={t('OpenActions.zhLineName')}
                        value={lineName[0]}
                        onChange={({ currentTarget: { value } }) => setLineName([value, lineName[1]])}
                    />
                    <TextInput
                        label={t('OpenActions.enLineName')}
                        value={lineName[1]}
                        onChange={({ currentTarget: { value } }) => setLineName([lineName[0], value])}
                    />
                    <NativeSelect
                        label={t('OpenActions.targetStyle')}
                        value={style}
                        data={styleOptions}
                        onChange={({ currentTarget: { value } }) => setStyle(value as RmgStyle)}
                        style={{ minWidth: 180 }}
                    />
                </Group>

                {error && (
                    <Alert color="red" variant="light" role="alert">
                        {error}
                    </Alert>
                )}

                <Group className={commonClasses.footer}>
                    <Button variant="default" onClick={onClose}>
                        {t('OpenActions.cancel')}
                    </Button>
                    <Button onClick={handleCreate} disabled={isCreateDisabled} loading={isSubmitting}>
                        {t('OpenActions.create')}
                    </Button>
                </Group>
            </Stack>

            <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                hidden
                onChange={handleFileChange}
                data-testid="station-list-file-upload"
            />
        </Modal>
    );
}
