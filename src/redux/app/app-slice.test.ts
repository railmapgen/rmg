import rootReducer from '../index';
import appReducer, { closeGlobalAlert, setGlobalAlert, updateParamModifiedTime } from './app-slice';
import { createMockAppStore } from '../../setupTests';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const windowSpy = jest.spyOn(window, 'window', 'get');
const mockSetItem = jest.fn();

describe('AppSlice', () => {
    beforeEach(() => {
        windowSpy.mockImplementation(
            () =>
                ({
                    localStorage: {
                        setItem: mockSetItem,
                    },
                } as any)
        );
    });

    afterEach(() => {
        mockStore.clearActions();
        jest.clearAllMocks();
    });

    describe('AppSlice - global alerts', () => {
        const initialState = {
            ...realStore.app,
            globalAlerts: {
                info: {
                    message: 'Test info message',
                    url: 'https://example.com',
                },
            },
        };

        it('Can add new type of alert', () => {
            const nextState = appReducer(
                initialState,
                setGlobalAlert({ status: 'warning', message: 'Test warning message' })
            );
            expect(nextState.globalAlerts).toEqual({ info: expect.any(Object), warning: expect.any(Object) });
        });

        it('Can override existing type of alert', () => {
            const nextState = appReducer(
                initialState,
                setGlobalAlert({ status: 'info', message: 'Test updated info message' })
            );
            expect(nextState.globalAlerts).toEqual({ info: { message: 'Test updated info message' } });
        });

        it('Can close alert as expected', () => {
            const nextState = appReducer(initialState, closeGlobalAlert('info'));
            expect(nextState.globalAlerts).not.toHaveProperty('info');
        });
    });

    describe('AppSlice - param registry', () => {
        it('Can update last modified time for existing param as expected', () => {
            const initialState = {
                ...realStore.app,
                paramRegistry: [{ id: 'test-id' }],
            };
            const nextState = appReducer(initialState, updateParamModifiedTime('test-id'));

            expect(nextState.paramRegistry).toContainEqual({ id: 'test-id', lastModified: expect.any(Number) });
        });

        it('Can update last modified time for non-existing param as expected', () => {
            const initialState = {
                ...realStore.app,
                paramRegistry: [],
            };
            const nextState = appReducer(initialState, updateParamModifiedTime('test-id'));

            expect(nextState.paramRegistry).toContainEqual({ id: 'test-id', lastModified: expect.any(Number) });
        });
    });
});
