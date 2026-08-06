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

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: { id: null, name: null, email: null, role: null, profileImage: null },
      };
    default:
      return state;
  }
}