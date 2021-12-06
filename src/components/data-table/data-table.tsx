import React, { ReactElement } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

type valueField<T> = {
    label: string;
    key: keyof T;
};

type customField<T> = {
    label: string;
    displayHandler: (d: T) => ReactElement | string | number;
};

export type DataTableFieldType<T> = valueField<T> | customField<T>;
export type DataTableDataType = { id: string } & Record<string, any>;

interface StationDisplayDataProps<T> {
    data: T[];
    fields: Array<DataTableFieldType<T>>;
}

export default function DataTable<T extends DataTableDataType>(props: StationDisplayDataProps<T>) {
    const { data, fields } = props;

    const pageData = data.map(d => ({
        data: d,
        display: fields.reduce<{ [key: string]: { value: any } }>((acc, cur) => {
            const value = (cur as any).key ? (d[(cur as any).key] || '').toString() : (cur as any).displayHandler(d);
            acc[cur.label] = { value };
            return acc;
        }, {}),
    }));

    return (
        <Table size="sm">
            <Thead>
                <Tr>
                    {fields.map((field, i) => (
                        <Th key={i}>{field.label}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {pageData.map(item => (
                    <Tr key={item.data.id}>
                        {fields.map((field, i) => (
                            <Td key={item.data.id + '-' + i}>{item.display[field.label].value}</Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
