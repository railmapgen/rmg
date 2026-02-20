
import { describe, expect, it } from 'vitest';
import { createUndoMiddleware, undo, clearHistory } from './undo-middleware';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { updateUndoCounts } from './undo-slice';

// Mock param slice
const paramSlice = createSlice({
    name: 'param',
    initialState: { value: 0 },
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        },
        setFullParam: (state, action) => {
            state.value = action.payload.value;
        },
    },
});

describe('undo middleware', () => {
    // Cast middleware to any to bypass strict RootState check for testing
    const undoMiddleware = createUndoMiddleware() as any;

    const createTestStore = () => {
        return configureStore({
            reducer: {
                param: paramSlice.reducer,
                undo: (state = { pastCount: 0, futureCount: 0 }, action: any) => {
                    if (action.type === updateUndoCounts.type) {
                        return { pastCount: action.payload.past, futureCount: action.payload.future };
                    }
                    return state;
                },
            },
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(undoMiddleware),
        });
    };

    it('should clear history on clearHistory action', () => {
        const store = createTestStore();
        const getUndoState = () => (store.getState() as any).undo;
        const getParamState = () => (store.getState() as any).param;

        // 1. Initial State
        expect(getParamState().value).toBe(0);
        expect(getUndoState().pastCount).toBe(0);

        // 2. Perform actions (starts with param/)
        store.dispatch(paramSlice.actions.update(1)); // param/update
        store.dispatch(paramSlice.actions.update(2)); // param/update
        
        expect(getParamState().value).toBe(2);
        expect(getUndoState().pastCount).toBe(2);

        // 3. Undo once
        store.dispatch(undo());
        expect(getParamState().value).toBe(1);
        expect(getUndoState().pastCount).toBe(1);

        // 4. Clear History
        store.dispatch(clearHistory());
        expect(getUndoState().pastCount).toBe(0);
        expect(getUndoState().futureCount).toBe(0);
        
        // 5. Undo should do nothing (past is empty)
        store.dispatch(undo());
        expect(getParamState().value).toBe(1); // Still 1
    });

    it('should handle setFullParam followed by clearHistory correctly', () => {
        const store = createTestStore();
        const getUndoState = () => (store.getState() as any).undo;
        const getParamState = () => (store.getState() as any).param;
        
        // 1. We have some state
        store.dispatch(paramSlice.actions.update(1)); 
        expect(getUndoState().pastCount).toBe(1);

        // 2. Load new project (param/setFullParam)
        // param/setFullParam matches middleware filter
        store.dispatch(paramSlice.actions.setFullParam({ value: 99 }));
        
        // Middleware should capture old state (1)
        expect(getUndoState().pastCount).toBe(2);
        expect(getParamState().value).toBe(99);

        // 3. Clear History immediately
        store.dispatch(clearHistory());
        
        expect(getUndoState().pastCount).toBe(0);
        expect(getUndoState().futureCount).toBe(0);
        expect(getParamState().value).toBe(99);
    });
});
