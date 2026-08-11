import styles from "./CheckoutPage.module.css"


export default function CheckoutForm({
    user,
    formData,
    onChange,
    onSubmit,
    loading,
    error,
    disabled,
    stockIssues
}) {


    return (

        <section className={styles.card}>


            <h2>
                Datos de entrega
            </h2>


            <div className={styles.userBox}>

                <strong>
                    {user.name}
                </strong>

                <span>
                    {user.email}
                </span>

            </div>



            <form
                onSubmit={onSubmit}
                className={styles.form}
            >


                <label>
                    Dirección
                    <input
                        name="street"
                        placeholder="Ej: Calle Mayor 12"
                        value={formData.street}
                        onChange={onChange}
                    />
                </label>



                <label>
                    Ciudad

                    <input
                        name="city"
                        placeholder="Ej: Bakio"
                        value={formData.city}
                        onChange={onChange}
                    />

                </label>



                <label>
                    Código postal

                    <input
                        name="postalCode"
                        placeholder="48130"
                        value={formData.postalCode}
                        onChange={onChange}
                    />

                </label>



                <label>
                    País

                    <input
                        name="country"
                        placeholder="Ej: España"
                        value={formData.country}
                        onChange={onChange}
                    />

                </label>



                <div className={styles.delivery}>

                    🚚

                    <div>

                        <strong>
                            Entrega gratuita
                        </strong>

                        <p>
                            Te lo entregaremos personalmente en Bakio.
                            Nos pondremos en contacto contigo.
                        </p>

                    </div>

                </div>



                <div className={styles.payment}>

                    💳

                    <div>

                        <strong>
                            Pago seguro
                        </strong>

                        <p>
                            Preparado para Stripe.
                        </p>

                    </div>

                </div>



                {stockIssues.length > 0 &&

                    <div className={styles.stock}>

                        ⚠ Hay productos sin stock suficiente.

                    </div>

                }



                {error &&

                    <p className={styles.error}>
                        {error}
                    </p>

                }



                <button
                    disabled={loading || disabled}
                    className={styles.button}
                >

                    {
                        loading
                            ? "Procesando..."
                            : "Continuar al pago"
                    }

                </button>


            </form>


        </section>

    )

}