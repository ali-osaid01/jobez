import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ModalState, ThemeMode, UiState } from '../types';

// ─── Initial State ────────────────────────────────────────────

const initialState: UiState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  theme: 'system',
};

// ─── Slice ────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },

    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },

    openModal(state, action: PayloadAction<ModalState>) {
      state.activeModal = action.payload;
    },

    closeModal(state) {
      state.activeModal = null;
    },

    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  openModal,
  closeModal,
  setTheme,
} = uiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────

export const selectSidebarOpen = (state: { ui: UiState }) =>
  state.ui.sidebarOpen;

export const selectSidebarCollapsed = (state: { ui: UiState }) =>
  state.ui.sidebarCollapsed;

export const selectActiveModal = (state: { ui: UiState }) =>
  state.ui.activeModal;

export const selectTheme = (state: { ui: UiState }) => state.ui.theme;

// ─── Reducer ──────────────────────────────────────────────────

export default uiSlice.reducer;
