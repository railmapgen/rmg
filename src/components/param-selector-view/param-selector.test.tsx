// 测试：验证项目选择器所覆盖的项目选择与管理界面行为。
import { render } from '../../test-utils';
import ParamSelector from './param-selector';
import { screen } from '@testing-library/react';
import { ParamConfig } from '../../constants/constants';
import { userEvent } from '@testing-library/user-event';

const mockCallbacks = {
    onParamSelect: vi.fn(),
    onParamRemove: vi.fn(),
    onParamUpdate: vi.fn(),
};

describe('ParamSelector', () => {
    const user = userEvent.setup();

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

        // 按钮显示项目 ID
        expect(screen.getAllByRole('button')[0]).toHaveAccessibleName(/Project test-01/);

        // 点击编辑并打开对话框
        await user.click(screen.getByRole('button', { name: 'Edit project info' }));
        await screen.findByRole('dialog');

        // 输入项目名称并提交
        await user.type(screen.getByRole('textbox', { name: 'Project name' }), 'My Masterpiece');
        await user.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(mockCallbacks.onParamUpdate).toBeCalledTimes(1);
        expect(mockCallbacks.onParamUpdate).lastCalledWith({
            id: 'test-01',
            lastModified: now,
            name: 'My Masterpiece',
        });
    });
});
