import { Middleware } from 'redux';
import { RootState } from '../index';
import { setFullParam } from '../param/action'; // Use the thunk from action.ts
import { updateUndoCounts } from './undo-slice';

export const UNDO = 'UNDO';
export const REDO = 'REDO';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const clearHistory = () => ({ type: CLEAR_HISTORY });

// We need to keep history outside of the redux store to avoid circular dependency
// or putting large objects in the store repeatedly if we used a slice.
// Ideally, this should be in a closure or a class. Given middleware is a function, we can use closure.

export const createUndoMiddleware = (): Middleware<object, RootState> => {
    const past: any[] = [];
    let future: any[] = [];

    // We need to track if the current action is caused by undo/redo to avoid loop
    let isUndoing = false;

    return store => next => (action: any) => {
        if (typeof action === 'function') {
            return next(action);
        }
        
        // Helper to update store counts
        const updateCounts = () => {
            store.dispatch(updateUndoCounts({ past: past.length, future: future.length }));
        };

        if (action.type === UNDO) {
            const state = store.getState();
            if (past.length > 0) {
                const previous = past.pop();
                future.push(state.param);
                isUndoing = true;
                // Dispatch the THUNK which updates helper as well
                store.dispatch(setFullParam(previous) as any);
                isUndoing = false;
                updateCounts();
            }
            return;
        }

        if (action.type === REDO) {
            const state = store.getState();
            if (future.length > 0) {
                const nextState = future.pop();
                past.push(state.param);
                isUndoing = true;
                store.dispatch(setFullParam(nextState) as any);
                isUndoing = false;
                updateCounts();
            }
            return;
        }

        if (action.type === CLEAR_HISTORY) {
            past.length = 0;
            future.length = 0;
            updateCounts();
            return;
        }

        if (action.type && action.type.startsWith('param/') && !isUndoing) {
            const state = store.getState();
            // Store param state before modification
            past.push(state.param);

            // Limit history
            if (past.length > 20) {
                past.shift();
            }

            // Clear future on new action
            future = [];
            
            // Allow the action to proceed first, then update counts?
            // Actually, we capture state BEFORE action.
            // But we can update counts now.
            // past.length has increased by 1.
            updateCounts();
        }
        
        return next(action);
    };
};
