import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isSidebarOpen: boolean;
    isCustomModelDialogOpen: boolean;
}

const initialState: UiState = {
    isSidebarOpen: true,
    isCustomModelDialogOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
        openCustomModelDialog: (state) => {
            state.isCustomModelDialogOpen = true;
        },
        closeCustomModelDialog: (state) => {
            state.isCustomModelDialogOpen = false;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    openCustomModelDialog,
    closeCustomModelDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
