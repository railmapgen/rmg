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
    it('Can disable submit button if entered text is invalid', async () => {
        render(<AutoNumModal isOpen={true} onClose={jest.fn()} />, { store: mockStore });

        expect(screen.getByText('Submit')).not.toBeDisabled();
        jest.useFakeTimers();

        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).toBeDisabled();

        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'abc' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).toBeDisabled();

        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '10' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).not.toBeDisabled();

        fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).toBeDisabled();

        fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'abc' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).toBeDisabled();

        fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '3' } });
        await act(async () => {
            jest.advanceTimersByTime(501);
        });
        expect(screen.getByText('Submit')).not.toBeDisabled();
    });
});
