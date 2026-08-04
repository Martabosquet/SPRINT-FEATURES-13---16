const initialState = {
  user: {
    id: localStorage.getItem("userId") || null,
    name: localStorage.getItem("userName") || null,
    email: localStorage.getItem("userEmail") || null,
    role: localStorage.getItem("userRole") || null,
    profileImage: localStorage.getItem("userProfileImage") || null,
  },
  token: localStorage.getItem("token") || null,
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