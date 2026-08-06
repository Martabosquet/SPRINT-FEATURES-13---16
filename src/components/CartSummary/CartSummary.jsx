import { useMemo } from "react"
import styles from "./CartSummary.module.css"

function CartSummary({ items, onCheckout, loading }) {
  const totalItems = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity ?? 0) * Number(item.price ?? 0),
        0,
      ),
    [items],
  )

  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 4.95
  const total = subtotal + shipping

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)

  return (
    <aside className={styles.box}>
      <h2 className={styles.title}>Resumen del pedido</h2>

      <div className={styles.row}>
  <span>Productos</span>
  <span>{totalItems}</span>
</div>

<div className={styles.row}>
  <span>Entrega</span>
  <span className={styles.free}>Gratis</span>
</div>

<hr className={styles.separator} />

<div className={styles.totalRow}>
  <span>Total</span>
  <span>{formatPrice(subtotal)}</span>
</div>

<p className={styles.note}>
  🚚 Entrega gratuita en Bakio. Te lo llevamos personalmente.
</p>

<button
  className={styles.button}
  type="button"
  onClick={onCheckout}
  disabled={loading || totalItems === 0}
>
  {loading ? "Procesando..." : "Finalizar compra"}
</button>
    </aside>
  )
}

export default CartSummary