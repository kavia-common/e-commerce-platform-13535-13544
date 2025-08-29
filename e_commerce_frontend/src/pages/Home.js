import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Filters from '../components/products/Filters';

/**
 * PUBLIC_INTERFACE
 * Home displays the product catalog with search and filtering.
 */
export default function Home() {
  const [params] = useSearchParams();
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [error, setError] = React.useState('');

  const queryParams = React.useMemo(() => {
    const q = {};
    ['q','category','minPrice','maxPrice','sort'].forEach(k => {
      const v = params.get(k);
      if (v) q[k] = v;
    });
    return q;
  }, [params]);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.listProducts(queryParams).then(data => {
      if (!mounted) return;
      const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      setProducts(list);
    }).catch(e => {
      if (!mounted) return;
      setError(e.message);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [queryParams]);

  return (
    <div className="container">
      <h2>Products</h2>
      <Filters />
      {loading && <div>Loading...</div>}
      {error && <div className="toast" role="alert">{error}</div>}
      <div className="grid" aria-live="polite">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && products.length === 0 && <div className="muted">No products found.</div>}
    </div>
  );
}
