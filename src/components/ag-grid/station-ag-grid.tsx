import { RmgAgGrid, RmgLineBadge } from '@railmapgen/rmg-components';
import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useAppSelector } from '../../redux';
import { ColDef } from 'ag-grid-community';
import { Name, RmgStyle, SidePanelMode, StationInfo, StationTransfer } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import RmgMultiLineString from '../common/rmg-multi-line-string';
import { useDispatch } from 'react-redux';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/action';

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
    const dispatch = useDispatch();

    const sidePanelMode = useAppSelector(state => state.app.sidePanelMode);
    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const gridRef = useRef<AgGridReact>(null);

    useEffect(() => {
        if (sidePanelMode !== SidePanelMode.STATION) {
            gridRef?.current?.api?.deselectAll();
        }
    }, [sidePanelMode]);

    const rowData: RowDataType[] = stationIds.map(id => ({ ...stationList[id], id }));

    const defaultColDef = {
        flex: 1,
    };

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
    ];

    const handleSelectionChanged = () => {
        const selectedStationId = gridRef?.current?.api?.getSelectedRows()?.[0]?.id;
        if (selectedStationId) {
            dispatch(setSelectedStation(selectedStationId));
            dispatch(setSidePanelMode(SidePanelMode.STATION));
        }
    };

    return (
        <RmgAgGrid>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                suppressCellFocus={true}
                rowSelection="single"
                onSelectionChanged={handleSelectionChanged}
                debug={process.env.NODE_ENV !== 'production'}
            />
        </RmgAgGrid>
    );
}
