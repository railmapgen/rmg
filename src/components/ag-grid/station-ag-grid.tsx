import { RmgAgGrid, RmgLineBadge, RmgMultiLineString } from '@railmapgen/rmg-components';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useRootDispatch, useRootSelector } from '../../redux';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { Name, RmgStyle, SidePanelMode, StationInfo, StationTransfer } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import { setIsShareTrackEnabled, setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';
import { getRowSpanForColine } from '../../redux/param/coline-action';
import GzmtrStationCode from './gzmtr-station-code';

interface StationAgGridProps {
    branchIndex: number;
}

type RowDataType = StationInfo & { id: string; rowSpan: [number, string | undefined] };

export default function StationAgGrid(props: StationAgGridProps) {
    const { branchIndex } = props;
    const { t, i18n } = useTranslation();
    const dispatch = useRootDispatch();

    const sidePanelMode = useRootSelector(state => state.app.sidePanelMode);
    const { style, theme, stn_list: stationList, line_num: lineNumber, coline } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);
    const stationIds = branches[branchIndex].filter(id => !['linestart', 'lineend'].includes(id));

    const columnDefs = useMemo<ColDef<RowDataType>[]>(
        () => [
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
                valueFormatter: ({ value, data }) =>
                    value[0] +
                    (style === RmgStyle.GZMTR && data?.secondaryName && data?.secondaryName[0]
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
                rowSpan: ({ data }) => data?.rowSpan[0] ?? 0,
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
        ],
        [style, theme.toString(), i18n.language]
    );

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

    const handleGridReady = useCallback(() => {
        isGridReadyRef.current = true;
    }, [isGridReadyRef.current]);

    const handleSelectionChanged = useCallback(({ api }: SelectionChangedEvent<RowDataType>) => {
        const selectedRowIds = api.getSelectedRows()?.map(row => row.id);
        console.log('StationAgGrid.handleSelectionChanged():: Row selection changed', selectedRowIds);

        if (selectedRowIds?.length) {
            dispatch(setSidePanelMode(SidePanelMode.STATION));
            dispatch(setSelectedStation(selectedRowIds[0]));
            dispatch(setIsShareTrackEnabled(undefined));
        }
    }, []);

    const handleGetRowId = useCallback(({ data }: { data: RowDataType }) => data.id, []);

    return (
        <RmgAgGrid>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                getRowId={handleGetRowId}
                headerHeight={36}
                rowHeight={36}
                suppressCellFocus={true}
                suppressMovableColumns={true}
                suppressRowTransform={true}
                rowSelection={'single'}
                onSelectionChanged={handleSelectionChanged}
                onGridReady={handleGridReady}
                debug={import.meta.env.DEV}
            />
        </RmgAgGrid>
    );
}
