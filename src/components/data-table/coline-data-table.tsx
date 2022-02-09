import React from 'react';
import { useAppSelector } from '../../redux';
import DataTable, { DataTableFieldType } from './data-table';
import ColineTableRowActions from './coline-table-row-actions';
import { ColineInfo } from '../../constants/constants';
import { HStack } from '@chakra-ui/react';
import RmgLineBadge from '../common/rmg-line-badge';
import { useTranslation } from 'react-i18next';

export default function ColineDataTable() {
    const { t } = useTranslation();

    const { coline } = useAppSelector(state => state.param);

    const data: Array<ColineInfo & { id: string }> = coline.map((co, i) => ({ ...co, id: i.toString() }));

    const fields: DataTableFieldType<ColineInfo & { id: string }>[] = [
        { label: t('ColineDataTable.from'), displayHandler: item => item.from },
        { label: t('ColineDataTable.to'), displayHandler: item => item.to },
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

    return <DataTable data={data} fields={fields} />;
}
