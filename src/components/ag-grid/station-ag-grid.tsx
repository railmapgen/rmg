import { RmgAgGrid, RmgLineBadge, RmgMultiLineString } from '@railmapgen/rmg-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useRootDispatch, useRootSelector } from '../../redux';
import {
    AllCommunityModule,
    ColDef,
    ModuleRegistry,
    provideGlobalGridOptions,
    RowSelectionOptions,
    SelectionChangedEvent,
} from 'ag-grid-community';
import { RmgStyle, SidePanelMode, StationInfo } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import { setIsShareTrackEnabled, setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';
import { getRowSpanForColine } from '../../redux/param/coline-action';
import GzmtrStationCode from './gzmtr-station-code';
import { MonoColour } from '@railmapgen/rmg-palette-resources';

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: 'legacy' });

interface StationAgGridProps {
    branchIndex: number;
}

type RowDataType = StationInfo & { id: string; rowSpan: [number, string | undefined] };

const rowSelection: RowSelectionOptions = {
    mode: 'singleRow',
    checkboxes: false,
    enableClickSelection: true,
};

export default function StationAgGrid(props: StationAgGridProps) {
    const { branchIndex } = props;
    const { t, i18n } = useTranslation();
    const dispatch = useRootDispatch();

    const sidePanelMode = useRootSelector(state => state.app.sidePanelMode);
    const { style, theme, stn_list: stationList, line_num: lineNumber, coline } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const [rowData, setRowData] = useState<RowDataType[]>([]);
    useEffect(() => {
        const nextRowData = branches[branchIndex].reduce<RowDataType[]>(
            (acc, cur) =>
                ['linestart', 'lineend'].includes(cur)
                    ? acc
                    : [
                          ...acc,
                          {
                              ...stationList[cur],
                              id: cur,
                              rowSpan: dispatch(getRowSpanForColine(cur, branchIndex)),
                          },
                      ],
            []
        );
        setRowData(nextRowData);
    }, [branches, branchIndex, stationList]);

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
                field: 'localisedName',
                valueFormatter: ({ value, data }) =>
                    value.zh +
                    (style === RmgStyle.GZMTR && data?.localisedSecondaryName?.zh
                        ? ` (${data.localisedSecondaryName.zh})`
                        : ''),
            },
            {
                headerName: t('English name'),
                // field: 'localisedName',
                cellRenderer: ({ data }: { data: RowDataType }) => (
                    <RmgMultiLineString
                        text={
                            data.localisedName.en +
                            (style === RmgStyle.GZMTR && data.localisedSecondaryName?.en
                                ? ` (${data.localisedSecondaryName.en})`
                                : '')
                        }
                    />
                ),
                minWidth: 300,
            },
            {
                headerName: t('StationAgGrid.interchange'),
                // field: 'transfer',
                cellRenderer: ({ data }: { data: RowDataType }) => (
                    <HStack>
                        {data.transfer.groups
                            .map(group => group.lines ?? [])
                            .flat()
                            .map((it, i) => (
                                <RmgLineBadge
                                    key={i}
                                    name={it.name}
                                    bg={it.theme?.[2] ?? '#aaaaaa'}
                                    fg={it.theme?.[3] ?? MonoColour.white}
                                    showShortName
                                />
                            ))}
                    </HStack>
                ),
            },
            {
                headerName: t('StationAgGrid.coline'),
                // field: 'rowSpan',
                rowSpan: ({ data }) => data?.rowSpan[0] ?? 0,
                cellClassRules: {
                    'rmg-ag-grid--spanned-cell': ({ data }) => !!data && data.rowSpan[0] > 0,
                },
                cellRenderer: ({ data }: { data: RowDataType }) => (
                    <HStack>
                        {coline[data.rowSpan[1] as string]?.colors?.map((it, i) => (
                            <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                        ))}
                    </HStack>
                ),
                hide: ![RmgStyle.SHMetro].includes(style),
            },
        ],
        [style, theme.toString(), i18n.language, lineNumber]
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

    const [defaultColDef] = useState({
        resizable: true,
    });

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
                rowSelection={rowSelection}
                onSelectionChanged={handleSelectionChanged}
                onGridReady={handleGridReady}
                debug={import.meta.env.DEV}
            />
        </RmgAgGrid>
    );
}
