// 测试：验证换乘卡片所覆盖的侧边栏车站编辑行为。
import InterchangeCard from './interchange-card';
import { ExtendedInterchangeInfo } from '../../../constants/constants';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { render } from '../../../test-utils';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { createTestStore } from '../../../setupTests';
import { onPaletteAppClipEmit } from '../../../redux/app/app-slice';

const mockInterchangeInfo1: ExtendedInterchangeInfo = {
    theme: ['hongkong', 'tcl', '#F38B00', MonoColour.white],
    name: ['東涌綫', 'Tung Chung Line'],
};
const mockInterchangeInfo2: ExtendedInterchangeInfo = {
    theme: ['hongkong', 'ael', '#007078', MonoColour.white],
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
        render(<InterchangeCard title="Test group" interchangeList={[]} {...mockCallbacks} />);

        expect(screen.getByText('No interchanges')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Add interchange' }));
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith({ theme: ['hongkong', '', '#aaaaaa', '#fff'], name: ['', ''] }); // empty interchange info
    });

    it('Can render card with 1 interchange info as expected', () => {
        render(<InterchangeCard title="Test group" interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />);

        // 颜色编辑按钮具有预期样式
        const themeButton = screen.getByRole('button', { name: 'Colour' });
        expect(themeButton).toHaveStyle({ color: '#FFFFFF' });
        expect(themeButton.querySelector('.mantine-ColorSwatch-colorOverlay')).toHaveStyle({
            backgroundColor: '#F38B00',
        });

        expect(screen.getByRole('combobox', { name: 'Chinese name' })).toHaveDisplayValue('東涌綫');
        expect(screen.getByRole('combobox', { name: 'English name' })).toHaveDisplayValue('Tung Chung Line');
    });

    it('Can request theme update and receive updated theme from store', async () => {
        const mockStore = createTestStore();
        render(<InterchangeCard title="Test group" interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />, {
            store: mockStore,
        });

        // 点击主题按钮
        fireEvent.click(screen.getByRole('button', { name: 'Colour' }));

        // 上下文接收到打开事件
        expect(mockStore.getState().app.paletteAppClipInput).toEqual(mockInterchangeInfo1.theme);
        expect(mockStore.getState().app.paletteAppClipOutput).toBeUndefined();

        // 使用下一份上下文重新渲染
        await act(async () => {
            mockStore.dispatch(onPaletteAppClipEmit(mockInterchangeInfo2.theme!));
        });

        // 将主题更新回父组件
        expect(mockCallbacks.onUpdate).toBeCalledTimes(1);
        expect(mockCallbacks.onUpdate).toBeCalledWith(0, {
            ...mockInterchangeInfo1,
            theme: mockInterchangeInfo2.theme,
        });
    });

    it('Can duplicate and delete interchange info as expected', () => {
        render(<InterchangeCard title="Test group" interchangeList={[mockInterchangeInfo1]} {...mockCallbacks} />);

        // 复制当前换乘信息
        fireEvent.click(screen.getByRole('button', { name: 'Copy interchange' }));
        expect(mockCallbacks.onAdd).toBeCalledTimes(1);
        expect(mockCallbacks.onAdd).toBeCalledWith(mockInterchangeInfo1); // current info

        // 删除当前换乘信息
        fireEvent.click(screen.getByRole('button', { name: 'Remove interchange' }));
        expect(mockCallbacks.onDelete).toBeCalledTimes(1);
        expect(mockCallbacks.onDelete).toBeCalledWith(0); // current index
    });

    it('Can render card with multiple interchange info as expected', () => {
        render(
            <InterchangeCard
                title="Test group"
                interchangeList={[mockInterchangeInfo1, mockInterchangeInfo2]}
                {...mockCallbacks}
            />
        );

        // 仅第一组显示标签
        const stack0 = screen.getByTestId('interchange-card-stack-0');
        within(stack0)
            .getAllByRole('combobox')
            .forEach(el => expect(el).toHaveAccessibleName());
        expect(within(stack0).queryByRole('button', { name: 'Copy interchange' })).not.toBeInTheDocument();
        expect(within(stack0).getByRole('button', { name: 'Remove interchange' })).toBeInTheDocument();

        // 仅最后一组显示复制按钮
        const stack1 = screen.getByTestId('interchange-card-stack-1');
        within(stack1)
            .getAllByRole('combobox')
            .forEach(el => expect(el).not.toHaveAccessibleName());
        expect(within(stack1).getByRole('button', { name: 'Copy interchange' })).toBeInTheDocument();
        expect(within(stack1).getByRole('button', { name: 'Remove interchange' })).toBeInTheDocument();
    });
});
