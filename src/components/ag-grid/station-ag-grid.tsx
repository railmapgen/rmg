import { RmgAgGrid, RmgLineBadge, RmgMultiLineString } from '@railmapgen/rmg-components';
import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useAppDispatch, useAppSelector } from '../../redux';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { ColineInfo, Name, RmgStyle, SidePanelMode, StationInfo, StationTransfer } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { HStack } from '@chakra-ui/react';
import { setIsShareTrackDisabled, setSelectedStation, setSidePanelMode } from '../../redux/app/action';
import {
    checkColineValidity,
    getRowSpanForColine,
    verifyAreSelectionsConsecutive,
} from '../../redux/param/coline-action';

interface StationAgGridProps {
    branchIndex: number;
}

interface RmgAgGridColDef<T> extends ColDef {
    field?: Extract<keyof T, string>;
}

type RowDataType = StationInfo & { id: string; rowSpan: [number, ColineInfo | undefined] };

export default function StationAgGrid(props: StationAgGridProps) {
    const { branchIndex } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const sidePanelMode = useAppSelector(state => state.app.sidePanelMode);
    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);
    const stationIds = branches[branchIndex].filter(id => !['linestart', 'lineend'].includes(id));

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

    const defaultColDef = {};

    const columnDefs: RmgAgGridColDef<RowDataType>[] = [
        {
            headerName: ' ',
            checkboxSelection: true,
            width: 36,
            hide: ![RmgStyle.SHMetro].includes(style) || branchIndex > 0,
        },
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
        },
        {
            headerName: 'Track sharing',
            field: 'rowSpan',
            rowSpan: ({ data: { rowSpan } }: { data: RowDataType }) => rowSpan[0],
            cellClassRules: {
                'rmg-ag-grid--spanned-cell': ({ value }) => value[0] > 0,
            },
            cellRenderer: ({ value }: { value: RowDataType['rowSpan'] }) => (
                <HStack>
                    {value[1]?.colors?.map((it, i) => (
                        <RmgLineBadge key={i} name={[it[4], it[5]]} bg={it[2]} fg={it[3]} showShortName />
                    ))}
                </HStack>
            ),
            hide: ![RmgStyle.SHMetro].includes(style),
        },
    ];

    const handleSelectionChanged = ({ api }: SelectionChangedEvent) => {
        const selectedRowIds = api.getSelectedRows()?.map(row => row.id as string);
        console.log('StationAgGrid.handleSelectionChanged():: Row selection changed', selectedRowIds);

        if (selectedRowIds?.length) {
            if (style !== RmgStyle.SHMetro || selectedRowIds.length === 1) {
                dispatch(setSidePanelMode(SidePanelMode.STATION));
                dispatch(setSelectedStation(selectedRowIds[0]));
                dispatch(setIsShareTrackDisabled(true));
            } else {
                // close side panel
                dispatch(setSidePanelMode(SidePanelMode.CLOSE));
                dispatch(setSelectedStation('linestart'));

                // check validity for track sharing
                try {
                    const isConsecutive = dispatch(verifyAreSelectionsConsecutive(selectedRowIds, branchIndex));
                    if (isConsecutive) {
                        dispatch(checkColineValidity(selectedRowIds[0], selectedRowIds.slice(-1)[0]));

                        console.log('StationAgGrid.handleSelectionChanged():: Selections are valid for track sharing');
                        dispatch(setIsShareTrackDisabled(false));
                    } else {
                        dispatch(setIsShareTrackDisabled(true));
                    }
                } catch (err) {
                    console.log(
                        'StationAgGrid.handleSelectionChanged():: Failed to validate selections for track sharing',
                        err
                    );
                    dispatch(setIsShareTrackDisabled(true));
                }
            }
        } else {
            // unselect
            dispatch(setSidePanelMode(SidePanelMode.CLOSE));
            dispatch(setSelectedStation('linestart'));
            dispatch(setIsShareTrackDisabled(true));
        }
    };

    return (
        <RmgAgGrid>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                headerHeight={36}
                rowHeight={36}
                suppressCellFocus={true}
                suppressMovableColumns={true}
                suppressRowTransform={true}
                rowSelection={style === RmgStyle.SHMetro && branchIndex === 0 ? 'multiple' : 'single'}
                onSelectionChanged={handleSelectionChanged}
                onGridReady={() => (isGridReadyRef.current = true)}
                debug={process.env.NODE_ENV !== 'production'}
            />
        </RmgAgGrid>
    );
}