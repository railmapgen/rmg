import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import AppReducer from './app/reducer';

const rootReducer = combineReducers({
    app: AppReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware<RootState>));
