import {
    Button,
    Icon,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColourHex, MonoColour, Theme } from '../../../constants/constants';
import CityPicker from './city-picker';
import ColourPicker from './colour-picker';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { useTranslation } from 'react-i18next';
import { RmgFields, RmgFieldsField, RmgLineBadge } from '@railmapgen/rmg-components';
import { MdOpenInNew } from 'react-icons/md';

interface ColourModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTheme?: Theme;
    onUpdate?: (theme: Theme) => void;
}

export default function ColourModal(props: ColourModalProps) {
    const { isOpen, onClose, defaultTheme, onUpdate } = props;

    const { t } = useTranslation();

    const [cityCode, setCityCode] = useState(defaultTheme?.[0]);
    const [lineCode, setLineCode] = useState(defaultTheme?.[1]);
    const [bgColour, setBgColour] = useState(defaultTheme?.[2] || '#AAAAAA');
    const [fgColour, setFgColour] = useState(defaultTheme?.[3] || MonoColour.white);

    useEffect(() => {
        if (defaultTheme) {
            setCityCode(defaultTheme[0]);
            setLineCode(defaultTheme[1]);
            setBgColour(defaultTheme[2]);
            setFgColour(defaultTheme[3]);
        }
    }, [isOpen, defaultTheme?.toString()]);

    const paletteFields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('ColourModal.city'),
            component: (
                <CityPicker
                    defaultValueId={cityCode}
                    onChange={value => {
                        setCityCode(value);
                        setLineCode(undefined);
                        setBgColour('#AAAAAA');
                        setFgColour(MonoColour.white);
                    }}
                />
            ),
        },
        {
            type: 'custom',
            label: t('ColourModal.line'),
            component: (
                <ColourPicker
                    city={cityCode}
                    defaultValueId={lineCode}
                    onChange={(line, bg, fg) => {
                        setLineCode(line);
                        setBgColour(bg);
                        setFgColour(fg);
                    }}
                />
            ),
        },
    ];

    const customFields: RmgFieldsField[] = [
        {
            type: 'input',
            label: t('ColourModal.bg'),
            variant: 'color',
            value: bgColour,
            placeholder: '#F3D03E',
            onChange: value => {
                setCityCode(CityCode.Other);
                setLineCode('other');
                setBgColour(value as ColourHex);
            },
        },
        {
            type: 'select',
            label: t('ColourModal.fg'),
            value: fgColour,
            options: {
                [MonoColour.white]: t('ColourModal.white'),
                [MonoColour.black]: t('ColourModal.black'),
            },
            onChange: value => {
                setCityCode(CityCode.Other);
                setLineCode('other');
                setFgColour(value as MonoColour);
            },
        },
    ];

    const isSubmitEnabled = cityCode && lineCode && bgColour && fgColour;

    const handleSubmit = () => {
        if (isSubmitEnabled) {
            onUpdate?.([cityCode, lineCode, bgColour, fgColour]);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('ColourModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack>
                        <RmgLineBadge name={t('ColourModal.example')} fg={fgColour} bg={bgColour} />

                        <Tabs isFitted colorScheme="teal" w="100%" defaultIndex={cityCode === CityCode.Other ? 1 : 0}>
                            <TabList>
                                <Tab>{t('ColourModal.palette')}</Tab>
                                <Tab>{t('ColourModal.custom')}</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <RmgFields fields={paletteFields} />
                                </TabPanel>
                                <TabPanel>
                                    <RmgFields fields={customFields} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Text fontSize="sm" marginRight={2}>
                        {t('ColourModal.seeAll')}
                        <Link color="teal.500" href="/rmg-palette" isExternal={true}>
                            RMG Palette <Icon as={MdOpenInNew} />
                        </Link>
                    </Text>

                    <Button colorScheme="teal" onClick={handleSubmit} disabled={!isSubmitEnabled}>
                        {t('ColourModal.submit')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
