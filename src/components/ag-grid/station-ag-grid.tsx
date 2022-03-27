import { RmgAgGrid, RmgLineBadge } from '@railmapgen/rmg-components';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useAppSelector } from '../../redux';
import { ColDef } from 'ag-grid-community';
import { Name, RmgStyle, StationInfo, StationTransfer } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import TableRowActions from '../data-table/table-row-actions';
import RmgMultiLineString from '../common/rmg-multi-line-string';

interface StationAgGridProps {
    stationIds: string[];
}

interface RmgAgGridColDef<T> extends ColDef {
    field?: Extract<keyof T, string>;
}

type RowDataType = StationInfo & { id: string };

export default function StationAgGrid(props: StationAgGridProps) {
    const { stationIds } = props;
    const { t } = useTranslation();

    const { style, stn_list: stationList } = useAppSelector(state => state.param);

    const rowData: RowDataType[] = stationIds.map(id => ({ ...stationList[id], id }));

    const columnDefs: RmgAgGridColDef<RowDataType>[] = [
        {
            headerName: t('StationAgGrid.num'),
            field: 'num',
            hide: ![RmgStyle.GZMTR].includes(style),
        },
        {
            headerName: t('StationAgGrid.zhName'),
            field: 'name',
            valueFormatter: ({ value }: { value: Name }) => value[0],
        },
        {
            headerName: t('StationAgGrid.enName'),
            field: 'name',
            cellRenderer: ({ value }: { value: Name }) => <RmgMultiLineString text={value[1]} />,
            flex: 1,
        },
        {
            headerName: t('StationAgGrid.interchange'),
            field: 'transfer',
            cellRenderer: ({ value }: { value: StationTransfer }) => (
                <HStack>
                    {value.info.flat().map((it, i) => (
                        <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                    ))}
                </HStack>
            ),
            flex: 1,
        },
        {
            headerName: t('StationAgGrid.actions'),
            field: 'id',
            cellRenderer: ({ value }: { value: string }) => <TableRowActions stationId={value} />,
        },
    ];

    return (
        <RmgAgGrid>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                suppressCellFocus={true}
                debug={process.env.NODE_ENV !== 'production'}
            />
        </RmgAgGrid>
    );
}
