const initialState = {
  user: {
    id: "20",
    email: "martabosquetlauci@gmail.com",
    role: "admin",
  },
  token: localStorage.getItem("token") || "demo-token",
}

export default function authReducer(state = initialState) {
  return state
}