import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getOrderByPaymentIntent } from "../../api/orders"
import { clearCart } from "../../store/cartSlice"
import styles from "./CheckoutSuccessPage.module.css"

const MAX_ATTEMPTS = 6
const RETRY_DELAY_MS = 1500

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  const paymentIntentId = searchParams.get("payment_intent")
  const redirectStatus = searchParams.get("redirect_status")

  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState("loading") // loading | found | timeout | payment_failed

  useEffect(() => {
    // Si Stripe nos dice que el pago no se completó, no tiene sentido
    // ni siquiera buscar el pedido: nunca se va a crear.
    if (redirectStatus && redirectStatus !== "succeeded") {
      setStatus("payment_failed")
      return
    }

    if (!paymentIntentId) {
      setStatus("payment_failed")
      return
    }

    let attempts = 0
    let cancelled = false

    const pollForOrder = async () => {
      try {
        const response = await getOrderByPaymentIntent(paymentIntentId)
        if (cancelled) return

        if (response.ok && response.data) {
          setOrder(response.data)
          setStatus("found")
          // El pedido ya existe de verdad en el backend: ahora sí
          // vaciamos el carrito local para que el resto de la app
          // (Header, CartPage) refleje que ya no hay nada pendiente.
          dispatch(clearCart())
          return
        }
      } catch (err) {
        // Un 404 aquí es NORMAL mientras el webhook no ha llegado todavía,
        // no es un error real: simplemente reintentamos.
      }

      attempts += 1
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(pollForOrder, RETRY_DELAY_MS)
      } else if (!cancelled) {
        setStatus("timeout")
      }
    }

    pollForOrder()

    return () => {
      cancelled = true
    }
  }, [paymentIntentId, redirectStatus, dispatch])

  if (status === "payment_failed") {
    return (
      <main className={styles.page}>
        <p className={styles.label}>Pago no completado</p>
        <h2 className={styles.title}>Algo salió mal con tu pago</h2>
        <p className={styles.copy}>
          No se ha realizado ningún cargo. Puedes volver a intentarlo desde el carrito.
        </p>
        <Link className={styles.link} to="/cart">
          Volver al carrito
        </Link>
      </main>
    )
  }

  if (status === "loading") {
    return (
      <main className={styles.page}>
        <p className={styles.label}>Confirmando tu pago</p>
        <h2 className={styles.title}>Estamos verificando tu pedido...</h2>
        <p className={styles.copy}>Esto solo tardará unos segundos.</p>
      </main>
    )
  }

  if (status === "timeout") {
    return (
      <main className={styles.page}>
        <p className={styles.label}>Pago recibido</p>
        <h2 className={styles.title}>Tu pago se ha procesado</h2>
        <p className={styles.copy}>
          Estamos terminando de registrar tu pedido. Revisa tu historial de
          pedidos en unos minutos si no lo ves reflejado todavía.
        </p>
        <Link className={styles.link} to="/">
          Volver a productos
        </Link>
      </main>
    )
  }

  // status === "found"
  return (
    <main className={styles.page}>
      <p className={styles.label}>Checkout completado</p>
      <h2 className={styles.title}>Compra realizada correctamente</h2>
      <p className={styles.copy}>
        Pedido generado con id {order.id}
      </p>
      <Link className={styles.link} to="/">
        Volver a productos
      </Link>
    </main>
  )
}

export default CheckoutSuccessPage