import React, { useState } from 'react';
import ColineDataTable from './coline-data-table';
import { Box, Button, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import AddStationModal from '../modal/add-station-modal';
import { useAppSelector } from '../../redux';
import { RmgStyle } from '../../constants/constants';
import StationAgGrid from '../ag-grid/station-ag-grid';
import { isColineBranch } from '../../redux/param/coline-action';

export default function DataTables() {
    const [tabIndex, setTabIndex] = useState(0);
    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);

    const isShareTrackDisabled = useAppSelector(state => state.app.isShareTrackDisabled);
    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);

    return (
        <Box flex={1} overflow="hidden">
            <Tabs height="100%" display="flex" flexDirection="column" overflow="hidden" onChange={setTabIndex}>
                <TabList>
                    {branches.map((branch, i) => {
                        if (i === 0) {
                            return <Tab key={i}>Main line</Tab>;
                        } else {
                            if (style !== RmgStyle.SHMetro || !isColineBranch(branch, stationList)) {
                                return <Tab key={i}>Branch {i}</Tab>;
                            } else {
                                return <Tab key={i}>External track {i}</Tab>;
                            }
                        }
                    })}

                    {style === RmgStyle.SHMetro && <Tab>Track sharing</Tab>}

                    <HStack marginLeft="auto" marginRight={1}>
                        {style === RmgStyle.SHMetro && (
                            <Button size="xs" colorScheme="teal" isDisabled={tabIndex === 0 && isShareTrackDisabled}>
                                Share track with
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<MdAdd />}
                            onClick={() => setIsAddStationModalOpen(true)}
                        >
                            Add station
                        </Button>
                    </HStack>
                </TabList>

                <TabPanels flex={1} overflowY="auto">
                    {branches.map((_, i) => (
                        <TabPanel key={i} padding={0} h="100%">
                            <StationAgGrid branchIndex={i} />
                        </TabPanel>
                    ))}

                    {style === RmgStyle.SHMetro && (
                        <TabPanel padding={0}>
                            <ColineDataTable />
                        </TabPanel>
                    )}
                </TabPanels>
            </Tabs>

            <AddStationModal isOpen={isAddStationModalOpen} onClose={() => setIsAddStationModalOpen(false)} />
        </Box>
    );
}
