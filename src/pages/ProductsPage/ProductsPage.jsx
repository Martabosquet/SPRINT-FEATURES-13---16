import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "../../api/products"
import ProductCard from "../../components/ProductCard/ProductCard"
import StatusMessage from "../../components/StatusMessage/StatusMessage"
import styles from "./ProductsPage.module.css"

function ProductsPage() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
          Ver producto, añadir al carrito, persistir en backend y actualizar el
          estado global.
        </p>
      </section>

      {/* Usamos el componente ProductCard para cada producto, asegurando que se pinte la bolita y el stock correctamente */}
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default ProductsPage