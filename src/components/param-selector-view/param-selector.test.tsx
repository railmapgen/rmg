import React from 'react';
import rootReducer from '../../redux';
import { render } from '../../test-utils';
import ParamSelector from './param-selector';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { screen } from '@testing-library/react';
import { ParamConfig } from '../../constants/constants';

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
        createParamInLocalStorage('test-02');
        createParamInLocalStorage('test-03');

        const paramRegistry: ParamConfig[] = [
            { id: 'test-01', lastModified: now - 10 * 60 * 1000 }, // 10 mins ago
            { id: 'test-02', lastModified: now - 60 * 1000 }, // 1 min ago
            { id: 'test-03' },
        ];

        render(<ParamSelector paramRegistry={paramRegistry} {...mockCallbacks} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAccessibleName(/test-02/);
        expect(buttons[2]).toHaveAccessibleName(/test-01/);
        expect(buttons[4]).toHaveAccessibleName(/test-03/);
    });
});
