import { useState } from 'react';
import { Heading, HStack, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdHelp, MdRedo, MdUndo } from 'react-icons/md';
import HelpModal from '../modal/help-modal';
import { RmgEnvBadge, RmgWindowHeader } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { useRootDispatch, useRootSelector } from '../../redux';
import { redo, undo } from '../../redux/undo/undo-middleware';
import { useHotkeys } from 'react-hotkeys-hook';

export const WindowHeader = () => {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const { pastCount, futureCount } = useRootSelector(state => state.undo);

    const environment = rmgRuntime.getEnv();
    const appVersion = rmgRuntime.getAppVersion();

    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const isMacClient = navigator.platform.startsWith('Mac');
    let undoHotkeys, redoHotkeys;

    if (isMacClient) {
        undoHotkeys = 'meta+z';
        redoHotkeys = 'meta+shift+z';
    } else {
        undoHotkeys = 'ctrl+z';
        redoHotkeys = 'ctrl+y';
    }

    useHotkeys(
        undoHotkeys,
        e => {
            e.preventDefault();
            if (pastCount > 0) dispatch(undo());
        },
        { enableOnFormTags: true },
        [pastCount]
    );

    useHotkeys(
        redoHotkeys,
        e => {
            e.preventDefault();
            if (futureCount > 0) dispatch(redo());
        },
        { enableOnFormTags: true },
        [futureCount]
    );

    return (
        <RmgWindowHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator')}
            </Heading>
            <RmgEnvBadge environment={environment} version={appVersion} />

            <HStack ml="auto">
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Undo"
                    icon={<MdUndo />}
                    isDisabled={pastCount === 0}
                    onClick={() => dispatch(undo())}
                />
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Redo"
                    icon={<MdRedo />}
                    isDisabled={futureCount === 0}
                    onClick={() => dispatch(redo())}
                />
                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Help"
                    icon={<MdHelp />}
                    onClick={() => setIsHelpModalOpen(true)}
                />
            </HStack>

            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </RmgWindowHeader>
    );
};
export const ImportViewWindowHeader = () => {
    const { t } = useTranslation();

    return (
        <RmgWindowHeader isAppClipHeader>
            <Heading as="h4" size="md">
                {t('Rail Map Generator') + ' - ' + t('Project Selector')}
            </Heading>
        </RmgWindowHeader>
    );
};
