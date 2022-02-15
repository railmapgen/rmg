import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import RmgFields, { RmgFieldsField } from '../../common/rmg-fields';
import {
    getPossibleStnIdsFromMainLine,
    getPossibleStnIdsFromBranchLine,
    updateColine,
} from '../../../redux/param/coline-action';
import { setGlobalAlert } from '../../../redux/app/action';

// Cartesian product of multiple arrays in JavaScript
// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
// Equivalent typescript version
// https://gist.github.com/ssippe/1f92625532eef28be6974f898efb23ef?permalink_comment_id=3364149#gistcomment-3364149
function cartesian<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce<T[][]>(
        (results, entries) =>
            results
                .map(result => entries.map(entry => result.concat([entry])))
                .reduce((subResults, result) => subResults.concat(result), []),
        [[]]
    );
}

export default function InfoSection() {
    const dispatch = useDispatch();

    // TODO-coline: update coline info section when selectedColine changed, should be, but not working now
    const selectedColine = useAppSelector(state => state.app.selectedColine);
    const { stn_list: stnList, coline } = useAppSelector(state => state.param);
    const { branches } = useAppSelector(state => state.helper);

    // return empty when selectedColine is invalid
    if (selectedColine === undefined || selectedColine >= coline.length) return <></>;

    // I have no idea why this will complain and the func should be in (...a: string[][]) => string[][]
    // @ts-ignore
    // const cartesian = (...a: string[][]): string[][] => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

    const possibleStnIdsFromMainLine = getPossibleStnIdsFromMainLine(branches, stnList);
    const possibleStnIdsCombination = [
        ...cartesian(possibleStnIdsFromMainLine, possibleStnIdsFromMainLine),
        ...getPossibleStnIdsFromBranchLine(branches, stnList),
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

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: 'Route',
            value: value([coline.at(selectedColine)!.from, coline.at(selectedColine)!.to]),
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
