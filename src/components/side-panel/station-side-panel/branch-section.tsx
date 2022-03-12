import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { BranchStyle, Direction } from '../../../constants/constants';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import {
    flipStationBranchPosition,
    updateStationBranchFirstStation,
    updateStationBranchType,
} from '../../../redux/param/action';
import { RmgCard, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';

export default function BranchSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const stationList = useAppSelector(state => state.param.stn_list);
    const { parents, children, branch } = stationList[selectedStation];

    const branchOptions = {
        [BranchStyle.through]: 'Through',
        [BranchStyle.nonThrough]: 'Non-through',
    };

    const getFirstStationOptions = (direction: Direction) => {
        return (direction === Direction.left ? parents : children).reduce<Record<string, string>>(
            (acc, cur) => ({ ...acc, [cur]: stationList[cur].name.join(' ') }),
            {}
        );
    };

    const positionOptions = {
        upper: 'Upper',
        lower: 'Lower',
    };

    const getFields = (direction: Direction): RmgFieldsField[] => {
        if (branch[direction].length) {
            return [
                {
                    type: 'select',
                    label: 'Type',
                    options: branchOptions,
                    value: branch[direction][0],
                    onChange: value =>
                        dispatch(updateStationBranchType(selectedStation, direction, value as BranchStyle)),
                },
                {
                    type: 'select',
                    label: 'First station',
                    options: getFirstStationOptions(direction),
                    value: branch[direction][1],
                    onChange: value => dispatch(updateStationBranchFirstStation(selectedStation, direction, value)),
                },
                {
                    type: 'select',
                    label: 'Position',
                    options: positionOptions,
                    value:
                        (direction === Direction.left ? parents : children).indexOf(branch[direction][1]!) === 0
                            ? 'upper'
                            : 'lower',
                    onChange: () => dispatch(flipStationBranchPosition(selectedStation, direction)),
                },
            ];
        } else {
            return [];
        }
    };

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                Branch
            </Heading>

            <Heading as="h6" size="xs">
                Branch on the left
            </Heading>

            <RmgCard direction="column">
                {parents.length === 2 ? (
                    <RmgFields fields={getFields(Direction.left)} />
                ) : (
                    <Text as="i" flex={1} align="center" fontSize="md" colorScheme="gray">
                        No branches found
                    </Text>
                )}
            </RmgCard>

            <Heading as="h6" size="xs">
                Branch on the right
            </Heading>

            <RmgCard direction="column">
                {children.length === 2 ? (
                    <RmgFields fields={getFields(Direction.right)} />
                ) : (
                    <Text as="i" flex={1} align="center" fontSize="md" colorScheme="gray">
                        No branches found
                    </Text>
                )}
            </RmgCard>
        </Box>
    );
}
