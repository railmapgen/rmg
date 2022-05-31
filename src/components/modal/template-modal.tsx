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
import { translateText } from '../../i18n/config';
import { useAppDispatch } from '../../redux';
import { setIsLoading } from '../../redux/app/action';
import { companyConfig, templateList } from '@railmapgen/rmg-templates-resources';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenParam: (param: Record<string, any>) => void;
}

export default function TemplateModal(props: TemplateModalProps) {
    const { isOpen, onClose, onOpenParam } = props;

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleSelect = async (company: string, filename: string) => {
        dispatch(setIsLoading(true));
        const module = await import(
            /* webpackChunkName: "templates" */ `@railmapgen/rmg-templates-resources/templates/${company}/${filename}.json`
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