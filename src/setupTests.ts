import { configure, ReactWrapper } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { RootState } from './redux';
import { AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import { BranchStyle, StationDict } from './constants/constants';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;
export const createMockAppStore = createMockStore<RootState, DispatchExts>([thunk]);

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
