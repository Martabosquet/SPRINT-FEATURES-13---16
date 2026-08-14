import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../../api/products"
import ProductCard from "../../components/ProductCard/ProductCard"
import StatusMessage from "../../components/StatusMessage/StatusMessage"
import { authStorage } from "../../utils/authStorage"
import styles from "./ProductsPage.module.css"

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const isAdmin = authStorage.admin === 'true';

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("default")

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

  // Quita el producto borrado del estado local, para que la tarjeta
  // desaparezca al instante sin necesidad de recargar la página.
  const handleProductDeleted = (deletedId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => (product.id || product._id) !== deletedId
      )
    );
  };

  const filteredProducts = products.filter((product) => {
    const productName = product.name || ""
    return productName.toLowerCase().includes(searchTerm.toLowerCase())
  })

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
    return 0;
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
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Catálogo</p>

        <h1 className={styles.title}>
          Descubre tu próxima película favorita
        </h1>

        <p className={styles.description}>
          Explora nuestro catálogo, encuentra clásicos, novedades y añade tus
          películas favoritas al carrito.
        </p>
      </section>

      <div className={styles.filtersBar}>
        <input
          type="text"
          placeholder="Buscar por nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
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

      {isAdmin && (
        <div className={styles.adminActions}>
          <Link
            to="/admin/products/new"
            className={styles.addButton}
          >
            + Nuevo producto
          </Link>
        </div>
      )}

      {sortedProducts.length === 0 ? (
        <div className={styles.noResults}>
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onProductDeleted={handleProductDeleted}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default ProductsPage