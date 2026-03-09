import { AnyAction, Reducer, UnknownAction } from '@reduxjs/toolkit';

// Actions
export const UNDO = 'UNDO';
export const REDO = 'REDO';

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

export interface UndoableState<T> {
    past: T[];
    present: T;
    future: T[];
}

export const undoable = <T>(reducer: Reducer<T, AnyAction | UnknownAction>) => {
    return function (state: UndoableState<T> | undefined, action: AnyAction | UnknownAction): UndoableState<T> {
        if (!state) {
            // Initialize
            const initialState = reducer(undefined, action);
            return {
                past: [],
                present: initialState,
                future: [],
            };
        }

        const { past, present, future } = state;

        switch (action.type) {
            case UNDO: {
                if (past.length === 0) return state;
                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                return {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                };
            }
            case REDO: {
                if (future.length === 0) return state;
                const next = future[0];
                const newFuture = future.slice(1);
                return {
                    past: [...past, present],
                    present: next,
                    future: newFuture,
                };
            }
            default: {
                // Delegate to the wrapped reducer
                const newPresent = reducer(present, action);

                if (present === newPresent) {
                    return state; // No change
                }

                // If the action is an initialization or internal redux action, don't update history
                // But typically we only want to track user actions.
                // For now, let's just track everything that changes state.

                // Limit history size
                const MAX_HISTORY = 50;
                let nextPast = [...past, present];
                if (nextPast.length > MAX_HISTORY) {
                    nextPast = nextPast.slice(nextPast.length - MAX_HISTORY);
                }

                return {
                    past: nextPast,
                    present: newPresent,
                    future: [], // Clear future on new action
                };
            }
        }
    };
};
