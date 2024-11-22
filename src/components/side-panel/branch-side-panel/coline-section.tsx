import { Button, Heading, VStack } from '@chakra-ui/react';
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
import { MdAdd } from 'react-icons/md';
import { setGlobalAlert } from '../../../redux/app/app-slice';
import { useTranslation } from 'react-i18next';
import { MonoColour } from '@railmapgen/rmg-palette-resources';

export default function ColineSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { theme, stn_list: stationList } = useRootSelector(state => state.param);

    const colineInfoList = dispatch(findAllColinesInBranch(selectedBranch));
    const possibleCombinations = dispatch(getPossibleCombinations(selectedBranch));

    const getStationPairDisplayName = (pair: [string, string]) => {
        return pair.map(id => stationList[id].localisedName.zh + '/' + stationList[id].localisedName.en).join(' ~ ');
    };

    const routeOptions = possibleCombinations.reduce<Record<string, string>>(
        (acc, cur) => ({
            ...acc,
            [cur.join(',')]: getStationPairDisplayName(cur),
        }),
        {}
    );

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
            dispatch(setGlobalAlert({ status: 'error', message: 'Unable to draw this share track.' }));
        }
    };

    const handleDeleteColour = (colineId: string, colourIndex: number) => {
        dispatch(removeColineColor(colineId, colourIndex));
    };

    return (
        <VStack align="flex-start" p={1}>
            <Heading as="h5" size="sm">
                {t('BranchSidePanel.coline.title')}
            </Heading>

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
                <Button
                    size="xs"
                    variant="ghost"
                    alignSelf="flex-end"
                    leftIcon={<MdAdd />}
                    onClick={handleAddTrackSharing}
                >
                    {t('BranchSidePanel.coline.add')}
                </Button>
            )}
        </VStack>
    );
}
