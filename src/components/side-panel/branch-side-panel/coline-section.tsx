import React from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../../redux';
import {
    addColine,
    findAllColinesInBranch,
    getPossibleCombinations,
    updateColine,
    updateColineColor,
} from '../../../redux/param/coline-action';
import ColineCard from './coline-card';
import { MdAdd } from 'react-icons/md';
import { MonoColour } from '../../../constants/constants';
import { setGlobalAlert } from '../../../redux/app/action';

export default function ColineSection() {
    const dispatch = useAppDispatch();

    const selectedBranch = useAppSelector(state => state.app.selectedBranch);
    const { theme, stn_list: stationList } = useAppSelector(state => state.param);

    const colineInfoList = dispatch(findAllColinesInBranch(selectedBranch));
    const possibleCombinations = dispatch(getPossibleCombinations(selectedBranch));

    const getStationPairDisplayName = (pair: [string, string]) => {
        return pair.map(id => stationList[id].name.join(' - ')).join(' ~ ');
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
        try {
            dispatch(updateColine(colineId, ...(route.split(',') as [string, string])));
        } catch {
            dispatch(setGlobalAlert({ status: 'error', message: 'Unable to draw this share track.' }));
        }
    };

    return (
        <VStack align="flex-start" p={1}>
            <Heading as="h5" size="sm">
                Track sharing
            </Heading>

            {Object.entries(colineInfoList).map(([id, colineInfo]) => (
                <ColineCard
                    key={id}
                    colineInfo={colineInfo}
                    routeOptions={routeOptions}
                    onUpdateRoute={handleUpdateRoute(id)}
                    onUpdateColourInfo={colourInfo => dispatch(updateColineColor(id, 0, colourInfo))}
                />
            ))}

            {selectedBranch === 0 && (
                <Button
                    size="xs"
                    variant="ghost"
                    alignSelf="flex-end"
                    leftIcon={<MdAdd />}
                    onClick={handleAddTrackSharing}
                >
                    Add track sharing
                </Button>
            )}
        </VStack>
    );
}
