import ColineSection from './coline-section';
import ActionSection from './action-section';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { isColineBranch } from '../../../redux/param/coline-action';
import LoopSection from './loop-section';
import { Divider, NativeSelect, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { setSelectedBranch } from '../../../redux/app/app-slice';

export default function BranchSidePanel() {
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList, loop } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const branchOptions = branches.map((branch, i) => {
        if (i === 0) {
            return {
                value: i.toString(),
                label: loop ? t('Loop line') : t('GridTabs.main'),
            };
        } else {
            if (style !== RmgStyle.SHMetro || !isColineBranch(branch, stationList)) {
                return {
                    value: i.toString(),
                    label: t('GridTabs.branch') + ' ' + i,
                    disabled: loop,
                };
                // {loop && (
                //   <MdWarning
                //     style={{ marginLeft: 5 }}
                //     title={t('Branches are not supported in the loop line.')}
                //   />
                // )}
            } else {
                return { value: i.toString(), label: t('GridTabs.external') + ' ' + i };
            }
        }
    });

    return (
        <Stack gap="xs">
            <NativeSelect
                label={t('Line section')}
                value={selectedBranch}
                data={branchOptions}
                onChange={({ currentTarget: { value } }) => dispatch(setSelectedBranch(Number(value)))}
            />

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
        </Stack>
    );
}
