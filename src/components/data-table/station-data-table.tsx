import React from 'react';
import { useAppSelector } from '../../redux';
import DataTable, { DataTableFieldType } from './data-table';
import TableRowActions from './table-row-actions';
import { StationInfo } from '../../constants/constants';
import { HStack, Kbd } from '@chakra-ui/react';
import RmgLineBadge from '../common/rmg-line-badge';
import { useTranslation } from 'react-i18next';

export default function StationDataTable() {
    const { t } = useTranslation();

    const stationList = useAppSelector(state => state.param.stn_list);

    const data: Array<StationInfo & { id: string }> = Object.entries(stationList)
        .filter(([id]) => !['linestart', 'lineend'].includes(id))
        .map(([id, station]) => ({
            ...station,
            id,
        }));

    const fields: DataTableFieldType<StationInfo & { id: string }>[] = [
        { label: t('StationDataTable.zhName'), displayHandler: item => item.name[0] },
        {
            label: t('StationDataTable.enName'),
            displayHandler: item => (
                <span>{item.name[1].split('\\').map((str, i) => (i ? [<Kbd key={i}>⏎</Kbd>, str] : str))}</span>
            ),
        },
        {
            label: t('StationDataTable.interchange'),
            displayHandler: item => (
                <HStack>
                    {item.transfer.info.flat().map((it, i) => (
                        <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                    ))}
                </HStack>
            ),
        },
        {
            label: t('StationDataTable.actions'),
            displayHandler: item => <TableRowActions stationId={item.id} />,
        },
    ];

    return <DataTable data={data} fields={fields} />;
}
