import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UndoState {
    pastCount: number;
    futureCount: number;
}

const initialState: UndoState = {
    pastCount: 0,
    futureCount: 0,
};

const undoSlice = createSlice({
    name: 'undo',
    initialState,
    reducers: {
        updateUndoCounts: (state, action: PayloadAction<{ past: number; future: number }>) => {
            state.pastCount = action.payload.past;
            state.futureCount = action.payload.future;
        },
    },
});

export const { updateUndoCounts } = undoSlice.actions;
export default undoSlice.reducer;
