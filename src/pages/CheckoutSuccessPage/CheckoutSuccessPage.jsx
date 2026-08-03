import { Link, useLocation } from "react-router-dom"
import styles from "./CheckoutSuccessPage.module.css"

function CheckoutSuccessPage() {
  const location = useLocation()
  const order = location.state?.order
  
  // Soportamos tanto id como _id de MongoDB
  const orderId = order?.id || order?._id;

  return (
    <main className={styles.page}>
      <p className={styles.label}>Checkout completado</p>
      <h2 className={styles.title}>Compra realizada correctamente</h2>
      <p className={styles.copy}>
        {orderId
          ? `Pedido generado con id ${orderId}`
          : "El pedido se ha registrado correctamente"}
      </p>
      <Link className={styles.link} to="/">
        Volver a productos
      </Link>
    </main>
  )
}

export default CheckoutSuccessPage