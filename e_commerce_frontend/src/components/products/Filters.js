import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Filters renders search and filtering inputs and syncs with URL query params.
 */
export default function Filters() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    setCategory(params.get('category') || '');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setSort(params.get('sort') || '');
  }, [params]);

  const apply = () => {
    const next = new URLSearchParams(window.location.search);
    if (category) next.set('category', category); else next.delete('category');
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice');
    if (sort) next.set('sort', sort); else next.delete('sort');
    navigate({ pathname: '/', search: next.toString() });
  };

  const clear = () => {
    const next = new URLSearchParams(window.location.search);
    ['category','minPrice','maxPrice','sort'].forEach(k => next.delete(k));
    navigate({ pathname: '/', search: next.toString() });
  };

  return (
    <div className="filters" role="region" aria-label="Filters">
      <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category">
        <option value="">All categories</option>
        <option value="apparel">Apparel</option>
        <option value="electronics">Electronics</option>
        <option value="home">Home</option>
      </select>
      <input type="number" placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} aria-label="Min price" />
      <input type="number" placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} aria-label="Max price" />
      <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
        <option value="">Sort by</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="title_asc">Title: A-Z</option>
        <option value="title_desc">Title: Z-A</option>
      </select>
      <div className="inline" style={{ gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={clear} aria-label="Clear filters">Clear</button>
        <button className="btn" onClick={apply} aria-label="Apply filters">Apply</button>
      </div>
    </div>
  );
}
