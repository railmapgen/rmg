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
import { useTranslation } from 'react-i18next';

export default function BranchSection() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const stationList = useAppSelector(state => state.param.stn_list);
    const { parents, children, branch } = stationList[selectedStation];

    const branchOptions = {
        [BranchStyle.through]: t('StationSidePanel.branch.through'),
        [BranchStyle.nonThrough]: t('StationSidePanel.branch.nonThrough'),
    };

    const getFirstStationOptions = (direction: Direction) => {
        return (direction === Direction.left ? parents : children).reduce<Record<string, string>>(
            (acc, cur) => ({ ...acc, [cur]: stationList[cur].name.join(' ') }),
            {}
        );
    };

    const positionOptions = {
        upper: t('StationSidePanel.branch.upper'),
        lower: t('StationSidePanel.branch.lower'),
    };

    const getFields = (direction: Direction): RmgFieldsField[] => {
        if (branch[direction].length) {
            return [
                {
                    type: 'select',
                    label: t('StationSidePanel.branch.type'),
                    options: branchOptions,
                    value: branch[direction][0],
                    onChange: value =>
                        dispatch(updateStationBranchType(selectedStation, direction, value as BranchStyle)),
                },
                {
                    type: 'select',
                    label: t('StationSidePanel.branch.firstStation'),
                    options: getFirstStationOptions(direction),
                    value: branch[direction][1],
                    onChange: value =>
                        dispatch(updateStationBranchFirstStation(selectedStation, direction, value as string)),
                },
                {
                    type: 'select',
                    label: t('StationSidePanel.branch.position'),
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
                {t('StationSidePanel.branch.title')}
            </Heading>

            <Heading as="h6" size="xs">
                {t('StationSidePanel.branch.left')}
            </Heading>

            <RmgCard direction="column">
                {parents.length === 2 ? (
                    <RmgFields fields={getFields(Direction.left)} />
                ) : (
                    <Text as="i" flex={1} align="center" fontSize="md" colorScheme="gray">
                        {t('StationSidePanel.branch.noBranch')}
                    </Text>
                )}
            </RmgCard>

            <Heading as="h6" size="xs">
                {t('StationSidePanel.branch.left')}
            </Heading>

            <RmgCard direction="column">
                {children.length === 2 ? (
                    <RmgFields fields={getFields(Direction.right)} />
                ) : (
                    <Text as="i" flex={1} align="center" fontSize="md" colorScheme="gray">
                        {t('StationSidePanel.branch.noBranch')}
                    </Text>
                )}
            </RmgCard>
        </Box>
    );
}
