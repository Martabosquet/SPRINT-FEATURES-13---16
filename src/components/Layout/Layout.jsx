import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"
import { getCart } from "../../api/cart"
import { getWishlist } from "../../api/wishlist"
import { setLocalCart } from "../../store/cartSlice"
import { setLocalWishlist } from "../../store/wishlistSlice"
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

function Layout() {
  const dispatch = useDispatch()
  useEffect(() => {
    async function loadCartAndWishlist() {
      try {
        // Pedimos el carrito guardado en la base de datos y lo aplicamos al estado global de Redux.
        const savedCart = await getCart()
        if (Array.isArray(savedCart)) {
          dispatch(setLocalCart(savedCart))
        }
      } catch (cartError) {
        console.log("No se pudo cargar el carrito desde el back", cartError)
      }

      try {
        // Pedimos la wishlist guardada en la base de datos y la sincronizamos con el estado global.
        const savedWishlist = await getWishlist()
        if (Array.isArray(savedWishlist)) {
          dispatch(setLocalWishlist(savedWishlist))
        }
      } catch (wishlistError) {
        console.log(
          "No se pudo cargar la lista de deseos desde el back",
          wishlistError,
        )
      }
    }
    loadCartAndWishlist()
  }, [dispatch])

 return (
    <div className={styles['layout-container']}>
      <Header />
      <main className={styles['main-content']}>
        <Outlet />   {/* Funciona como un marcador de posición (placeholder) que renderizará el componente hijo (homepage, productspage, ...) */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout