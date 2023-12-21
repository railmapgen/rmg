import rootReducer from '../../../redux';
import { createMockAppStore } from '../../../setupTests';
import InterchangeSection from './interchange-section';
import { RmgStyle, ShortDirection, StationInfo, StationTransfer } from '../../../constants/constants';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { render } from '../../../test-utils';
import { fireEvent, screen } from '@testing-library/react';

const realStore = rootReducer.getState();

describe('InterchangeSection', () => {
    it('Can render InterchangeCard with headings as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, selectedStation: 'test-station' },
            param: {
                ...realStore.param,
                style: RmgStyle.GZMTR,
                stn_list: {
                    'test-station': {
                        transfer: {
                            groups: [{ lines: [] }, { lines: [] }, { lines: [] }],
                            osi_names: [],
                            tick_direc: ShortDirection.right,
                        } as any as StationTransfer,
                    } as any as StationInfo,
                },
            },
        });

        render(<InterchangeSection />, { store: mockStore });

        expect(screen.getByRole('heading', { name: 'Within-station interchange' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Out-of-station interchange' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Out-of-system interchange' })).toBeInTheDocument();

        // no add interchange group button
        expect(screen.queryByRole('button', { name: 'Add interchange group' })).not.toBeInTheDocument();
    });

    it('Can handle add interchange group as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, selectedStation: 'test-station' },
            param: {
                ...realStore.param,
                style: RmgStyle.GZMTR,
                theme: ['hongkong', 'twl', '#E2231A', MonoColour.white],
                stn_list: {
                    'test-station': {
                        transfer: {
                            groups: [{ lines: [] }, { lines: [] }],
                            osi_names: [],
                            tick_direc: ShortDirection.right,
                        } as any as StationTransfer,
                    } as any as StationInfo,
                },
            },
        });

        render(<InterchangeSection />, { store: mockStore });

        fireEvent.click(screen.getByRole('button', { name: 'Add interchange group' }));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(2);

        // new interchange is added to group 2, index 0
        expect(actions).toContainEqual(
            expect.objectContaining({
                type: 'param/setStations',
                payload: expect.objectContaining({
                    'test-station': expect.objectContaining({
                        transfer: expect.objectContaining({
                            groups: [
                                { lines: [] },
                                { lines: [] },
                                {
                                    lines: [
                                        {
                                            theme: ['hongkong', '', '#AAAAAA', '#fff'],
                                            name: ['', ''],
                                        },
                                    ],
                                },
                            ],
                        }),
                    }),
                }),
            })
        );
        expect(actions).toContainEqual(expect.objectContaining({ type: 'helper/updateHelper' }));
    });
});
