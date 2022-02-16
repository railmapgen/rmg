import { configure, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { RootState } from './redux';
import { AnyAction, Store } from 'redux';
import createMockStore from 'redux-mock-store';
import { BranchStyle, StationDict } from './constants/constants';
import { act } from 'react-dom/test-utils';
import i18n from './i18n/config';
import { I18nextProvider } from 'react-i18next';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import rootReducer from './redux/index';

configure({ adapter: new Adapter() });

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;
export const createMockAppStore = createMockStore<RootState, DispatchExts>([thunk]);

const realStore = rootReducer.getState();
export const createMockStoreWithMockStations = (stationList: StationDict) =>
    createMockAppStore({
        ...realStore,
        param: { ...realStore.param, stn_list: stationList },
    });

/**
 * Before reversing:
 * stn0 - stn1 - stn2 (main)
 *             \
 *              stn3 - stn4 (branch)
 *
 * After reversing:
 * (branch) stn4 - stn3
 *                      \
 *          (main) stn2 - stn1 - stn0
 */
export const mockSimpleStationList: StationDict = {
    linestart: {
        parents: [],
        children: ['stn0'],
        branch: { left: [], right: [] },
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn1'],
        branch: { left: [], right: [] },
    },
    stn1: {
        parents: ['stn0'],
        children: ['stn2', 'stn3'],
        branch: { left: [], right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn2', 'stn4'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn4'], right: [] },
    },
} as any;

export const waitForComponentToPaint = async (wrapper: ReactWrapper) => {
    await act(async () => {
        await new Promise(resolve => setInterval(resolve, 0));
        wrapper.update();
    });
};

interface TestingProviderProps {
    store?: Store;
    children?: ReactNode;
}

export const TestingProvider = (props: TestingProviderProps) => {
    const { store, children } = props;

    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store || createMockAppStore({ ...rootReducer.getState() })}>{children}</Provider>
        </I18nextProvider>
    );
};
