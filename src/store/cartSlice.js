import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Establecer el carrito completo (ej: al cargar la página o hacer login)
    setLocalCart: (state, action) => {
      state.items = action.payload;
    },

    // Añadir o incrementar un ítem en el carrito local
    addLocalCartItem: (state, action) => {
      const { id, productId, name, price, imageUrl, quantity } = action.payload;
      const targetId = productId || id;
      
      const existingItem = state.items.find(
        (item) => item.productId === targetId || item.id === targetId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: targetId,
          name,
          price: Number(price || 0),
          imageUrl,
          quantity: quantity || 1
        });
      }
    },

    // --- NUEVO: Eliminar un ítem del estado local de Redux ---
    removeLocalCartItem: (state, action) => {
      const targetCartItemId = action.payload;
      state.items = state.items.filter((item) => item.id !== targetCartItemId);
    },

    // Vaciar el carrito por completo (ej: tras hacer checkout o logout)
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setLocalCart, addLocalCartItem, removeLocalCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;