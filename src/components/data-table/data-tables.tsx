import React, { useState } from 'react';
import StationDataTable from './station-data-table';
import ColineDataTable from './coline-data-table';
import { Box, Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import AddStationModal from '../modal/add-station-modal';
import { useAppSelector } from '../../redux';

export default function DataTables() {
    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);

    const branches = useAppSelector(state => state.helper.branches);

    return (
        <Box flex={1} overflow="hidden">
            <Tabs height="100%" display="flex" flexDirection="column" overflow="hidden">
                <TabList>
                    {branches.map((_, i) => (i === 0 ? <Tab key={i}>Main line</Tab> : <Tab key={i}>Branch {i}</Tab>))}

                    <Tab>Track sharing</Tab>

                    <HStack marginLeft="auto" marginRight={1}>
                        <Button
                            variant="ghost"
                            size="xs"
                            leftIcon={<MdAdd />}
                            onClick={() => setIsAddStationModalOpen(true)}
                        >
                            Add station
                        </Button>
                    </HStack>
                </TabList>

                <TabPanels flex={1} overflowY="auto">
                    {branches.map((branch, i) => (
                        <TabPanel key={i} padding={0}>
                            <StationDataTable
                                stationIds={branch.filter(id => !['linestart', 'lineend'].includes(id))}
                            />
                        </TabPanel>
                    ))}

                    <TabPanel padding={0}>
                        <ColineDataTable />
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <AddStationModal isOpen={isAddStationModalOpen} onClose={() => setIsAddStationModalOpen(false)} />
        </Box>
    );
}
