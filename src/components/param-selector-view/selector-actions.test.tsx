// 测试：验证项目操作区所覆盖的项目选择与管理界面行为。
import { render } from '../../test-utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import * as utils from '../../util/utils';
import SelectorActions from './selector-actions';
import { vi } from 'vitest';
import { getParam, getParamRegistry } from '../../util/param-manager-utils';
import { RmgStyle } from '../../constants/constants';

const mockCallbacks = {
    onError: vi.fn(),
};

describe('SelectorActions', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
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
        const mockInvalidTypeFile = new File(['dummy-content'], 'invalid-file-type.pdf', {
            type: 'application/pdf',
        });

        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        fireEvent.change(screen.getByTestId('json-file-upload'), { target: { files: [mockInvalidTypeFile] } });

        expect(mockCallbacks.onError).toBeCalledTimes(1);
        expect(mockCallbacks.onError).lastCalledWith(expect.stringContaining('Invalid'));
    });

    it('Can convert and import a station list as a JSON project', async () => {
        const readFileAsTextSpy = vi.spyOn(utils, 'readFileAsText');
        readFileAsTextSpy.mockResolvedValue('甲站 1号线\n乙站 2号线\n丙站\n');
        const stationListFile = new File(['unused'], 'test-line.txt', { type: 'text/plain' });

        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        expect(screen.getByRole('button', { name: 'Import project (.json)' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Import station list (.txt)' }));

        expect(await screen.findByRole('textbox', { name: 'TXT parsing rules' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Target city style' })).toHaveValue(RmgStyle.GZMTR);

        await act(async () => {
            fireEvent.change(await screen.findByTestId('station-list-file-upload'), {
                target: { files: [stationListFile] },
            });
            await Promise.resolve();
        });

        expect(screen.getByText('test-line.txt')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() => {
            expect(getParamRegistry()).toHaveLength(1);
        });

        const projectConfig = getParamRegistry()[0];
        const { param } = getParam(projectConfig.id);
        const firstStationId = param.stn_list.linestart.children[0];

        expect(projectConfig.name).toBe('test-line');
        expect(param.style).toBe(RmgStyle.GZMTR);
        expect(param.loop).toBe(false);
        expect(param.stn_list[firstStationId]).toMatchObject({
            localisedName: { zh: '甲站', en: 'Jiazhan' },
            num: '01',
        });
        expect(param.stn_list[firstStationId].transfer.groups[0].lines[0]).toMatchObject({
            name: ['1号线', 'Line 1'],
            theme: expect.arrayContaining(['#AAAAAA']),
        });
    });

    it('Can select the target style and edit both route numbers', async () => {
        const readFileAsTextSpy = vi.spyOn(utils, 'readFileAsText');
        readFileAsTextSpy.mockResolvedValue('中環\n尖沙咀\n');

        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        fireEvent.click(screen.getByRole('button', { name: 'Import station list (.txt)' }));
        fireEvent.drop(await screen.findByTestId('station-list-dropzone'), {
            dataTransfer: { files: [new File(['unused'], 'hong-kong.txt', { type: 'text/plain' })] },
        });
        expect(screen.getByText('hong-kong.txt')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Target city style' }), {
            target: { value: RmgStyle.MTR },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Chinese route number' }), {
            target: { value: '荃灣綫' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'English route number' }), {
            target: { value: 'Tsuen Wan Line' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        await waitFor(() => {
            expect(getParamRegistry()).toHaveLength(1);
        });

        const { param } = getParam(getParamRegistry()[0].id);
        const firstStationId = param.stn_list.linestart.children[0];
        expect(param.style).toBe(RmgStyle.MTR);
        expect(param.line_name).toEqual(['荃灣綫', 'Tsuen Wan Line']);
        expect(param.stn_list[firstStationId].localisedName.en).toBe('Central');
    });

    it('Shows a parsing error inside the station list dialog', async () => {
        const readFileAsTextSpy = vi.spyOn(utils, 'readFileAsText');
        readFileAsTextSpy.mockResolvedValue('只有一站');

        await act(() => {
            render(<SelectorActions {...mockCallbacks} />);
        });

        fireEvent.click(screen.getByRole('button', { name: 'Import station list (.txt)' }));
        fireEvent.change(await screen.findByTestId('station-list-file-upload'), {
            target: { files: [new File(['unused'], 'invalid.txt', { type: 'text/plain' })] },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Invalid station list');
        expect(getParamRegistry()).toHaveLength(0);
    });
});
