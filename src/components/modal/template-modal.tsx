import React from 'react';
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../../i18n/config';
import { useRootDispatch } from '../../redux';
import { companyConfig, templateList } from '@railmapgen/rmg-templates-resources';
import { startLoading } from '../../redux/app/app-slice';
import { Events } from '../../constants/constants';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RmgEnrichedButton } from '@railmapgen/rmg-components';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenParam: (param: Record<string, any>) => void;
}

export default function TemplateModal(props: TemplateModalProps) {
    const { isOpen, onClose, onOpenParam } = props;

    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const handleSelect = async (company: string, filename: string) => {
        dispatch(startLoading());
        const module = await import(
            /* webpackChunkName: "templates" */ `@railmapgen/rmg-templates-resources/templates/${company}/${filename}.json`
        );
        onOpenParam(module.default);
        rmgRuntime.event(Events.OPEN_TEMPLATE, { company, filename });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('TemplateModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Tabs isLazy size="sm" orientation="vertical" colorScheme="primary">
                        <TabList maxW={150}>
                            {companyConfig.map(company => (
                                <Tab key={company.id}>{translateText(company.name)}</Tab>
                            ))}
                        </TabList>

                        <TabPanels maxW={250}>
                            {Object.entries(templateList)
                                .sort(
                                    (a, b) =>
                                        companyConfig.findIndex(c => c.id === a[0]) -
                                        companyConfig.findIndex(c => c.id === b[0])
                                )
                                .map(([company, templates]) => (
                                    <TabPanel key={company} as={Flex} flexDirection="column" py={0} px={1}>
                                        {templates.map(template => (
                                            <RmgEnrichedButton
                                                key={template.filename}
                                                variant="ghost"
                                                size="sm"
                                                primaryText={translateText(template.name)}
                                                secondaryText={t('by') + ': ' + (template.uploadBy ?? 'Unknown')}
                                                onClick={() => handleSelect(company, template.filename)}
                                            />
                                        ))}
                                    </TabPanel>
                                ))}
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
