import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useProduct } from '../../hooks/useProduct';
import { useReviews } from '../../hooks/useReviews';

import ReviewList from '../../components/ReviewList/ReviewList';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import RatingSummary from '../../components/RatingSummary/RatingSummary';

import { addCartItem, getCart } from '../../api/cart';
import { setLocalCart } from '../../store/cartSlice';
import { authStorage } from '../../utils/authStorage';

import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const userName = authStorage.userName;
  const {
    data: product,
    loading: productLoading,
    error: productError
  } = useProduct(id);
  const {
    data: reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refreshReviews
  } = useReviews(id);
  const maxStock = product?.stock ?? 0;
  const handleReviewAdded = () => {
    refreshReviews();
  };

  const handleAddToCart = async () => {
    if (!userName) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      await addCartItem(
        product.id,
        quantity
      );

      const cartData =
        await getCart();

      const items =
        Array.isArray(cartData)
          ? cartData
          : cartData?.items || [];

      dispatch(
        setLocalCart(
          items.map((item) => ({
            id:
              item.id ??
              item.cartItemId ??
              item.productId,
            productId:
              item.productId ??
              item.product?.id ??
              item.id,
            name:
              item.product?.name ??
              item.name ??
              'Producto',
            price:
              Number(
                item.product?.price ??
                item.price ??
                0
              ),
            imageUrl:
              item.product?.imageUrl ??
              item.imageUrl,
            quantity:
              item.quantity ?? 1,
            stock:
              item.product?.stock ??
              item.stock ??
              0,
          }))
        )
      );
      navigate('/cart');

    } catch(error) {
      console.error(error);
      setAddError(
        'No se pudo añadir el producto al carrito.'
      );
    } finally {
      setAdding(false);
    }
  };

  if(productLoading){
    return (
      <p className={styles.centeredMessage}>
        Cargando producto...
      </p>
    );
  }

  if(productError || !product){
    return (
      <div className={styles.centeredContainer}>
        <h2>
          Producto no encontrado
        </h2>
        <p>
          El artículo que buscas no existe.
        </p>
        <Link
          to="/products"
          className={styles.linkPrimary}
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.productSection}>
        <div className={styles.imageWrapper}>
          <img
            src={
              product.imageUrl ||
              'https://placehold.co/500x700?text=Sin+Imagen'
            }
            alt={product.name}
            className={styles.image}
          />
        </div>
        <div className={styles.info}>
          {product.category && (
            <span className={styles.category}>
              {product.category}
            </span>
          )}
          <h1>
            {product.name}
          </h1>
          <p className={styles.price}>
            {Number(product.price).toFixed(2)} €
          </p>
          <p
            className={`${styles.stockInfo} ${
              maxStock === 0
                ? styles.outOfStock
                : maxStock <= 5
                ? styles.lowStock
                : styles.inStock
            }`}
          >
            {maxStock === 0
              ? '❌ Agotado'
              : maxStock <= 5
              ? '⚠️ Pocas unidades disponibles'
              : '✓ Disponible'}
          </p>
          <p className={styles.description}>
            {
              product.description ||
              'Este producto no tiene descripción disponible.'
            }
          </p>
          {maxStock > 0 && (
            <div className={styles.counter}>
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.max(1, quantity - 1)
                  )
                }
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.min(
                      maxStock,
                      quantity + 1
                    )
                  )
                }
                disabled={quantity >= maxStock}
              >
                +
              </button>
            </div>
          )}
          <button
            className={styles.addButton}
            onClick={handleAddToCart}
            disabled={
              adding ||
              maxStock === 0
            }
          >
            {
              maxStock === 0
              ? 'Agotado'
              : adding
                ? 'Añadiendo...'
                : 'Añadir al carrito'
            }
          </button>
          {addError && (
            <p className={styles.errorText}>
              {addError}
            </p>
          )}
          <Link
            to="/products"
            className={styles.backLink}
          >
            ← Volver al catálogo
          </Link>
        </div>
      </section>
      <section className={styles.reviewsSection}>
        <RatingSummary reviews={reviews} />

        <ReviewList
            reviews={reviews}
            loading={reviewsLoading}
            error={reviewsError}
        />

        {userName ? (
            <ReviewForm
                productId={product.id || product._id}
                onReviewAdded={handleReviewAdded}
            />
        ) : (
            <p>
                <Link to="/login">
                    Inicia sesión
                </Link>{' '}
                para dejar una valoración.
            </p>
        )}
    </section>
    </main>
  );
}