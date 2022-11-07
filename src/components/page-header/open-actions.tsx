import React, { ChangeEvent, useRef, useState } from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { MdExpandMore, MdInsertDriveFile, MdNoteAdd, MdUpload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { updateParam } from '../../utils';
import { readFileAsText } from '../../util/utils';
import UploadConfirmModal from '../modal/upload-confirm-modal';
import { setGlobalAlert } from '../../redux/app/app-slice';
import { RMGParam } from '../../constants/constants';
import TemplateModal from '../modal/template-modal';
import { openFromNewParam } from '../../redux/param/open-new-action';
import { initParam } from '../../redux/param/util';
import { useRootDispatch, useRootSelector } from '../../redux';
import { LanguageCode } from '@railmapgen/rmg-translate';

/**
 * @deprecated
 */
export default function OpenActions() {
    const { t, i18n } = useTranslation();
    const dispatch = useRootDispatch();

    const style = useRootSelector(state => state.param.style);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [uploadedParam, setUploadedParam] = useState<RMGParam | undefined>(undefined);

    const uploadModalCloseRef = useRef<HTMLButtonElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('OpenActions.handleUpload():: received file', file);

        if (file?.type !== 'application/json') {
            dispatch(setGlobalAlert({ status: 'error', message: t('OpenActions.invalidType') }));
        } else {
            try {
                const paramStr = await readFileAsText(file);
                const updatedParam = updateParam(JSON.parse(paramStr));
                setUploadedParam(updatedParam as RMGParam);
                setIsUploadModalOpen(true);
            } catch (err) {
                dispatch(setGlobalAlert({ status: 'error', message: t('OpenActions.unknownError') }));
                console.error(
                    'OpenActions.handleUpload():: Unknown error occurred while parsing the uploaded file',
                    err
                );
            }
        }

        // clear field for next upload
        event.target.value = '';
    };

    const handleOpenParam = (param: Record<string, any>) => {
        dispatch(openFromNewParam(param));
    };

    return (
        <Menu>
            <MenuButton as={Button} variant="ghost" size="sm" rightIcon={<MdExpandMore />}>
                {t('OpenActions.openFrom')}
            </MenuButton>
            <MenuList>
                <MenuItem
                    icon={<MdNoteAdd />}
                    onClick={() => handleOpenParam(initParam(style, i18n.language as LanguageCode))}
                >
                    {t('Empty template')}
                </MenuItem>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    hidden={true}
                    onChange={handleUpload}
                    data-testid="file-upload"
                />
                <MenuItem icon={<MdUpload />} onClick={() => fileInputRef?.current?.click()}>
                    {t('OpenActions.upload')}
                </MenuItem>

                <MenuItem icon={<MdInsertDriveFile />} onClick={() => setIsTemplateModalOpen(true)}>
                    {t('OpenActions.templates')}
                </MenuItem>
            </MenuList>

            <UploadConfirmModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                cancelRef={uploadModalCloseRef}
                uploadedParam={uploadedParam}
                onOpenParam={handleOpenParam}
            />

            <TemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onOpenParam={handleOpenParam}
            />
        </Menu>
    );
}
