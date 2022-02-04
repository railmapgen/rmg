import React from 'react';
import { useAppSelector } from '../../redux';
import DataTable, { DataTableFieldType } from './data-table';
import TableRowActions from './table-row-actions';
import { RmgStyle, StationInfo } from '../../constants/constants';
import { HStack, Kbd } from '@chakra-ui/react';
import RmgLineBadge from '../common/rmg-line-badge';
import { useTranslation } from 'react-i18next';

export default function StationDataTable() {
    const { t } = useTranslation();

    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const tpo = useAppSelector(state => state.helper.tpo);

    const data: Array<StationInfo & { id: string }> = tpo.map(id => ({ ...stationList[id], id }));

    const fields: DataTableFieldType<StationInfo & { id: string }>[] = [
        { label: 'num', key: 'num', hidden: ![RmgStyle.GZMTR].includes(style) },
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
