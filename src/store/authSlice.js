import { createSlice } from '@reduxjs/toolkit';
import { authStorage } from '../utils/authStorage';

const initialState = {
  user: {
    id: authStorage.userId || null,
    name: authStorage.userName || null,
    email: authStorage.userEmail || null,
    role: authStorage.userRole || null,
    profileImage: authStorage.userProfileImage || null,
  },
  token: authStorage.token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Se dispara justo tras un login correcto
    loginSuccess: (state, action) => {
      state.token = action.payload.token ?? state.token;
      state.user = {
        ...state.user,
        ...action.payload.user,
      };
    },
    // Para cambios parciales del usuario (ej: nueva foto de perfil, nombre editado)
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    // Limpia el estado de auth en Redux (además de authStorage/localStorage)
    logout: (state) => {
      state.token = null;
      state.user = { id: null, name: null, email: null, role: null, profileImage: null };
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;