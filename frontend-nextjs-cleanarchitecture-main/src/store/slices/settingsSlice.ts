import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'id';
export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  language: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
}

const initialState: SettingsState = {
  language: 'en',
  theme: 'system',
  sidebarCollapsed: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setLanguage, setTheme, toggleSidebarCollapse, setSidebarCollapsed } =
  settingsSlice.actions;

export default settingsSlice.reducer;
