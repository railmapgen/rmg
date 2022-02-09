import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import RmgFields, { RmgFieldsFields } from '../../common/rmg-fields';
import {
    getPossibleStnIdsFromMainLine,
    getPossibleStnIdsFromBranchLine,
    updateColine,
} from '../../../redux/param/coline-action';
import { setGlobalAlert } from '../../../redux/app/action';

export default function InfoSection() {
    const dispatch = useDispatch();

    // TODO: update coline info section when selectedColine changed, should be, but not working now
    const selectedColine = useAppSelector(state => state.app.selectedColine);
    const { stn_list: stnList } = useAppSelector(state => state.param);
    // FIXME: return emepty component if there is no coline
    const { from, to } = useAppSelector(state => state.param.coline.at(selectedColine))!;
    const { branches } = useAppSelector(state => state.helper);

    // https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
    // I have no idea why this will complain and the func should be in (...a: string[][]) => string[][]
    // @ts-ignore
    const cartesian = (...a: string[][]): string[][] => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

    const possibleStnIdsFromMainLine = getPossibleStnIdsFromMainLine(branches);
    const possibleStnIdsCombination = [
        ...cartesian(possibleStnIdsFromMainLine, possibleStnIdsFromMainLine),
        ...getPossibleStnIdsFromBranchLine(branches),
    ].filter(val => val[0] !== val[1]) as [string, string][];

    const handleChange = (value: string) => {
        try {
            dispatch(updateColine(selectedColine, ...(value.split(',') as [string, string])));
        } catch {
            dispatch(setGlobalAlert({ status: 'error', message: 'Unable to draw this share track.' }));
        }
    };

    const value = (val: [string, string]) => `${val[0]},${val[1]}`;
    const displayName = (val: [string, string]) =>
        `${stnList[val[0]].name[0]},${stnList[val[0]].name[1]}⟸⟹${stnList[val[1]].name[0]},${stnList[val[1]].name[1]}`;

    const fields: RmgFieldsFields[] = [
        {
            type: 'select',
            label: 'Route',
            value: value([from, to]),
            options: possibleStnIdsCombination.reduce(
                (acc, cur) => ({ ...acc, [value(cur)]: displayName(cur) }),
                {} as { [stnId: string]: string }
            ),
            onChange: handleChange,
        },
    ];

    return (
        <Box>
            <RmgFields fields={fields} />
        </Box>
    );
}
