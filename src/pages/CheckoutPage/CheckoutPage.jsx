import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { checkoutOrder } from "../../api/orders"
import { clearCart } from "../../store/cartSlice"

import Button from "../../components/Button/Button"

import CheckoutForm from "./CheckoutForm"
import OrderSummary from "./OrderSummary"

import styles from "./CheckoutPage.module.css"


export default function CheckoutPage() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cartItems = useSelector(
    (state) => state.cart.items
  )

  const user = useSelector(
    (state) => state.auth.user
  )


  const [formData, setFormData] = useState({
    street: "",
    city: "Bakio",
    postalCode: "",
    country: "España",
  })


  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const stockIssues = cartItems.filter(
    item =>
      Number(item.quantity) > Number(item.stock)
  )


  const hasStockIssue = stockIssues.length > 0


  const totalPrice = cartItems.reduce(
    (sum,item)=>
      sum +
      Number(item.price) *
      Number(item.quantity),
    0
  )


  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }


  const handleSubmit = async(e)=>{

    e.preventDefault()

    setError("")


    if(
      !formData.street ||
      !formData.postalCode
    ){
      setError(
        "Completa los datos de entrega."
      )
      return
    }


    setLoading(true)


    try{

      const response = await checkoutOrder({
        shippingAddress: formData
      })


      if(response.ok){

        dispatch(clearCart())

        navigate(
          "/checkout-success",
          {
            state:{
              order: response.data
            }
          }
        )
      }


    }catch(err){

      setError(
        err.response?.data?.error ||
        "No se pudo crear el pedido."
      )


    }finally{

      setLoading(false)

    }

  }



  if(cartItems.length===0){

    return(
      <div className={styles.empty}>
        <h2>Tu carrito está vacío</h2>

        <p>
          Añade productos antes de finalizar el pedido.
        </p>

        <Button
          onClick={()=>navigate("/products")}
        >
          Ver productos
        </Button>

      </div>
    )
  }



  return(

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


        <CheckoutForm

          user={user}

          formData={formData}

          onChange={handleChange}

          onSubmit={handleSubmit}

          loading={loading}

          error={error}

          disabled={hasStockIssue}

          stockIssues={stockIssues}

        />



        <OrderSummary

          items={cartItems}

          total={totalPrice}

        />


      </div>


    </main>

  )
}