import { BranchStyle, RmgStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../../redux/helper/graph-theory-util';
import rootReducer from '../../redux';
import { createMockAppStore } from '../../setupTests';
import { render } from '../../test-utils';
import NewBranchModal from './new-branch-modal';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { SET_STATIONS_BULK } from '../../redux/param/action';
import { vi } from 'vitest';

const mockStationList = {
    linestart: {
        name: ['路綫左端', 'LEFT END'],
        parents: [],
        children: ['stn1', 'stn5'],
        branch: { left: [], right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        name: ['車站1', 'Station 1'],
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        name: ['車站2', 'Station 2'],
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'], right: [] },
    },
    stn3: {
        name: ['車站3', 'Station 3'],
        parents: ['stn2'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        name: ['車站4', 'Station 4'],
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn5: {
        name: ['車站5', 'Station 5'],
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        name: ['路綫右端', 'RIGHT END'],
        parents: ['stn4'],
        children: [],
        branch: { left: [], right: [] },
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();

describe('NewBranchModal', () => {
    /**
     * stn1 - stn2 - stn3 - stn4
     *        /
     *   stn5
     */

    describe('NewBranchModal - General', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });
        const setup = () => render(<NewBranchModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        it('Can render where dropdown as expected', () => {
            setup();

            const fields = screen.getAllByRole('group');
            expect(fields.length).toBe(4); // where, from, to, position

            expect(within(fields[0]).getAllByRole('option')).toHaveLength(2);
            expect(within(fields[0]).getByText(/new branch/)).not.toBeDisabled();
            expect(within(fields[0]).getByText(/external/)).toBeDisabled();
        });

        it('Can display error if failed at verification step', () => {
            setup();

            fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'stn4' } });
            fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'lineend' } });

            const submitBtn = screen.getByText('Confirm');
            expect(submitBtn).toBeDisabled();
            expect(submitBtn.title).toContain('should not be open jaw from the last station');
        });

        it('Can create new branch as expected', () => {
            setup();

            fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'stn3' } });
            fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'lineend' } });
            fireEvent.click(screen.getByText('Confirm'));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));
        });

        it('Can reset from and to selections', async () => {
            const { rerender } = setup();
            fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'stn3' } });
            fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'lineend' } });

            expect(screen.queryByDisplayValue(/Please select/)).toBeNull();
            expect(screen.getByDisplayValue(/Station 3/)).not.toBeNull();
            expect(screen.getByDisplayValue(/RIGHT END/)).not.toBeNull();

            rerender(<NewBranchModal isOpen={false} onClose={vi.fn()} />);
            rerender(<NewBranchModal isOpen={true} onClose={vi.fn()} />);

            await waitFor(() => {
                expect(screen.getAllByDisplayValue(/Please select/)).toHaveLength(2);
            });
        });
    });

    describe('NewBranchModal - SHMetro', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                style: RmgStyle.SHMetro,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });
        const setup = () => render(<NewBranchModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        it('Can render where dropdown as expected', () => {
            setup();

            const fields = screen.getAllByRole('group');
            expect(within(fields[0]).getByText(/new branch/)).not.toBeDisabled();
            expect(within(fields[0]).getByText(/external/)).not.toBeDisabled();
        });

        it('Position selection is not available for new branch in SHMetro style', () => {
            setup();

            fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'ext' } });

            expect(screen.getAllByRole('group')).toHaveLength(3);
        });
    });
});
