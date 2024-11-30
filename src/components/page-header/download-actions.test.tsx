import { createTestStore } from '../../setupTests';
import rootReducer from '../../redux';
import { render } from '../../test-utils';
import DownloadActions from './download-actions';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import * as utils from '../../util/utils';

const realStore = rootReducer.getState();
const mockStore = createTestStore({
    app: {
        ...realStore.app,
        paramConfig: {
            id: 'test-id',
        },
    },
});

const downloadAsSpy = vi.spyOn(utils, 'downloadAs').mockReturnValue();

describe('DownloadActions', () => {
    it.skip('Can download configuration file as expected', async () => {
        const user = userEvent.setup();
        render(<DownloadActions />, { store: mockStore });

        await user.click(screen.getByRole('button', { name: 'Downloads' }));
        await user.click(screen.getByText('Configuration file'));

        expect(downloadAsSpy).toBeCalledTimes(1);
        expect(downloadAsSpy).toBeCalledWith(
            expect.stringContaining('.json'),
            'application/json',
            expect.stringContaining('version')
        );
    });
});
