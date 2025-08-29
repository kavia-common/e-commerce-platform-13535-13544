import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * PUBLIC_INTERFACE
 * ProductCard renders a single product tile with image, title, price, and add to cart.
 */
export default function ProductCard({ product }) {
  const { add } = useCart();
  return (
    <div className="card">
      <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
        <img src={product.image || 'https://via.placeholder.com/300x180'} alt={product.title} />
      </Link>
      <h3 title={product.title}>{product.title}</h3>
      <div className="inline" style={{ justifyContent: 'space-between' }}>
        <span className="price">${Number(product.price || 0).toFixed(2)}</span>
        <button className="btn" onClick={() => add(product, 1)} aria-label={`Add ${product.title} to cart`}>Add</button>
      </div>
    </div>
  );
}
