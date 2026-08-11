import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useNavigate } from "react-router-dom"
import styles from "./CheckoutPage.module.css"

export default function PaymentForm({ total }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError("")

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
      // Solo redirige si el banco lo exige (3D Secure, etc.).
      // Si no hace falta, seguimos en esta misma página con el resultado.
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || "No se pudo procesar el pago.")
      setLoading(false)
      return
    }

    // Si llegamos aquí, no hubo redirección: el pago se resolvió al instante.
    // Navegamos nosotros mismos, replicando los mismos query params que
    // Stripe habría añadido si hubiera redirigido él, para que
    // CheckoutSuccessPage no tenga que distinguir entre los dos caminos.
    if (paymentIntent) {
      navigate(
        `/checkout-success?payment_intent=${paymentIntent.id}&redirect_status=${paymentIntent.status}`
      )
    }
  }

  return (
    <section className={styles.card}>
      <h2>Pago</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <PaymentElement />

        {error && <p className={styles.error}>{error}</p>}

        <button
          disabled={!stripe || loading}
          className={styles.button}
        >
          {loading ? "Procesando..." : `Pagar ${total.toFixed(2)} €`}
        </button>
      </form>
    </section>
  )
}