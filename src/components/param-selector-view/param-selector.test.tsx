import React from 'react';
import rootReducer from '../../redux';
import { render } from '../../test-utils';
import ParamSelector from './param-selector';
import { createMockAppStore } from '../../setupTests';
import { screen } from '@testing-library/react';

const now = new Date().getTime();

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
    app: {
        ...realStore.app,
        paramRegistry: [
            { id: 'test-01', lastModified: now - 10 * 60 * 1000 }, // 10 mins ago
            { id: 'test-02', lastModified: now - 60 * 1000 }, // 1 min ago
            { id: 'test-03' },
        ],
    },
});

const mockCallbacks = {
    onParamSelect: jest.fn(),
    onParamRemove: jest.fn(),
};

describe('ParamSelector', () => {
    it('Can sort params by last modified time', () => {
        render(<ParamSelector {...mockCallbacks} />, { store: mockStore });

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAccessibleName(/test-02/);
        expect(buttons[2]).toHaveAccessibleName(/test-01/);
        expect(buttons[4]).toHaveAccessibleName(/test-03/);
    });
});
