import appReducer from './app/app-slice';
import paramReducer from './param/param-slice';
import helperReducer from './helper/helper-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore, createListenerMiddleware, TypedStartListening } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    app: appReducer,
    param: paramReducer,
    helper: helperReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const listenerMiddleware = createListenerMiddleware();
export const createStore = (preloadedState: Partial<RootState> = {}) =>
    configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
        preloadedState,
    });
const store = createStore();
export type RootStore = typeof store;

export type RootDispatch = typeof store.dispatch;
export const useRootDispatch = () => useDispatch<RootDispatch>();
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;

type RootStartListening = TypedStartListening<RootState, RootDispatch>;
export const startRootListening = listenerMiddleware.startListening as RootStartListening;

(window as any).rmgStore = store;
export default store;
