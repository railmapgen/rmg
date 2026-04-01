import { useRootDispatch, useRootSelector } from '../../../redux';
import {
    addColine,
    findAllColinesInBranch,
    getPossibleCombinations,
    removeColineColor,
    updateColine,
    updateColineColor,
} from '../../../redux/param/coline-action';
import ColineCard from './coline-card';
import { MdAdd, MdOutlineClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { Button, Notification, Title } from '@mantine/core';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import clsx from 'clsx';
import classes from '../side-panel.module.css';
import { useState } from 'react';

export default function ColineSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { theme, stn_list: stationList } = useRootSelector(state => state.param);

    const [error, setError] = useState<string>();

    const colineInfoList = dispatch(findAllColinesInBranch(selectedBranch));
    const possibleCombinations = dispatch(getPossibleCombinations(selectedBranch));

    const getStationPairDisplayName = (pair: [string, string]) => {
        return pair.map(id => stationList[id].localisedName.zh + '/' + stationList[id].localisedName.en).join(' ~ ');
    };

    const routeOptions = possibleCombinations.map(pair => ({
        value: pair.join(','),
        label: getStationPairDisplayName(pair),
    }));

    const handleAddTrackSharing = () => {
        console.log(
            `ColineSection.handleAddTrackSharing():: Adding track sharing to branch ${selectedBranch} with default combination`,
            possibleCombinations[0]
        );
        dispatch(
            addColine(possibleCombinations[0][0], possibleCombinations[0][1], [
                [theme[0], '', '#AAAAAA', MonoColour.white, '', ''],
            ])
        );
    };

    const handleUpdateRoute = (colineId: string) => (route: string) => {
        const [from, to] = route.split(',');
        console.log(`ColineSection.handleUpdateRoute():: Updating route, colineId=${colineId}, from=${from}, to=${to}`);

        try {
            dispatch(updateColine(colineId, from, to));
        } catch {
            setError(t('Unable to draw this share track.'));
        }
    };

    const handleDeleteColour = (colineId: string, colourIndex: number) => {
        dispatch(removeColineColor(colineId, colourIndex));
    };

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('BranchSidePanel.coline.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                {error && (
                    <Notification icon={<MdOutlineClose />} color="red" onClose={() => setError(undefined)}>
                        {error}
                    </Notification>
                )}

                {Object.entries(colineInfoList).map(([id, colineInfo]) => (
                    <ColineCard
                        key={id}
                        colineInfo={colineInfo}
                        routeOptions={routeOptions}
                        onUpdateRoute={handleUpdateRoute(id)}
                        onUpdateColourInfo={colourInfo => dispatch(updateColineColor(id, 0, colourInfo))}
                        onDelete={colourIndex => handleDeleteColour(id, colourIndex)}
                    />
                ))}

                {(selectedBranch === 0 || Object.keys(colineInfoList).length === 0) && (
                    <Button variant="default" leftSection={<MdAdd />} onClick={handleAddTrackSharing}>
                        {t('BranchSidePanel.coline.add')}
                    </Button>
                )}
            </RMSectionBody>
        </RMSection>
    );
}
