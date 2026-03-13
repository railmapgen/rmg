import classes from '../side-panel.module.css';
import InfoSection from './info-section';
import InterchangeSection from './interchange-section';
import MoreSection from './more-section';
import BranchSection from './branch-section';
import { Button, Divider, Group, Select, SelectProps, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import useBranchOptions from '../../../hooks/use-branch-options';
import { setSelectedBranch, setSelectedStation } from '../../../redux/app/app-slice';
import { MdOutlineAdd, MdOutlineCheck } from 'react-icons/md';
import { RmgStyle } from '../../../constants/constants';
import GzmtrStationCode from './gzmtr-station-code';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import RMLineBadge from '../../common/rm-line-badge';
import { useState } from 'react';
import AddStationModal from '../../modal/add-station-modal';

const stationOptionIdMapper = {
    construct: (branchId: number | string, stationId: string) => `${branchId}-${stationId}`,
    destruct: (id: string) => {
        const matches = id.match(/^(\d+)-(.+)$/)!;
        return { branchId: Number(matches[1]), stationId: matches[2] };
    },
};

const isValidStation = (stationId: string) => !['linestart', 'lineend'].includes(stationId);

export default function StationSidePanel() {
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const { selectedBranch, selectedStation } = useRootSelector(state => state.app);
    const { style, line_num: lineNumber, theme, stn_list: stationList } = useRootSelector(state => state.param);
    const { branches } = useRootSelector(state => state.helper);

    const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);

    const branchOptions = useBranchOptions();
    const stationOptions = branchOptions.map(branch => ({
        group: branch.label,
        items: branches[Number(branch.value)].filter(isValidStation).map(stationId => ({
            value: stationOptionIdMapper.construct(branch.value, stationId),
            label: stationList[stationId]?.localisedName.zh + '/' + stationList[stationId]?.localisedName.en,
        })),
    }));

    const renderOption: SelectProps['renderOption'] = ({ option, checked }) => {
        const { stationId } = stationOptionIdMapper.destruct(option.value);
        const stationInfo = stationList[stationId];
        return (
            <>
                {checked && <MdOutlineCheck />}
                {style === RmgStyle.GZMTR && (
                    <GzmtrStationCode lineNumber={lineNumber} stationNumber={stationInfo.num} lineColour={theme[2]} />
                )}
                <span>{option.label}</span>
                {stationInfo.transfer.groups
                    .map(group => group.lines ?? [])
                    .flat()
                    .map((it, i) => (
                        <RMLineBadge
                            key={i}
                            name={it.name}
                            bg={it.theme?.[2] ?? '#aaaaaa'}
                            fg={it.theme?.[3] ?? MonoColour.white}
                            showShortName
                        />
                    ))}
            </>
        );
    };

    const handleSelectStation = (optionId: string) => {
        const { branchId, stationId } = stationOptionIdMapper.destruct(optionId);
        dispatch(setSelectedBranch(branchId));
        dispatch(setSelectedStation(stationId));
    };

    return (
        <Stack className={classes['tab-body']} gap="xs">
            <Group gap="xs" mt="xs" align="flex-end">
                {/* TODO: Use below component globally */}
                <Select
                    value={stationOptionIdMapper.construct(selectedBranch, selectedStation)}
                    placeholder={t('Type to search or select...')}
                    data={stationOptions}
                    renderOption={renderOption}
                    onChange={value => value && handleSelectStation(value)}
                    // searchable
                    maxDropdownHeight={320}
                    flex={1}
                />
                <Button leftSection={<MdOutlineAdd />} onClick={() => setIsAddStationModalOpen(true)}>
                    {t('New station')}
                </Button>
            </Group>

            {isValidStation(selectedStation) && (
                <>
                    <InfoSection />

                    <Divider />

                    <InterchangeSection />

                    <Divider />

                    <BranchSection />

                    <Divider />

                    <MoreSection />
                </>
            )}

            <AddStationModal isOpen={isAddStationModalOpen} onClose={() => setIsAddStationModalOpen(false)} />
        </Stack>
    );
}
