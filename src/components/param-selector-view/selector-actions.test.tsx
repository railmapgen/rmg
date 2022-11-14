import React from 'react';
import { render } from '../../test-utils';
import { fireEvent, screen } from '@testing-library/react';
import * as utils from '../../util/utils';
import SelectorActions from './selector-actions';

const mockCallbacks = {
    onError: jest.fn(),
};

describe('SelectorActions', () => {
    afterEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
    });

    it('Can init new param and save to localStorage as expected', () => {
        render(<SelectorActions {...mockCallbacks} />);

        expect(window.localStorage.length).toBe(0);

        fireEvent.click(screen.getByRole('button', { name: 'Blank project' }));

        expect(window.localStorage.length).toBe(2);
    });

    it('Can show error message if invalid type of file is uploaded', () => {
        const readFileAsTextSpy = jest.spyOn(utils, 'readFileAsText');
        readFileAsTextSpy.mockResolvedValue('dummy-content');
        const mockInvalidTypeFile = new File(['dummy-content'], 'invalid-file-type.txt', { type: 'text/plain' });

        render(<SelectorActions {...mockCallbacks} />);

        fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [mockInvalidTypeFile] } });

        expect(mockCallbacks.onError).toBeCalledTimes(1);
        expect(mockCallbacks.onError).lastCalledWith(expect.stringContaining('Invalid'));
    });
});
