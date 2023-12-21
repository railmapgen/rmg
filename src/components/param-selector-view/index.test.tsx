import { render } from '../../test-utils';
import ParamSelectorView from './index';
import { createParamInLocalStorage } from '../../setupTests';
import { act, fireEvent, screen } from '@testing-library/react';

describe('ParamSelectorView', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('Can disable open button if no project is selected', async () => {
        createParamInLocalStorage('test-1');
        createParamInLocalStorage('test-2');

        await act(async () => {
            render(<ParamSelectorView />);
        });

        // display 2 projects for selecting
        expect(screen.getByText(/test-1/)).toBeInTheDocument();
        expect(screen.getByText(/test-2/)).toBeInTheDocument();

        // open button is disabled
        expect(screen.getByRole('button', { name: 'Open selected' })).toBeDisabled();

        // select test-2 and open
        fireEvent.click(screen.getByText(/test-2/));
        expect(screen.getByRole('button', { name: 'Open selected' })).toBeEnabled();
    });

    it('Can disable new/template/upload buttons if max number reached', async () => {
        for (let i = 1; i <= 10; i++) {
            createParamInLocalStorage('test-' + i);
        }

        await act(async () => {
            render(<ParamSelectorView />);
        });

        // new/template/upload buttons are disabled
        expect(screen.getByRole('button', { name: 'Blank project' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Open template' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Import project' })).toBeDisabled();
    });
});
