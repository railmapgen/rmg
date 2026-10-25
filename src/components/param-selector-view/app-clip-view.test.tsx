// 测试：验证内嵌项目导入视图所覆盖的项目选择与管理界面行为。
import { createParamInLocalStorage, createTestStore } from '../../setupTests';
import { render } from '../../test-utils';
import AppClipView from './app-clip-view';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('AppClipView', () => {
    const user = userEvent.setup();

    it('Can broadcast selected param as expected', async () => {
        createParamInLocalStorage('test-id');
        render(<AppClipView />, { store: createTestStore(), route: '/import?parentId=test-id' });

        // 模拟 BroadcastChannel 接收端
        const messages: any[] = [];
        const receiver = new BroadcastChannel('rmg-bridge--test-id');
        receiver.onmessage = message => {
            messages.push(message.data);
        };

        // 选择项目
        await user.click(screen.getByRole('button', { name: /test-id/ }));
        expect(screen.getByRole('button', { name: /test-id/ }).parentElement).toHaveClass('selected');

        // 点击导入
        await user.click(screen.getByRole('button', { name: 'Import' }));
        await waitFor(() => expect(messages).toHaveLength(1));
        expect(messages).toContainEqual(expect.objectContaining({ event: 'IMPORT' }));

        // 取消选择项目
        expect(screen.getByRole('button', { name: /test-id/ }).parentElement).not.toHaveClass('selected');
    });
});
