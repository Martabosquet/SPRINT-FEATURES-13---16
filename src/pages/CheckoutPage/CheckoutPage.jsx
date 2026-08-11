import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"

import { createPaymentIntent } from "../../api/payments"
import { stripePromise } from "../../utils/stripe"

import Button from "../../components/Button/Button"

import CheckoutForm from "./CheckoutForm"
import PaymentForm from "./PaymentForm"
import OrderSummary from "./OrderSummary"

import styles from "./CheckoutPage.module.css"


export default function CheckoutPage() {

  const navigate = useNavigate()

  const cartItems = useSelector(
    (state) => state.cart.items
  )

  const user = useSelector(
    (state) => state.auth.user
  )


  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Cuando esto tiene valor, cambiamos de "fase dirección" a "fase pago"
  const [clientSecret, setClientSecret] = useState(null)


  const stockIssues = cartItems.filter(
    item =>
      Number(item.quantity) > Number(item.stock)
  )

  const hasStockIssue = stockIssues.length > 0

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
      Number(item.quantity),
    0
  )


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  // Ya no crea el pedido: valida la dirección y crea el PaymentIntent,
  // que es lo que nos permite mostrar el formulario de tarjeta después.
  const handleContinueToPayment = async (e) => {

    e.preventDefault()
    setError("")

    if (
      !formData.street ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      setError("Completa todos los datos de entrega.")
      return
    }

    setLoading(true)

    try {
      const response = await createPaymentIntent(formData)
      setClientSecret(response.data.clientSecret)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "No se pudo iniciar el proceso de pago."
      )
    } finally {
      setLoading(false)
    }
  }


  if (cartItems.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Tu carrito está vacío</h2>
        <p>Añade productos antes de finalizar el pedido.</p>
        <Button onClick={() => navigate("/products")}>
          Ver productos
        </Button>
      </div>
    )
  }


  return (

    <main className={styles.page}>

      <h1 className={styles.title}>
        Finaliza tu pedido
      </h1>

      <div className={styles.trust}>
        🚚 Entrega gratuita en Bakio
        <span>•</span>
        🔒 Compra segura
        <span>•</span>
        ⚽ Merchandising oficial
      </div>

      <div className={styles.layout}>

        {!clientSecret ? (
          <CheckoutForm
            user={user}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleContinueToPayment}
            loading={loading}
            error={error}
            disabled={hasStockIssue}
            stockIssues={stockIssues}
          />
        ) : (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, locale: "es" }}
          >
            <PaymentForm total={totalPrice} />
          </Elements>
        )}

        <OrderSummary
          items={cartItems}
          total={totalPrice}
        />

      </div>

    </main>

  )
}