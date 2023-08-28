import InterchangeCard from './interchange-card';
import { ExtendedInterchangeInfo } from '../../../constants/constants';
import { CityCode, MonoColour } from '@railmapgen/rmg-palette-resources';
import { render, TestingProvider } from '../../../test-utils';
import { fireEvent, render as originalRender, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import rootReducer from '../../../redux';
import { createMockAppStore } from '../../../setupTests';

const realStore = rootReducer.getState();

const mockInterchangeInfo1: ExtendedInterchangeInfo = {
    theme: [CityCode.Hongkong, 'tcl', '#F38B00', MonoColour.white],
    name: ['東涌綫', 'Tung Chung Line'],
};
const mockInterchangeInfo2: ExtendedInterchangeInfo = {
    theme: [CityCode.Hongkong, 'ael', '#007078', MonoColour.white],
    name: ['機場快綫', 'Airport Express'],
};

const mockCallbacks = {
    onAdd: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
};

describe('InterchangeCard', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Can render card with empty interchange list as expected', () => {
        render(<InterchangeCard interchangeList={[]} {...mockCallbacks} />);

        expect(screen.getByText('No interchanges')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Add interchange' }));
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith({ theme: ['hongkong', '', '#aaaaaa', '#fff'], name: ['', ''] }); // empty interchange info
    });

    it('Can render card with 1 interchange info as expected', () => {
        render(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />);

        // colour edit button has desired styles
        expect(screen.getByRole('button', { name: 'Colour' })).toHaveStyle({ background: '#F38B00', color: '#FFFFFF' });

        expect(screen.getByRole('combobox', { name: 'Chinese name' })).toHaveDisplayValue('東涌綫');
        expect(screen.getByRole('combobox', { name: 'English name' })).toHaveDisplayValue('Tung Chung Line');
    });

    it('Can request theme update and receive updated theme from store', async () => {
        const mockStore = createMockAppStore({ ...realStore });
        const { rerender } = originalRender(
            <TestingProvider store={mockStore}>
                <InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />
            </TestingProvider>
        );

        // click theme button
        fireEvent.click(screen.getByRole('button', { name: 'Colour' }));

        // context receive open event
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({ type: 'app/openPaletteAppClip', payload: mockInterchangeInfo1.theme });

        // rerender with next context
        const updatedStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, paletteAppClipOutput: mockInterchangeInfo2.theme },
        });
        rerender(
            <TestingProvider store={updatedStore}>
                <InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />
            </TestingProvider>
        );

        // update theme to parent
        expect(mockCallbacks.onUpdate).toBeCalledTimes(1);
        expect(mockCallbacks.onUpdate).toBeCalledWith(0, {
            ...mockInterchangeInfo1,
            theme: mockInterchangeInfo2.theme,
        });
    });

    it('Can duplicate and delete interchange info as expected', () => {
        render(<InterchangeCard interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />);

        // copy current interchange info
        fireEvent.click(screen.getByRole('button', { name: 'Copy interchange' }));
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith(mockInterchangeInfo1); // current info

        // delete current interchange info
        fireEvent.click(screen.getByRole('button', { name: 'Remove interchange' }));
        expect(mockCallbacks.onDelete).toBeCalledTimes(1);
        expect(mockCallbacks.onDelete).toBeCalledWith(0); // current index
    });

    it('Can render card with multiple interchange info as expected', () => {
        render(<InterchangeCard interchangeList={[mockInterchangeInfo1, mockInterchangeInfo2]} {...mockCallbacks} />);

        // only the first stack has labels
        const stack0 = screen.getByTestId('interchange-card-stack-0');
        within(stack0)
            .getAllByRole('combobox')
            .forEach(el => expect(el).toHaveAccessibleName());
        expect(within(stack0).queryByRole('button', { name: 'Copy interchange' })).not.toBeInTheDocument();
        expect(within(stack0).getByRole('button', { name: 'Remove interchange' })).toBeInTheDocument();

        // only the last stack has copy button
        const stack1 = screen.getByTestId('interchange-card-stack-1');
        within(stack1)
            .getAllByRole('combobox')
            .forEach(el => expect(el).not.toHaveAccessibleName());
        expect(within(stack1).getByRole('button', { name: 'Copy interchange' })).toBeInTheDocument();
        expect(within(stack1).getByRole('button', { name: 'Remove interchange' })).toBeInTheDocument();
    });
});
