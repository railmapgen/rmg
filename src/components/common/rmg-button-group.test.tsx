import React from 'react';
import RmgButtonGroup from './rmg-button-group';
import { render } from '../../test-utils';
import { fireEvent, screen } from '@testing-library/react';

const mockSelections = [
    {
        label: 'Local',
        value: 'local',
        disabled: true,
    },
    {
        label: 'Express',
        value: 'express',
    },
    {
        label: 'Direct',
        value: 'direct',
    },
];

const mockCallbacks = {
    onChange: jest.fn(),
};

describe('Unit tests for RmgButtonGroup component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can render single select button group as expected', () => {
        render(<RmgButtonGroup selections={mockSelections} defaultValue="local" {...mockCallbacks} />);

        expect(screen.getByRole('checkbox', { name: 'Local' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Express' })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Direct' })).not.toBeChecked();

        fireEvent.click(screen.getByRole('checkbox', { name: 'Express' }));
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith('express');
    });

    it('Can render multi select button group as expected', () => {
        render(
            <RmgButtonGroup
                selections={mockSelections}
                defaultValue={['local', 'express']}
                multiSelect
                {...mockCallbacks}
            />
        );

        expect(screen.getByRole('checkbox', { name: 'Local' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Express' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Direct' })).not.toBeChecked();

        // disabled selection is not toggleable
        fireEvent.click(screen.getByRole('checkbox', { name: 'Local' }));
        expect(mockCallbacks.onChange).toBeCalledTimes(0);

        fireEvent.click(screen.getByRole('checkbox', { name: 'Direct' }));
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith(['local', 'express', 'direct']);
    });
});
