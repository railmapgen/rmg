// 测试环境初始化：注册 DOM 断言、重置状态并复用测试数据构造器。
import { BranchStyle, LocalStorageKey, RmgStyle, StationDict } from './constants/constants';
import { createStore } from './redux';
import { initParam } from './redux/param/util';
import { setupTest } from '@railmapgen/mantine-components/utils';

setupTest();

export const createTestStore = createStore;

/**
 * 反向之前：
 * stn0 - stn1 - stn2（主线）
 *             \
 *              stn3 - stn4（支线）
 *
 * 反向之后：
 *（支线）stn4 - stn3
 *                      \
 *          （主线）stn2 - stn1 - stn0
 */
export const mockSimpleStationList: StationDict = {
    linestart: {
        parents: [],
        children: ['stn0'],
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn1'],
        localisedName: { zh: '車站0', en: 'Station 0' },
    },
    stn1: {
        parents: ['stn0'],
        children: ['stn2', 'stn3'],
        branch: { right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['lineend'],
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
    },
    stn4: {
        parents: ['stn3'],
        children: ['lineend'],
    },
    lineend: {
        parents: ['stn2', 'stn4'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn4'] },
    },
} as any;

const originalFetch = global.fetch;
global.fetch = vi.fn().mockImplementation((...args: any[]) => {
    if (args[0].toString().includes('/info.json')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => import('../info.json').then(module => module.default),
        }) as any;
    } else if (args[0].toString().includes('other-company-config.json')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([]),
        }) as any;
    } else {
        console.warn('No mocked response for', args[0]);
        return originalFetch(args[0], args[1]);
    }
});

export const createParamInLocalStorage = (id: string) => {
    const rmgParam = initParam(RmgStyle.MTR, 'en');
    rmgParam.line_num = id;
    window.localStorage.setItem('rmg__' + LocalStorageKey.PARAM_BY_ID + id, JSON.stringify(rmgParam));
};

Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve([]), load: () => Promise.resolve([]) } });
