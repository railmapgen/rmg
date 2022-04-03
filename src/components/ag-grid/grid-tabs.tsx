import React, { useState } from 'react';
import { Box, Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import AddStationModal from '../modal/add-station-modal';
import { useAppDispatch, useAppSelector } from '../../redux';
import { RmgStyle, SidePanelMode } from '../../constants/constants';
import StationAgGrid from './station-ag-grid';
import { isColineBranch } from '../../redux/param/coline-action';
import { setSelectedBranch, setSidePanelMode } from '../../redux/app/action';
import { useTranslation } from 'react-i18next';

export default function GridTabs() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);

    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);

    const handleEditLineSection = () => {
        dispatch(setSidePanelMode(SidePanelMode.BRANCH));
    };

    return (
        <Box flex={1} overflow="hidden">
            <Tabs
                height="100%"
                display="flex"
                flexDirection="column"
                overflow="hidden"
                onChange={index => dispatch(setSelectedBranch(index))}
            >
                <TabList>
                    {branches.map((branch, i) => {
                        if (i === 0) {
                            return <Tab key={i}>{t('GridTabs.main')}</Tab>;
                        } else {
                            if (style !== RmgStyle.SHMetro || !isColineBranch(branch, stationList)) {
                                return <Tab key={i}>{t('GridTabs.branch') + ' ' + i}</Tab>;
                            } else {
                                return <Tab key={i}>{t('GridTabs.external') + ' ' + i}</Tab>;
                            }
                        }
                    })}

                    <HStack marginLeft="auto" marginRight={1}>
                        <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<MdAdd />}
                            onClick={() => setIsAddStationModalOpen(true)}
                        >
                            {t('GridTabs.addStation')}
                        </Button>
                        <Button size="xs" colorScheme="teal" onClick={handleEditLineSection}>
                            {t('GridTabs.editLine')}
                        </Button>
                    </HStack>
                </TabList>

                <TabPanels flex={1} overflowY="auto">
                    {branches.map((_, i) => (
                        <TabPanel key={i} padding={0} h="100%">
                            <StationAgGrid branchIndex={i} />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>

            <AddStationModal isOpen={isAddStationModalOpen} onClose={() => setIsAddStationModalOpen(false)} />
        </Box>
    );
}
