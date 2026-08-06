import styles from "./CheckoutPage.module.css"


export default function OrderSummary({
items,
total
}){


const money =
value =>
new Intl.NumberFormat(
"es-ES",
{
style:"currency",
currency:"EUR"
}
).format(value)



return (

<section
className={`${styles.card} ${styles.summary}`}
>


<h2>
Resumen
</h2>



<ul>

{
items.map(item=>(

<li key={item.id || item.productId}>

<div>

<strong>
{item.name}
</strong>

<p>
{item.quantity} unidad(es)
</p>

</div>


<span>

{
money(
item.price *
item.quantity
)

}

</span>


</li>

))

}

</ul>



<hr/>


<div className={styles.line}>

<span>
Entrega
</span>

<strong>
Gratis
</strong>

</div>



<div className={styles.total}>

<span>
Total
</span>

<strong>
{money(total)}
</strong>

</div>


</section>

)

}