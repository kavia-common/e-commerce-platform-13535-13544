import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './theme.css';
import './global.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Toasts from './components/common/Toasts';

/**
 * PUBLIC_INTERFACE
 * App is the root component that wires up routing, global providers, layout, and theme.
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-shell">
            <Header />
            <CartSidebar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toasts />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
