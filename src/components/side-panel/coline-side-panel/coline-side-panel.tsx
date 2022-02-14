import React, { ReactNode } from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import InfoSection from './info-section';
import ColineSection from './coline-section';
import { SidePanelMode } from '../../../constants/constants';
import { setSidePanelMode } from '../../../redux/app/action';

type SidePanelSection = {
    title: string;
    children: ReactNode;
};

export default function ColineSidePanel() {
    const dispatch = useDispatch();
    const selectedColine = useAppSelector(state => state.app.selectedColine);
    const { coline } = useAppSelector(state => state.param);

    // close the side panel when selectedColine is invalid
    if (selectedColine === undefined || selectedColine >= coline.length) {
        dispatch(setSidePanelMode(SidePanelMode.CLOSE));
        return <></>;
    }

    const sidePanelFields: SidePanelSection[] = [
        { title: 'Basic info', children: <InfoSection /> },
        { title: 'Share track with', children: <ColineSection /> },
    ];

    return (
        <Accordion allowMultiple allowToggle overflowY="auto">
            {sidePanelFields.map((field, i) => (
                <AccordionItem key={i}>
                    <h2>
                        <AccordionButton size="xs">
                            <Box flex="1" textAlign="left">
                                {field.title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel p={1}>{field.children}</AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
