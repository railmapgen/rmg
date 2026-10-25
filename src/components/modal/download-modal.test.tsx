// 测试：验证图像下载对话框所覆盖的编辑对话框行为。
import { render } from '../../test-utils';
import DownloadModal from './download-modal';
import rootReducer from '../../redux';
import { createTestStore } from '../../setupTests';
import { CanvasType } from '../../constants/constants';
import { act, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { setCanvasToShow } from '../../redux/app/app-slice';

const realStore = rootReducer.getState();

const mockCallbacks = {
    onClose: vi.fn(),
};

describe('DownloadModal', () => {
    it('Can filter canvas on screen for selecting only', () => {
        const mockStore = createTestStore({
            app: {
                ...realStore.app,
                canvasToShow: [CanvasType.RailMap],
            },
        });
        render(<DownloadModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        expect(screen.getByRole('option', { name: 'Rail map' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Destination' })).not.toBeInTheDocument();
    });

    it('Can reset canvas to download selection if on-screen canvas is changed', async () => {
        // 步骤 1：在全部画布可见时渲染下载对话框
        const mockStore = createTestStore();
        render(<DownloadModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        // 步骤 2：选择目的地画布进行下载
        fireEvent.change(screen.getByRole('combobox', { name: 'Canvas' }), { target: { value: 'destination' } });
        expect(screen.getByDisplayValue('Destination')).toBeInTheDocument();

        // 步骤 3：仅在线路图可见时重新渲染
        await act(async () => {
            mockStore.dispatch(setCanvasToShow([CanvasType.RailMap]));
        });

        // 断言：下载选择已重置
        expect(screen.queryByDisplayValue('Destination')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Please select...')).toBeInTheDocument();
    });
});
