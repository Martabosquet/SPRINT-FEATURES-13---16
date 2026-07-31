import { useMemo } from "react"
import styles from "./CartSummary.module.css"

function CartSummary({ items, onCheckout, loading }) {
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
    [items],
  )
  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.quantity ?? 0) * Number(item.price ?? 0),
        0,
      ),
    [items],
  )

  return (
    <aside className={styles.box}>
      <p className={styles.label}>Resumen</p>
      <p className={styles.line}>Items: {totalItems}</p>
      <p className={styles.line}>Total: {totalPrice.toFixed(2)} EUR</p>
      <button
        className={styles.button}
        type="button"
        onClick={onCheckout}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Checkout"}
      </button>
    </aside>
  )
}

export default CartSummary