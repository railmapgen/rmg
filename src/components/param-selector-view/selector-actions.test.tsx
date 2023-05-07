import { render } from '../../test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import * as utils from '../../util/utils';
import SelectorActions from './selector-actions';
import { vi } from 'vitest';

const mockCallbacks = {
    onError: vi.fn(),
};

describe('SelectorActions', () => {
    afterEach(() => {
        vi.clearAllMocks();
        window.localStorage.clear();
    });

    it('Can init new param and save to localStorage as expected', async () => {
        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        expect(window.localStorage.length).toBe(0);

        fireEvent.click(screen.getByRole('button', { name: 'Blank project' }));

        expect(window.localStorage.length).toBe(2);
    });

    it('Can show error message if invalid type of file is uploaded', async () => {
        const readFileAsTextSpy = vi.spyOn(utils, 'readFileAsText');
        readFileAsTextSpy.mockResolvedValue('dummy-content');
        const mockInvalidTypeFile = new File(['dummy-content'], 'invalid-file-type.txt', { type: 'text/plain' });

        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [mockInvalidTypeFile] } });

        expect(mockCallbacks.onError).toBeCalledTimes(1);
        expect(mockCallbacks.onError).lastCalledWith(expect.stringContaining('Invalid'));
    });
});
