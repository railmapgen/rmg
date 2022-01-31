import React, { Fragment, ReactElement } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, useColorMode, SystemStyleObject } from '@chakra-ui/react';

const trStyle: SystemStyleObject = {
    'td, th': {
        borderRight: '1px solid',
        borderColor: 'blackAlpha.200',
        backgroundColor: 'gray.50',
        whiteSpace: 'nowrap',
    },

    'td:first-child, th:first-child': {
        position: 'sticky',
        left: 0,
        zIndex: 1,
    },

    'td:last-child, th: last-child': {
        borderRight: 'none',
        position: 'sticky',
        right: 0,
        zIndex: 1,
    },
};

const trStyleDarkMode = {
    'td, th': {
        borderColor: 'whiteAlpha.700',
        backgroundColor: 'gray.700',
    },
};

type valueField<T> = {
    key: keyof T;
};

type customField<T> = {
    displayHandler: (d: T) => ReactElement | string | number;
};

export type DataTableFieldType<T> = (valueField<T> | customField<T>) & { label: string; hidden?: boolean };
export type DataTableDataType = { id: string } & Record<string, any>;

interface StationDisplayDataProps<T> {
    data: T[];
    fields: Array<DataTableFieldType<T>>;
}

export default function DataTable<T extends DataTableDataType>(props: StationDisplayDataProps<T>) {
    const { data, fields } = props;

    const { colorMode } = useColorMode();

    const pageData = data.map(d => ({
        data: d,
        display: fields.reduce<{ [key: string]: { value: any } }>((acc, cur) => {
            if ((cur as any).key) {
                return { ...acc, [cur.label]: { value: (d[(cur as any).key] || '').toString() } };
            } else {
                return { ...acc, [cur.label]: { value: (cur as any).displayHandler(d) } };
            }
        }, {}),
    }));

    return (
        <Table size="sm">
            <Thead position="sticky" top={0} zIndex={10}>
                <Tr sx={{ ...trStyle, ...(colorMode === 'dark' ? trStyleDarkMode : {}) }}>
                    {fields.map((field, i) =>
                        field.hidden ? (
                            <Fragment key={i} />
                        ) : (
                            <Th key={i} p={1}>
                                {field.label}
                            </Th>
                        )
                    )}
                </Tr>
            </Thead>
            <Tbody>
                {pageData.map(item => (
                    <Tr key={item.data.id} sx={{ ...trStyle, ...(colorMode === 'dark' ? trStyleDarkMode : {}) }}>
                        {fields.map((field, i) =>
                            field.hidden ? (
                                <Fragment key={i} />
                            ) : (
                                <Td key={item.data.id + '-' + i} p={1}>
                                    {item.display[field.label].value}
                                </Td>
                            )
                        )}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
