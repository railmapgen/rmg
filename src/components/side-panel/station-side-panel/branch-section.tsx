import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import RmgFields, { RmgFieldsField } from '../../common/rmg-fields';
import { BranchStyle, Direction } from '../../../constants/constants';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { updateStationBranchType } from '../../../redux/param/action';

export default function BranchSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const { parents, children, branch } = useAppSelector(state => state.param.stn_list[selectedStation]);

    const branchOptions = {
        [BranchStyle.through]: 'Through',
        [BranchStyle.nonThrough]: 'Non-through',
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
                    options: (direction === Direction.left ? parents : children).reduce<Record<string, string>>(
                        (acc, cur) => ({ ...acc, [cur]: cur }),
                        {}
                    ),
                    value: branch[direction][1],
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

            {parents.length === 2 ? <RmgFields fields={getFields(Direction.left)} /> : 'No branches found'}

            <Heading as="h6" size="xs">
                Branch on the right
            </Heading>

            {children.length === 2 ? <RmgFields fields={getFields(Direction.right)} /> : 'No branches found'}
        </Box>
    );
}
