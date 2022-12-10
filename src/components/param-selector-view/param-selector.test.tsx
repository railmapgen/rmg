import { render } from '../../test-utils';
import ParamSelector from './param-selector';
import { act, fireEvent, screen } from '@testing-library/react';
import { ParamConfig } from '../../constants/constants';
import { vi } from 'vitest';

const mockCallbacks = {
    onParamSelect: vi.fn(),
    onParamRemove: vi.fn(),
    onParamUpdate: vi.fn(),
};

describe('ParamSelector', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Can sort params by last modified time', () => {
        const now = new Date().getTime();
        const paramRegistry: ParamConfig[] = [
            { id: 'test-01', lastModified: now - 10 * 60 * 1000 }, // 10 mins ago
            { id: 'test-02', lastModified: now - 60 * 1000 }, // 1 min ago
            { id: 'test-03' },
        ];
        render(<ParamSelector paramRegistry={paramRegistry} {...mockCallbacks} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAccessibleName(/test-02/);
        expect(buttons[3]).toHaveAccessibleName(/test-01/);
        expect(buttons[6]).toHaveAccessibleName(/test-03/);
    });

    it('Can update param config as expected', async () => {
        const now = new Date().getTime();
        const paramRegistry: ParamConfig[] = [{ id: 'test-01', lastModified: now }];
        render(<ParamSelector paramRegistry={paramRegistry} {...mockCallbacks} />);

        // button display as project id
        expect(screen.getAllByRole('button')[0]).toHaveAccessibleName(/Project test-01/);

        // click edit and open modal
        fireEvent.click(screen.getByRole('button', { name: 'Edit project info' }));
        await screen.findByRole('dialog');

        vi.useFakeTimers();
        // input project name and submit
        fireEvent.change(screen.getByRole('combobox', { name: 'Project name' }), {
            target: { value: 'My Masterpiece' },
        });
        await act(async () => {
            vi.advanceTimersByTime(0);
        });
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(mockCallbacks.onParamUpdate).toBeCalledTimes(1);
        expect(mockCallbacks.onParamUpdate).lastCalledWith({
            id: 'test-01',
            lastModified: now,
            name: 'My Masterpiece',
        });
    });
});
