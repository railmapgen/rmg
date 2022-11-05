import React from 'react';
import rootReducer from '../../redux';
import { render } from '../../test-utils';
import ParamSelector from './param-selector';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { screen } from '@testing-library/react';
import { LocalStorageKey } from '../../constants/constants';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
});

const mockCallbacks = {
    onParamSelect: jest.fn(),
    onParamRemove: jest.fn(),
};

describe('ParamSelector', () => {
    it('Can sort params by last modified time', () => {
        const now = new Date().getTime();

        createParamInLocalStorage('test-01');
        window.localStorage.setItem(
            LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-01',
            JSON.stringify({ lastModified: now - 10 * 60 * 1000 })
        ); // 10 mins ago

        createParamInLocalStorage('test-02');
        window.localStorage.setItem(
            LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-02',
            JSON.stringify({ lastModified: now - 60 * 1000 })
        ); // 10 mins ago

        createParamInLocalStorage('test-03');

        render(<ParamSelector {...mockCallbacks} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAccessibleName(/test-02/);
        expect(buttons[2]).toHaveAccessibleName(/test-01/);
        expect(buttons[4]).toHaveAccessibleName(/test-03/);
    });
});
