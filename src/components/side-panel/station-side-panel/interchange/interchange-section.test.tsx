import React from 'react';
import rootReducer from '../../../../redux';
import { createMockAppStore, TestingProvider } from '../../../../setupTests';
import InterchangeSection from './interchange-section';
import { mount } from 'enzyme';
import { MonoColour, StationInfo, StationTransfer } from '../../../../constants/constants';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import * as helperActions from '../../../../redux/helper/action';
import { SET_STATION } from '../../../../redux/param/action';

const realStore = rootReducer.getState();

describe('Unit tests for InterchangeSection component', () => {
    it('Can render InterchangeCard with headings as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, selectedStation: 'test-station' },
            param: {
                ...realStore.param,
                stn_list: {
                    'test-station': {
                        transfer: {
                            info: [[], [], []],
                            osi_names: [],
                        } as any as StationTransfer,
                    } as any as StationInfo,
                },
            },
        });

        const wrapper = mount(<InterchangeSection />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        const headings = wrapper.find('h5');
        expect(headings).toHaveLength(3);
        expect(headings.at(0).text()).toBe('Within-station interchange');
        expect(headings.at(1).text()).toBe('Out-of-station interchange');
        expect(headings.at(2).text()).toBe('Out-of-system interchange');

        // no add interchange group button
        expect(wrapper.find('button')).toHaveLength(3); // for each interchange cards
    });

    it('Can handle add interchange group as expected', () => {
        jest.spyOn(helperActions, 'triggerHelpersUpdate').mockReturnValue(() => {});

        const mockStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, selectedStation: 'test-station' },
            param: {
                ...realStore.param,
                theme: [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white],
                stn_list: {
                    'test-station': {
                        transfer: {
                            info: [[], []],
                            osi_names: [],
                        } as any as StationTransfer,
                    } as any as StationInfo,
                },
            },
        });

        const wrapper = mount(<InterchangeSection />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        const buttons = wrapper.find('button');
        expect(buttons).toHaveLength(3);
        expect(buttons.at(2).text()).toContain('Add interchange group');

        buttons.at(2).simulate('click');
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        // new interchange is added to group 2, index 0
        expect(actions).toContainEqual(
            expect.objectContaining({
                type: SET_STATION,
                stationId: 'test-station',
                station: expect.objectContaining({
                    transfer: expect.objectContaining({
                        info: [[], [], [['hongkong', '', '#AAAAAA', '#fff', '', '']]],
                    }),
                }),
            })
        );
    });
});
