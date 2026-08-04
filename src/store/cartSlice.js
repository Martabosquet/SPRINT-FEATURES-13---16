import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Establecer el carrito completo manteniendo el orden visual actual
    setLocalCart: (state, action) => {
      const incomingItems = action.payload.map((item) => ({
        ...item,
        stock: item.product?.stock ?? item.stock ?? 0,
      }));

      const incomingKeys = new Set(
        incomingItems.map((item) => item.id ?? item.productId)
      );

      const preservedItems = state.items
        .filter((item) => incomingKeys.has(item.id ?? item.productId))
        .map((item) => {
          const incomingItem = incomingItems.find(
            (payloadItem) =>
              (payloadItem.id ?? payloadItem.productId) === (item.id ?? item.productId)
          );

          return incomingItem
            ? {
                ...item,
                ...incomingItem,
                quantity: incomingItem.quantity ?? item.quantity,
                stock: incomingItem.stock ?? item.stock,
              }
            : item;
        });

      const newItems = incomingItems.filter((item) => {
        const key = item.id ?? item.productId;
        return !state.items.some((existingItem) => (existingItem.id ?? existingItem.productId) === key);
      });

      state.items = [...preservedItems, ...newItems];
    },

    // Añadir o incrementar un ítem en el carrito local
    addLocalCartItem: (state, action) => {
      const { id, productId, name, price, imageUrl, quantity, stock, product } = action.payload;
      const targetId = productId || id;
      
      // Obtenemos el stock real ya sea directo o desde la relación del producto
      const currentStock = stock ?? product?.stock ?? 10; 
      
      const existingItem = state.items.find(
        (item) => item.productId === targetId || item.id === targetId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        if (currentStock !== undefined) existingItem.stock = currentStock; // Actualizamos stock si viene
      } else {
        state.items.push({
          id: id || targetId,
          productId: targetId,
          name,
          price: Number(price || 0),
          imageUrl,
          quantity: quantity || 1,
          stock: currentStock // <--- Guardamos el stock real aquí
        });
      }
    },

    // Eliminar un ítem del estado local de Redux
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