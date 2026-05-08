import { createTestStore, mockSimpleStationList } from '../../setupTests';
import rootReducer from '../../redux';
import { getBranches } from '../../redux/helper/graph-theory-util';
import { render } from '../../test-utils';
import AutoNumModal from './auto-num-modal';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const realStore = rootReducer.getState();
const mockStore = createTestStore({
    param: {
        ...realStore.param,
        stn_list: mockSimpleStationList,
    },
    helper: {
        ...realStore.helper,
        branches: getBranches(mockSimpleStationList),
    },
});

describe('AutoNumModal', () => {
    const user = userEvent.setup();

    it('Can disable submit button if starting index is invalid', async () => {
        render(<AutoNumModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmButton).not.toBeDisabled();

        const fromInput = screen.getByRole('textbox', { name: 'Starting index' });
        expect(fromInput).toHaveDisplayValue('1');

        await user.clear(fromInput);
        expect(fromInput).toHaveDisplayValue('');
        expect(confirmButton).toBeDisabled();

        await user.type(fromInput, 'abc');
        expect(fromInput).toHaveDisplayValue('');
        expect(confirmButton).toBeDisabled();

        await user.type(fromInput, '10');
        expect(fromInput).toHaveDisplayValue('10');
        expect(confirmButton).toBeEnabled();
    });

    it('Can disable submit button if number of digits is invalid', async () => {
        render(<AutoNumModal isOpen={true} onClose={vi.fn()} />, { store: mockStore });

        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        expect(confirmButton).not.toBeDisabled();

        const maxLengthInput = screen.getByRole('textbox', { name: 'Number of digits' });
        expect(maxLengthInput).toHaveDisplayValue('2');

        await user.clear(maxLengthInput);
        expect(maxLengthInput).toHaveDisplayValue('');
        expect(confirmButton).toBeDisabled();

        await user.type(maxLengthInput, 'abc');
        expect(maxLengthInput).toHaveDisplayValue('');
        expect(confirmButton).toBeDisabled();

        await user.type(maxLengthInput, '3');
        expect(maxLengthInput).toHaveDisplayValue('3');
        expect(confirmButton).toBeEnabled();
    });
});
