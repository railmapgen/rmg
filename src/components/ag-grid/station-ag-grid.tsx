import { RmgAgGrid, RmgLineBadge, RmgMultiLineString } from '@railmapgen/rmg-components';
import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch, useAppSelector } from '../../redux';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { Name, RmgStyle, SidePanelMode, StationInfo, StationTransfer } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import { setIsShareTrackEnabled, setSelectedStation, setSidePanelMode } from '../../redux/app/action';
import { getRowSpanForColine } from '../../redux/param/coline-action';
import GzmtrStationCode from './gzmtr-station-code';

interface StationAgGridProps {
    branchIndex: number;
}

interface RmgAgGridColDef<T> extends ColDef {
    field?: Extract<keyof T, string>;
}

type RowDataType = StationInfo & { id: string; rowSpan: [number, string | undefined] };

export default function StationAgGrid(props: StationAgGridProps) {
    const { branchIndex } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const sidePanelMode = useAppSelector(state => state.app.sidePanelMode);
    const { style, theme, stn_list: stationList, line_num: lineNumber, coline } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);
    const stationIds = branches[branchIndex].filter(id => !['linestart', 'lineend'].includes(id));

    const [columnDefs] = useState<RmgAgGridColDef<RowDataType>[]>([
        {
            headerName: t('StationAgGrid.num'),
            field: 'num',
            cellRenderer: ({ value }: { value: string }) => (
                <GzmtrStationCode lineNumber={lineNumber} stationNumber={value} lineColour={theme[2]} />
            ),
            pinned: 'left',
            minWidth: 110,
            hide: ![RmgStyle.GZMTR].includes(style),
        },
        {
            headerName: t('Chinese name'),
            field: 'name',
            valueFormatter: ({ value, data }: { value: Name; data: RowDataType }) =>
                value[0] +
                (style === RmgStyle.GZMTR && data.secondaryName && data.secondaryName[0]
                    ? ` (${data.secondaryName[0]})`
                    : ''),
        },
        {
            headerName: t('English name'),
            field: 'name',
            cellRenderer: ({ value, data }: { value: Name; data: RowDataType }) => (
                <RmgMultiLineString
                    text={
                        value[1] +
                        (style === RmgStyle.GZMTR && data.secondaryName && data.secondaryName[1]
                            ? ` (${data.secondaryName[1]})`
                            : '')
                    }
                />
            ),
            minWidth: 300,
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
        },
        {
            headerName: t('StationAgGrid.coline'),
            field: 'rowSpan',
            rowSpan: ({ data: { rowSpan } }: { data: RowDataType }) => rowSpan[0],
            cellClassRules: {
                'rmg-ag-grid--spanned-cell': ({ value }) => value[0] > 0,
            },
            cellRenderer: ({ value }: { value: RowDataType['rowSpan'] }) => (
                <HStack>
                    {coline[value[1] as string]?.colors?.map((it, i) => (
                        <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                    ))}
                </HStack>
            ),
            hide: ![RmgStyle.SHMetro].includes(style),
        },
    ]);

    const gridRef = useRef<AgGridReact>(null);
    const isGridReadyRef = useRef(false);

    useEffect(() => {
        // deselect row when side panel is closed
        // only take effect when one row is selected
        if (isGridReadyRef.current && gridRef.current) {
            const selectedRows = gridRef.current.api.getSelectedRows();
            if (selectedRows.length === 1 && sidePanelMode !== SidePanelMode.STATION) {
                gridRef.current.api.deselectAll();
            }
        }
    }, [isGridReadyRef.current, sidePanelMode]);

    const rowData: RowDataType[] = stationIds.map(id => ({
        ...stationList[id],
        id,
        rowSpan: dispatch(getRowSpanForColine(id, branchIndex)),
    }));

    const defaultColDef = {
        resizable: true,
    };

    const handleSelectionChanged = ({ api }: SelectionChangedEvent) => {
        const selectedRowIds = api.getSelectedRows()?.map(row => row.id as string);
        console.log('StationAgGrid.handleSelectionChanged():: Row selection changed', selectedRowIds);

        if (selectedRowIds?.length) {
            dispatch(setSidePanelMode(SidePanelMode.STATION));
            dispatch(setSelectedStation(selectedRowIds[0]));
            dispatch(setIsShareTrackEnabled(undefined));
        }
    };

    return (
        <RmgAgGrid>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                getRowId={({ data }) => data.id}
                headerHeight={36}
                rowHeight={36}
                suppressCellFocus={true}
                suppressMovableColumns={true}
                suppressRowTransform={true}
                rowSelection={'single'}
                onSelectionChanged={handleSelectionChanged}
                onGridReady={() => (isGridReadyRef.current = true)}
                debug={process.env.NODE_ENV !== 'production'}
            />
        </RmgAgGrid>
    );
}
