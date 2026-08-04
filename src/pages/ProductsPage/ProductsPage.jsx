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

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("default") // Nuevo estado de ordenación

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

  // 1. Filtrar por texto de búsqueda
  const filteredProducts = products.filter((product) => {
    const productName = product.name || ""
    return productName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // 2. Ordenar los productos filtrados
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-asc") {
      return Number(a.price) - Number(b.price)
    }
    if (sortOrder === "price-desc") {
      return Number(b.price) - Number(a.price)
    }
    if (sortOrder === "name-asc") {
      return (a.name || "").localeCompare(b.name || "")
    }
    if (sortOrder === "name-desc") {
      return (b.name || "").localeCompare(a.name || "")
    }
    return 0; // 'default'
  })

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
    <main className={styles.container}>
      <section className={styles.hero} style={{ marginBottom: "2rem" }}>
        <p className={styles.eyebrow}>Live 1</p>
        <h2 className={styles.title} style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Catálogo de Productos
        </h2>
        <p className={styles.copy} style={{ color: "#666" }}>
          Explora nuestro catálogo, busca tu producto favorito y gestiona el stock en tiempo real.
        </p>
      </section>

      {/* Barra de controles con clases limpias de CSS modules */}
      <div className={styles.filtersBar}>
        <input
          type="text"
          placeholder="Buscar por nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
          style={{ marginBottom: 0, flex: "1 1 300px" }}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={styles.select}
        >
          <option value="default">Ordenar por...</option>
          <option value="price-asc">Precio: de menor a mayor</option>
          <option value="price-desc">Precio: de mayor a menor</option>
          <option value="name-asc">Alfabético: A - Z</option>
          <option value="name-desc">Alfabético: Z - A</option>
        </select>
      </div>

      {/* Listado de productos */}
      {sortedProducts.length === 0 ? (
        <div className={styles.noResults}>
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}

export default ProductsPage