import React from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

/**
 * PUBLIC_INTERFACE
 * ProductDetails shows a single product and allows adding to cart.
 */
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { add } = useCart();

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getProduct(id).then(data => {
      if (!mounted) return;
      setProduct(data);
    }).catch(e => {
      if (!mounted) return;
      setError(e.message);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container"><div className="toast" role="alert">{error}</div></div>;
  if (!product) return <div className="container">Product not found.</div>;

  return (
    <div className="container">
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
        <img src={product.image || 'https://via.placeholder.com/520x360'} alt={product.title} style={{ height: 360 }} />
        <div>
          <h2>{product.title}</h2>
          <div className="price" style={{ fontSize: 20 }}>${Number(product.price || 0).toFixed(2)}</div>
          <p className="muted">{product.description || 'No description.'}</p>
          <div className="inline">
            <button className="btn" onClick={() => add(product, 1)} aria-label="Add to cart">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
