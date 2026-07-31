import { createSlice } from "@reduxjs/toolkit"

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    ids: [], // array de productIds: ['uuid-1', 'uuid-3']
  },
  reducers: {
    // Añadir o quitar de favoritos
    toggleLocalWishlist: (state, action) => {
      const productId = action.payload

      const index = state.ids.indexOf(productId) // nos devuelve la posición del id en el array
      // Si el id existe, devuelve un número que es su índice >= 0
      // Si el id no existe va a devolver -1
      if (index !== -1) {
        // Si el id ya pertenecía a la lista,
        // lo elimina usando splice(index, 1)
        // (borra 1 elemento a partir de esa posición).
        state.ids.splice(index, 1) // eliminamos de la wishlist
      } else {
        state.ids.push(productId) // añadimos producto al final del array
      }
    },
    // Pintar la wishlist
    setLocalWishlist: (state, action) => {
      state.ids = action.payload // ['uuid-1', 'uuid-3']
    },
    // Vaciar la lista (logout)
    clearLocalWishlist: (state) => {
      state.ids = []
    },
  },
})

export const { toggleLocalWishlist, setLocalWishlist, clearLocalWishlist } =
  wishlistSlice.actions

export default wishlistSlice.reducer

// indexOf devuelve -1 si el elemento no está.
// splice(index, 1) elimina 1 elemento en esa posición.

// Alternativa más funcional (sin mutar):
//   if (state.ids.includes(productId))
//     state.ids = state.ids.filter(id => id !== productId)
//   else
//     state.ids.push(productId)