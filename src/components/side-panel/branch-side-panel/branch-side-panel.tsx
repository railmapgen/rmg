import classes from '../side-panel.module.css';
import ColineSection from './coline-section';
import ActionSection from './action-section';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { isColineBranch } from '../../../redux/param/coline-action';
import LoopSection from './loop-section';
import { Button, Divider, Group, NativeSelect, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { setSelectedBranch } from '../../../redux/app/app-slice';
import useBranchOptions from '../../../hooks/use-branch-options';
import { MdOutlineAdd } from 'react-icons/md';
import { useState } from 'react';
import NewBranchModal from '../../modal/new-branch-modal';

export default function BranchSidePanel() {
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList, loop } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);

    const branchOptions = useBranchOptions();

    return (
        <Stack className={classes['tab-body']} gap="xs">
            <Group gap="xs" align="flex-end">
                <NativeSelect
                    label={t('Line section')}
                    value={selectedBranch}
                    data={branchOptions}
                    onChange={({ currentTarget: { value } }) => dispatch(setSelectedBranch(Number(value)))}
                    flex={1}
                />
                <Button leftSection={<MdOutlineAdd />} onClick={() => setIsNewBranchModalOpen(true)}>
                    {t('New branch')}
                </Button>
            </Group>

            {style === RmgStyle.SHMetro &&
                (selectedBranch === 0 || isColineBranch(branches[selectedBranch], stationList)) && (
                    <>
                        <ColineSection />
                        <Divider />
                    </>
                )}

            {loop && (
                <>
                    <LoopSection />
                    <Divider />
                </>
            )}

            <ActionSection />

            <NewBranchModal isOpen={isNewBranchModalOpen} onClose={() => setIsNewBranchModalOpen(false)} />
        </Stack>
    );
}
