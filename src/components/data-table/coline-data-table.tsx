import React from 'react';
import { useAppSelector } from '../../redux';
import ColineTableRowActions from './coline-table-row-actions';
import { InterchangeInfo, Name } from '../../constants/constants';
import { HStack, Kbd } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { RmgDataTable, RmgDataTableFieldType, RmgLineBadge } from '@railmapgen/rmg-components';

type ColineDataTableFieldType = { id: string; from: Name; to: Name; colors: InterchangeInfo[] };

export default function ColineDataTable() {
    const { t } = useTranslation();

    const { stn_list: stnList, coline } = useAppSelector(state => state.param);

    const data: Array<ColineDataTableFieldType> = coline.map((co, i) => ({
        id: i.toString(),
        from: stnList[co.from].name,
        to: stnList[co.to].name,
        colors: co.colors,
    }));

    const nameDisplayHandler = (str: string, i: number) => (i ? [<Kbd key={i}>⏎</Kbd>, str] : str);

    const fields: RmgDataTableFieldType<ColineDataTableFieldType>[] = [
        {
            label: t('ColineDataTable.from'),
            displayHandler: item => (
                <span>
                    {item.from[0].split('\\').map(nameDisplayHandler)}{' '}
                    {item.from[1].split('\\').map(nameDisplayHandler)}
                </span>
            ),
        },
        {
            label: t('ColineDataTable.to'),
            displayHandler: item => (
                <span>
                    {item.from[0].split('\\').map(nameDisplayHandler)}{' '}
                    {item.from[1].split('\\').map(nameDisplayHandler)}
                </span>
            ),
        },
        {
            label: t('ColineDataTable.colors'),
            displayHandler: item => (
                <HStack>
                    {item.colors.map((it, i) => (
                        <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                    ))}
                </HStack>
            ),
        },
        {
            label: t('ColineDataTable.actions'),
            displayHandler: item => <ColineTableRowActions colineIndex={Number(item.id)} />,
        },
    ];

    return <RmgDataTable data={data} fields={fields} />;
}
