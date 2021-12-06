import {
    Button,
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
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColourHex, MonoColour, Theme } from '../../constants/constants';
import CityPicker from '../side-panel/city-picker';
import ColourPicker from '../side-panel/colour-picker';
import { CityCode } from '../../constants/city-config';
import EditableStack, { EditableField } from '../side-panel/editable-stack';
import RmgLineBadge from '../common/rmg-line-badge';
import { useTranslation } from 'react-i18next';

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

    const paletteFields: EditableField[] = [
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

    const customFields: EditableField[] = [
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

                        <Tabs
                            isFitted
                            variant="enclosed"
                            colorScheme="teal"
                            defaultIndex={cityCode === CityCode.Other ? 1 : 0}
                        >
                            <TabList>
                                <Tab>{t('ColourModal.palette')}</Tab>
                                <Tab>{t('ColourModal.custom')}</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <EditableStack fields={paletteFields} />
                                </TabPanel>
                                <TabPanel>
                                    <EditableStack fields={customFields} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="teal" onClick={handleSubmit} disabled={!isSubmitEnabled}>
                        {t('ColourModal.submit')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
