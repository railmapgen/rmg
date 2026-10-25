// 验证项目选择与管理界面入口。
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

        // 显示两个可供选择的项目
        expect(screen.getByText(/test-1/)).toBeInTheDocument();
        expect(screen.getByText(/test-2/)).toBeInTheDocument();

        // 打开按钮处于禁用状态
        expect(screen.getByRole('button', { name: 'Open selected' })).toBeDisabled();

        // 选择 test-2 并打开
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

        // 新建、模板和上传按钮均处于禁用状态
        expect(screen.getByRole('button', { name: 'Blank project' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Open template' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Import project (.json)' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Import station list (.txt)' })).toBeDisabled();
    });
});
