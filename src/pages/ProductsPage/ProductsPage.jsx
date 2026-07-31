import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addCartItem, getCart } from "../../api/cart"
import { getProducts } from "../../api/products"
import { getWishlist, toggleWishlist } from "../../api/wishlist"
import ProductCard from "../../components/ProductCard/ProductCard"
import StatusMessage from "../../components/StatusMessage/StatusMessage"
import { addLocalCartItem, setLocalCart } from "../../store/cartSlice"
import {
  setLocalWishlist,
  toggleLocalWishlist,
} from "../../store/wishlistSlice"
import styles from "./ProductsPage.module.css"

function ProductsPage() {
  const dispatch = useDispatch()
  const wishlistIds = useSelector((state) => state.wishlist.ids)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addingToCart, setAddingToCart] = useState(null) // productId que se está añadiendo

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (fetchError) {
        setError("No se pudieron cargar los productos.")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  async function handleAddToCart(productId) {
    if (addingToCart === productId) return // doble click por error
    try {
      setAddingToCart(productId)

      const savedCart = await addCartItem(productId, 1)
      if (Array.isArray(savedCart)) {
        dispatch(setLocalCart(savedCart))
      } else {
        dispatch(addLocalCartItem({ productId, quantity: 1 }))
      }
    } catch (handleCartError) {
      console.log("Error al añadir al carrito", handleCartError.message)
    } finally {
      setAddingToCart(null) // liberando el bloqueo del botón, volvemos a habilitarlo para que añada más cantidad
    }
  }

  // El flujo completo de handleAddToCart
  // 1. Usuario pulsa 'Añadir al carrito' en 'product-1'
  // 2. setAddingToCart('product-1') → desactiva el botón
  // 3. POST /api/cart/items { productId, quantity: 1 } → backend guarda
  // 4. dispatch(addLocalCartItem) → Redux actualiza state.cart.items
  // 5. Header re-renderiza → Cart: 1
  // 6. setAddingToCart(null) → botón vuelve a estar activo

  async function handleToggleWishlist(productId) {
    dispatch(toggleLocalWishlist(productId))
    try {
      const syncedWishlist = await toggleWishlist(productId)

      if (Array.isArray(syncedWishlist)) {
        dispatch(setLocalWishlist(syncedWishlist))
      }
    } catch (toggleError) {
      console.log("No se pudo sincronizar la wishlist con el back", toggleError)
    }
  }

  if (loading) {
    return (
      <StatusMessage
        title="Cargando productos"
        description="Consultando catálogo..."
      />
    )
  }

  if (error) {
    return <StatusMessage title="Error" description={error} variant="error" />
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Live 1</p>
        <h2 className={styles.title}>Flujo real del cliente</h2>
        <p className={styles.copy}>
          Ver producto, anadir al carrito, persistir en backend y actualizar el
          estado global.
        </p>
      </section>

      <section className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(product.id)}
            isAddingToCart={addingToCart === product.id} // evaluando si son iguales (devuelve true o false)
          />
        ))}
      </section>
    </main>
  )
}

export default ProductsPage