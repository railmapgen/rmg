import React from 'react';
import { createMockAppStore, mockSimpleStationList } from '../../setupTests';
import rootReducer from '../../redux';
import { getBranches } from '../../redux/helper/graph-theory-util';
import { render } from '../../test-utils';
import AutoNumModal from './auto-num-modal';
import { act, fireEvent, screen } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
    param: {
        ...realStore.param,
        stn_list: mockSimpleStationList,
    },
    helper: {
        ...realStore.helper,
        branches: getBranches(mockSimpleStationList),
    },
});

describe('AutoNumModal', () => {
    it('Can disable submit button if starting index is invalid', async () => {
        render(<AutoNumModal isOpen={true} onClose={jest.fn()} />, { store: mockStore });

        expect(screen.getByText('Confirm')).not.toBeDisabled();
        jest.useFakeTimers();

        fireEvent.change(screen.getByRole('combobox', { name: 'Starting index' }), { target: { value: '' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Starting index' })).toBeValid();
        expect(screen.getByText('Confirm')).toBeDisabled();

        fireEvent.change(screen.getByRole('combobox', { name: 'Starting index' }), { target: { value: 'abc' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Starting index' })).not.toBeValid();
        expect(screen.getByText('Confirm')).toBeDisabled();

        fireEvent.change(screen.getByRole('combobox', { name: 'Starting index' }), { target: { value: '10' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Starting index' })).toBeValid();
        expect(screen.getByText('Confirm')).not.toBeDisabled();
    });

    it('Can disable submit button if number of digits is invalid', async () => {
        render(<AutoNumModal isOpen={true} onClose={jest.fn()} />, { store: mockStore });

        expect(screen.getByText('Confirm')).not.toBeDisabled();
        jest.useFakeTimers();

        fireEvent.change(screen.getByRole('combobox', { name: 'Number of digits' }), { target: { value: '' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Number of digits' })).toBeValid();
        expect(screen.getByText('Confirm')).toBeDisabled();

        fireEvent.change(screen.getByRole('combobox', { name: 'Number of digits' }), { target: { value: 'abc' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Number of digits' })).not.toBeValid();
        expect(screen.getByText('Confirm')).toBeDisabled();

        fireEvent.change(screen.getByRole('combobox', { name: 'Number of digits' }), { target: { value: '3' } });
        await act(async () => {
            jest.advanceTimersByTime(0);
        });
        expect(screen.getByRole('combobox', { name: 'Number of digits' })).toBeValid();
        expect(screen.getByText('Confirm')).not.toBeDisabled();
    });
});
