import { getParamMap, getParamRegistry, loadParamRegistry, upgradeLegacyParam } from './param-manager-utils';
import { LocalStorageKey } from '../constants/constants';
import { createParamInLocalStorage } from '../setupTests';

describe('ParamMgrUtils', () => {
    describe('ParamMgrUtils - loadParamRegistry', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        it('Can reset param registry if not found in localStorage', () => {
            const result = loadParamRegistry();
            expect(result).toHaveLength(0);
        });

        it('Can reset param registry if registry in localStorage is malformat', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM_REGISTRY, JSON.stringify({ x: 1 }));
            const result = loadParamRegistry();
            expect(result).toHaveLength(0);
        });

        it('Can load param registry from localStorage as expected', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM_REGISTRY, JSON.stringify([{ id: 'test-id' }]));
            const result = loadParamRegistry();
            expect(result).toHaveLength(1);
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-id' }));
        });
    });

    describe('ParamMgrUtils - upgradeLegacyParam', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        it('Can migrate legacy param from localStorage as expected', () => {
            // stored in rmgParam key
            createParamInLocalStorage('test-01');

            upgradeLegacyParam();

            // assign new id and store in new key
            const paramMap = getParamMap();
            const paramIds = Object.keys(paramMap);
            expect(paramIds).toHaveLength(1);
            const currentParamId = paramIds[0];
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-01');

            // remove rmgParam and rmgParamRedux keys
            expect(window.localStorage.getItem(LocalStorageKey.PARAM)).toBeNull();
        });

        it('Can migrate legacy param from old localStorage key as expected', () => {
            // stored in rmgParam key
            createParamInLocalStorage('test-02');

            upgradeLegacyParam();

            // assign new id and store in new key
            const paramMap = getParamMap();
            const paramIds = Object.keys(paramMap);
            expect(paramIds).toHaveLength(1);
            const currentParamId = paramIds[0];
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-02');

            // remove rmgParam and rmgParamRedux keys
            expect(window.localStorage.getItem('rmgParam')).toBeNull();
            expect(window.localStorage.getItem('rmgParamRedux')).toBeNull();
        });
    });

    describe('ParamMgrUtils - getParamRegistry', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        it('Can sync loaded param registry with actual param stored in localStorage as expected', () => {
            // 01: keep, 02: remove, 03: add

            createParamInLocalStorage('test-01');
            createParamInLocalStorage('test-03');
            window.localStorage.setItem(
                LocalStorageKey.PARAM_REGISTRY,
                JSON.stringify([{ id: 'test-01' }, { id: 'test-02' }])
            );

            const result = getParamRegistry();
            expect(result).toHaveLength(2);
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-01' }));
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-03' }));
        });
    });
});
