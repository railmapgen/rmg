import React from 'react';
import { mount } from 'enzyme';
import DataTable, { DataTableDataType, DataTableFieldType } from './data-table';

describe('Unit tests for DataTable component', () => {
    it('Can display column header and cell value as expected', () => {
        const data: DataTableDataType[] = [{ id: '001', field1: 'Value 1', isSelected: false }];
        const fields: DataTableFieldType<DataTableDataType>[] = [{ label: 'Field 1', key: 'field1' }];

        const wrapper = mount(<DataTable data={data} fields={fields} />);

        expect(wrapper.find('th').text()).toBe('Field 1');
        expect(wrapper.find('td').text()).toBe('Value 1');
    });

    it('Can display customised component in cell as expected', () => {
        const data: DataTableDataType[] = [{ id: '001', field1: 'Value 1', isSelected: false }];
        const fields: DataTableFieldType<DataTableDataType>[] = [
            {
                label: 'Field 1',
                displayHandler: item => <button>{item.field1}</button>,
            },
        ];

        const wrapper = mount(<DataTable data={data} fields={fields} />);

        expect(wrapper.find('button').text()).toBe('Value 1');
    });
});
