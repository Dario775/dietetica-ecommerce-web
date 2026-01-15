
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Product, CartItem } from './types';
import { INITIAL_PRODUCTS } from './constants';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
        <Routes>
          <Route path="/admin" element={<AdminPage products={products} setProducts={setProducts} />} />
          <Route path="*" element={
            <>
              <Header 
                cartCount={cartCount} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
              />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage products={products} addToCart={addToCart} />} />
                  <Route path="/shop" element={<ShopPage products={products} addToCart={addToCart} />} />
                  <Route path="/checkout" element={
                    <CheckoutPage 
                      cart={cart} 
                      updateQuantity={updateQuantity} 
                      removeFromCart={removeFromCart} 
                    />
                  } />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
