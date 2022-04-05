import React from 'react';
import {
    Button,
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
import { companies } from '../../constants/company-config';
import { templateList } from '../../constants/templates/data';
import { translateText } from '../../i18n/config';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenParam: (param: Record<string, any>) => void;
}

export default function TemplateModal(props: TemplateModalProps) {
    const { isOpen, onClose, onOpenParam } = props;

    const { t } = useTranslation();

    const handleSelect = async (company: string, filename: string) => {
        const module = await import(
            /* webpackChunkName: "templates" */ `../../constants/templates/${company}/${filename}`
        );
        onOpenParam(module.default);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('TemplateModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Tabs isLazy size="sm" orientation="vertical">
                        <TabList maxW={150}>
                            {companies.map(company => (
                                <Tab key={company.id}>{translateText(company.name)}</Tab>
                            ))}
                        </TabList>

                        <TabPanels maxW={250}>
                            {Object.entries(templateList)
                                .sort(
                                    (a, b) =>
                                        companies.findIndex(c => c.id === a[0]) -
                                        companies.findIndex(c => c.id === b[0])
                                )
                                .map(([company, templates]) => (
                                    <TabPanel key={company} as={Flex} flexDirection="column" py={0} px={1}>
                                        {templates.map(template => (
                                            <Button
                                                key={template.filename}
                                                variant="ghost"
                                                size="sm"
                                                justifyContent="flex-start"
                                                overflow="hidden"
                                                onClick={() => handleSelect(company, template.filename)}
                                            >
                                                {translateText(template.name)}
                                            </Button>
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
