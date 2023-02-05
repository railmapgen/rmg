import React, { useEffect, useState } from 'react';
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
import { coreCompanyConfig, coreTemplateList } from '@railmapgen/rmg-templates-resources';
import { startLoading, stopLoading } from '../../redux/app/app-slice';
import { Events } from '../../constants/constants';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RmgEnrichedButton } from '@railmapgen/rmg-components';
import { fetchOtherCompanyConfig, fetchTemplate, fetchTemplatesByCompany } from '../../service/rmg-templates-service';

const templatesGlob = import.meta.glob('/node_modules/@railmapgen/rmg-templates-resources/templates/**/*.json');

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenParam: (param: Record<string, any>, name: string) => void;
}

export default function TemplateModal(props: TemplateModalProps) {
    const { isOpen, onClose, onOpenParam } = props;

    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const [companyConfig, setCompanyConfig] = useState(coreCompanyConfig);
    const [templateList, setTemplateList] = useState(coreTemplateList);

    useEffect(() => {
        fetchOtherCompanyConfig().then(otherConfig => {
            setCompanyConfig([...coreCompanyConfig, ...otherConfig]);
            for (const company of otherConfig) {
                fetchTemplatesByCompany(company.id).then(templates => {
                    setTemplateList(prevState => ({ ...prevState, [company.id]: templates }));
                });
            }
        });
    }, []);

    const handleSelect = async (company: string, filename: string, displayName: string) => {
        dispatch(startLoading());

        const companyEntry = companyConfig.find(entry => entry.id === company);
        const companyDisplayName = companyEntry ? translateText(companyEntry.name) : company;
        const isCore = coreCompanyConfig.some(entry => entry.id === company);

        try {
            const param = isCore
                ? (
                      (await templatesGlob[
                          `/node_modules/@railmapgen/rmg-templates-resources/templates/${company}/${filename}.json`
                      ]()) as any
                  ).default
                : await fetchTemplate(company, filename);
            onOpenParam(param, [companyDisplayName, displayName].join(' '));
        } catch (e) {
            console.error('Failed to fetch template', e);
        }
        rmgRuntime.event(Events.OPEN_TEMPLATE, { company, filename });
        dispatch(stopLoading());
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
                                        {templates.map(template => {
                                            const displayName = translateText(template.name);
                                            return (
                                                <RmgEnrichedButton
                                                    key={template.filename}
                                                    variant="ghost"
                                                    size="sm"
                                                    primaryText={displayName}
                                                    secondaryText={t('by') + ': ' + (template.uploadBy ?? 'Unknown')}
                                                    onClick={() =>
                                                        handleSelect(company, template.filename, displayName)
                                                    }
                                                />
                                            );
                                        })}
                                    </TabPanel>
                                ))}
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
