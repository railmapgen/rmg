import rootReducer from '../../redux';
import { createTestStore } from '../../setupTests';
import { render } from '../../test-utils';
import GlobalAlerts from './global-alerts';
import { screen, within } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createTestStore({
    app: {
        ...realStore.app,
        globalAlerts: {
            info: {
                message: 'Test info message',
                url: 'https://example.com',
            },
            warning: {
                message: 'Test warning message',
            },
        },
    },
});

describe('GlobalAlerts', () => {
    it('Can render alerts in correct order as expected', () => {
        render(<GlobalAlerts />, { store: mockStore });

        // order matters
        const alerts = screen.getAllByRole('alert');
        expect(alerts).toHaveLength(2);
        expect(alerts[0].textContent).toContain('info');
        expect(alerts[1].textContent).toContain('warning');

        // can render link
        expect(within(alerts[0]).getByRole('link')).toBeInTheDocument();
    });
});
