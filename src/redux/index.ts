import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import AppReducer from './app/reducer';
import ParamReducer from './param/reducer';

const rootReducer = combineReducers({
    app: AppReducer,
    param: ParamReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware<RootState>));
