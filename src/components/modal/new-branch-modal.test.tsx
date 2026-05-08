import { BranchStyle, RmgStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../../redux/helper/graph-theory-util';
import rootReducer, { RootStore } from '../../redux';
import { createTestStore } from '../../setupTests';
import { render } from '../../test-utils';
import NewBranchModal from './new-branch-modal';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const mockStationList = {
    linestart: {
        localisedName: { en: 'LEFT END' },
        parents: [],
        children: ['stn1', 'stn5'],
        branch: { right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        localisedName: { zh: '車站1', en: 'Station 1' },
        parents: ['linestart'],
        children: ['stn2'],
    },
    stn2: {
        localisedName: { zh: '車站2', en: 'Station 2' },
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'] },
    },
    stn3: {
        localisedName: { zh: '車站3', en: 'Station 3' },
        parents: ['stn2'],
        children: ['stn4'],
    },
    stn4: {
        localisedName: { zh: '車站4', en: 'Station 4' },
        parents: ['stn3'],
        children: ['lineend'],
    },
    stn5: {
        localisedName: { zh: '車站5', en: 'Station 5' },
        parents: ['linestart'],
        children: ['stn2'],
    },
    lineend: {
        localisedName: { en: 'RIGHT END' },
        parents: ['stn4'],
        children: [],
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();

describe('NewBranchModal', () => {
    const user = userEvent.setup();

    /**
     * stn1 - stn2 - stn3 - stn4
     *        /
     *   stn5
     */

    describe('NewBranchModal - General', () => {
        let mockStore: RootStore;
        const setup = () => render(<NewBranchModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        beforeEach(() => {
            mockStore = createTestStore({
                param: {
                    ...realStore.param,
                    stn_list: mockStationList,
                },
                helper: {
                    ...realStore.helper,
                    branches,
                },
            });
        });

        it('Can render where dropdown as expected', () => {
            setup();

            const whereSelect = screen.getByRole('combobox', { name: 'Target location' });
            expect(whereSelect).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Between' })).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'and' })).toBeInTheDocument();
            expect(screen.getByRole('radiogroup', { name: 'Position' })).toBeInTheDocument();

            expect(within(whereSelect).getAllByRole('option')).toHaveLength(2);
            expect(within(whereSelect).getByRole('option', { name: 'Create a new branch' })).toBeEnabled();
            expect(within(whereSelect).getByRole('option', { name: 'Create an external line' })).toBeDisabled();
        });

        it('Can display error if failed at verification step', async () => {
            setup();

            await user.selectOptions(screen.getByRole('combobox', { name: 'Between' }), '車站4/Station 4');
            await user.selectOptions(screen.getByRole('combobox', { name: 'and' }), '(RIGHT END)');

            const submitBtn = screen.getByRole('button', { name: 'Confirm' });
            expect(submitBtn).toBeDisabled();
            expect(submitBtn.title).toContain('should not be open jaw from the last station');
        });

        it('Can create new branch as expected', () => {
            setup();

            fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'stn3' } });
            fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: 'lineend' } });
            fireEvent.click(screen.getByText('Confirm'));

            expect(mockStore.getState().param.stn_list.stn3.children).toHaveLength(2);
            expect(mockStore.getState().param.stn_list.lineend.parents).toHaveLength(2);
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
        let mockStore: RootStore;
        const setup = () => render(<NewBranchModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        beforeEach(() => {
            mockStore = createTestStore({
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
        });

        it('Can render where dropdown as expected', () => {
            setup();

            const whereSelect = screen.getByRole('combobox', { name: 'Target location' });
            expect(within(whereSelect).getByRole('option', { name: 'Create a new branch' })).toBeEnabled();
            expect(within(whereSelect).getByRole('option', { name: 'Create an external line' })).toBeEnabled();
        });

        it('Position selection is not available for new branch in SHMetro style', async () => {
            setup();

            await user.selectOptions(
                screen.getByRole('combobox', { name: 'Target location' }),
                'Create an external line'
            );
            expect(screen.queryByRole('radiogroup', { name: 'Position' })).not.toBeInTheDocument();
        });
    });
});
