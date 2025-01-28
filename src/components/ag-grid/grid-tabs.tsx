import { lazy, useState } from 'react';
import { Box, Button, HStack, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { MdAdd, MdWarning } from 'react-icons/md';
import AddStationModal from '../modal/add-station-modal';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgStyle, SidePanelMode } from '../../constants/constants';
import { isColineBranch } from '../../redux/param/coline-action';
import { setSelectedBranch, setSidePanelMode } from '../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import NewBranchModal from '../modal/new-branch-modal';
import { RmgErrorBoundary, RmgLoader } from '@railmapgen/rmg-components';

const StationAgGrid = lazy(() => import('./station-ag-grid'));

export default function GridTabs() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);
    const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList, loop } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

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
                index={selectedBranch}
                onChange={index => dispatch(setSelectedBranch(index))}
            >
                <TabList>
                    {branches.map((branch, i) => {
                        if (i === 0) {
                            return <Tab key={i}>{loop ? t('Loop line') : t('GridTabs.main')}</Tab>;
                        } else {
                            if (style !== RmgStyle.SHMetro || !isColineBranch(branch, stationList)) {
                                return (
                                    <Tab key={i}>
                                        {t('GridTabs.branch') + ' ' + i}
                                        {loop && (
                                            <MdWarning
                                                style={{ marginLeft: 5 }}
                                                title={t('Branches are not supported in the loop line.')}
                                            />
                                        )}
                                    </Tab>
                                );
                            } else {
                                return <Tab key={i}>{t('GridTabs.external') + ' ' + i}</Tab>;
                            }
                        }
                    })}
                    <IconButton
                        size="sm"
                        variant="ghost"
                        alignSelf="center"
                        aria-label="New branch"
                        onClick={() => setIsNewBranchModalOpen(true)}
                        icon={<MdAdd />}
                        isDisabled={loop}
                    />

                    <HStack marginLeft="auto" marginRight={1}>
                        <Button
                            variant="outline"
                            size="xs"
                            leftIcon={<MdAdd />}
                            onClick={() => setIsAddStationModalOpen(true)}
                        >
                            {t('GridTabs.addStation')}
                        </Button>
                        <Button size="xs" colorScheme="primary" onClick={handleEditLineSection}>
                            {t('GridTabs.editLine')}
                        </Button>
                    </HStack>
                </TabList>

                <TabPanels flex={1} overflowY="auto">
                    {branches.map((_, i) => (
                        <TabPanel key={i} padding={0} h="100%" position="relative">
                            <RmgErrorBoundary suspenseFallback={<RmgLoader isIndeterminate />}>
                                <StationAgGrid branchIndex={i} />
                            </RmgErrorBoundary>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>

            <AddStationModal isOpen={isAddStationModalOpen} onClose={() => setIsAddStationModalOpen(false)} />
            <NewBranchModal isOpen={isNewBranchModalOpen} onClose={() => setIsNewBranchModalOpen(false)} />
        </Box>
    );
}
