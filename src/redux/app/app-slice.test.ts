import rootReducer from '../index';
import appReducer, { closeGlobalAlert, setGlobalAlert } from './app-slice';

const realStore = rootReducer.getState();

describe('AppSlice', () => {
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
});
