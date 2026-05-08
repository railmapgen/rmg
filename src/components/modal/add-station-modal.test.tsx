import { BranchStyle, RmgStyle, SidePanelMode, StationDict } from '../../constants/constants';
import { getBranches } from '../../redux/helper/graph-theory-util';
import rootReducer from '../../redux';
import { createTestStore } from '../../setupTests';
import AddStationModal from './add-station-modal';
import { render } from '../../test-utils';
import { screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const mockStationList = {
    linestart: {
        localisedName: { en: 'LEFT END' },
        parents: [],
        children: ['stn1', 'stn5'],
        branch: { left: [], right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        localisedName: { zh: '車站1', en: 'Station 1' },
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        localisedName: { zh: '車站2', en: 'Station 2' },
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'], right: [] },
    },
    stn3: {
        localisedName: { zh: '車站3', en: 'Station 3' },
        parents: ['stn2'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        localisedName: { zh: '車站4', en: 'Station 4' },
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn5: {
        localisedName: { zh: '車站5', en: 'Station 5' },
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        localisedName: { en: 'RIGHT END' },
        parents: ['stn4'],
        children: [],
        branch: { left: [], right: [] },
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();

describe('AddStationModal', () => {
    const user = userEvent.setup();

    /**
     * stn1 - stn2 - stn3 - stn4
     *        /
     *   stn5
     */

    describe('AddStationModal - General', () => {
        const mockStore = createTestStore({
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });
        const setup = () => render(<AddStationModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        it('Can render where dropdown as expected', () => {
            setup();

            const whereSelect = screen.getByRole('combobox', { name: 'Target location' });
            expect(whereSelect).toBeInTheDocument();
            expect(screen.getByRole('radiogroup', { name: 'Preposition' })).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Pivot station' })).toBeInTheDocument();

            expect(within(whereSelect).getAllByRole('option')).toHaveLength(2);
            expect(within(whereSelect).getByRole('option', { name: 'Main line' }));
            expect(within(whereSelect).getByRole('option', { name: 'Branch 1' }));
        });

        it('Can render from and to dropdowns for main line as expected', () => {
            setup();

            const pivotSelect = screen.getByRole('combobox', { name: 'Pivot station' });

            // 4 stations in main line + please select
            expect(within(pivotSelect).getAllByRole('option')).toHaveLength(5);
            expect(within(pivotSelect).queryByRole('option', { name: '車站5/Station 5' })).not.toBeInTheDocument();
        });

        it('Submit button is disabled by default (without selection)', async () => {
            setup();

            expect(screen.getByDisplayValue(/Please select/)).not.toBeNull();
            expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();

            await user.selectOptions(screen.getByRole('combobox', { name: 'Pivot station' }), '車站3/Station 3');

            expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled();
        });

        it('Can reset pivot selection when where is changed', async () => {
            setup();

            await user.selectOptions(screen.getByRole('combobox', { name: 'Pivot station' }), '車站3/Station 3');
            expect(screen.queryByDisplayValue(/Please select/)).toBeNull();

            await user.selectOptions(screen.getByRole('combobox', { name: 'Target location' }), 'Branch 1');
            expect(screen.getByDisplayValue(/Please select/)).not.toBeNull();
        });

        it('Can add station in existing branch as expected', async () => {
            setup();
            const prevStations = Object.keys(mockStore.getState().param.stn_list);

            await user.selectOptions(screen.getByRole('combobox', { name: 'Pivot station' }), '車站3/Station 3');
            await user.click(screen.getByRole('button', { name: 'Confirm' }));

            const addedStations = Object.keys(mockStore.getState().param.stn_list).filter(
                id => !prevStations.includes(id)
            );
            expect(addedStations).toHaveLength(1);

            // open side panel
            expect(mockStore.getState().app.selectedStation).toBe(addedStations[0]);
            expect(mockStore.getState().app.sidePanelMode).toBe(SidePanelMode.STATION);
        });
    });

    describe('AddStationModal - SHMetro', () => {
        const mockStore = createTestStore({
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
        const setup = () => render(<AddStationModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        it('Can render where dropdown for SHMetro style as expected', () => {
            setup();

            const whereSelect = screen.getByRole('combobox', { name: 'Target location' });
            expect(whereSelect).toBeInTheDocument();
            expect(screen.getByRole('radiogroup', { name: 'Preposition' })).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Pivot station' })).toBeInTheDocument();

            expect(within(whereSelect).getAllByRole('option')).toHaveLength(2);
            expect(within(whereSelect).getByRole('option', { name: 'Main line' })).toBeInTheDocument();
            expect(within(whereSelect).queryByRole('option', { name: 'Branch 1' })).not.toBeInTheDocument();
            expect(within(whereSelect).getByRole('option', { name: 'External line 1' })).toBeInTheDocument();
        });
    });
});
