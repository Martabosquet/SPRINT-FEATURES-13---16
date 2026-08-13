import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {

    // Establecer el carrito completo del usuario actual.
    // Aplana los datos del producto (que llegan anidados en item.product
    // cuando vienen directamente del backend) a nivel superior del item,
    // para que toda la UI (CartPage, CartSummary, Header) pueda leer
    // item.name / item.price / item.imageUrl de forma consistente,
    // sin importar si el item ya venía "plano" o anidado.
    setLocalCart: (state, action) => {
      const incomingItems = (action.payload ?? []).map((item) => ({
        id: item.id ?? item.cartItemId ?? item.productId,
        productId: item.productId ?? item.product?.id ?? item.id,
        name: item.product?.name ?? item.name ?? 'Producto',
        price: Number(item.product?.price ?? item.price ?? 0),
        imageUrl: item.product?.imageUrl ?? item.imageUrl,
        quantity: item.quantity ?? 1,
        stock: item.product?.stock ?? item.stock ?? 0,
      }));

      state.items = incomingItems;
    },


    // Añadir o incrementar un ítem en el carrito local
    addLocalCartItem: (state, action) => {
      const {
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity,
        stock,
        product,
      } = action.payload;

      const targetId = productId || id;

      const currentStock = stock ?? product?.stock ?? 10;

      const existingItem = state.items.find(
        (item) =>
          item.productId === targetId ||
          item.id === targetId
      );

      if (existingItem) {
        existingItem.quantity += quantity;

        if (currentStock !== undefined) {
          existingItem.stock = currentStock;
        }

      } else {

        state.items.push({
          id: id || targetId,
          productId: targetId,
          name,
          price: Number(price || 0),
          imageUrl,
          quantity: quantity || 1,
          stock: currentStock,
        });

      }
    },


    removeLocalCartItem: (state, action) => {
      const targetCartItemId = action.payload;

      state.items = state.items.filter(
        (item) => item.id !== targetCartItemId
      );
    },


    clearCart: (state) => {
      state.items = [];
    },

  },
});

export const {
  setLocalCart,
  addLocalCartItem,
  removeLocalCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;