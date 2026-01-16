
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  cartCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white text-center py-2.5 text-xs font-bold tracking-wide">
        <span className="material-symbols-outlined text-sm align-middle mr-2">local_shipping</span>
        ENVÍO GRATIS en compras mayores a $5000 |
        <span className="underline ml-1 cursor-pointer hover:text-white/80 transition-colors">Ver condiciones</span>
      </div>

      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl dark:bg-background-dark/95 shadow-sm transition-all duration-300">
        <div className="mx-auto flex h-16 lg:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex size-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl dark:text-white">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex size-12 lg:size-14 items-center justify-center overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Despensa & Dietética 1982"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-sm lg:text-base font-black leading-none tracking-tight text-text-main dark:text-white uppercase">Despensa & Dietética</h1>
              <span className="text-[10px] lg:text-xs font-bold text-primary tracking-[0.15em] uppercase mt-0.5">Desde 1982</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Inicio', icon: 'home' },
              { to: '/shop', label: 'Tienda', icon: 'storefront' },
              { to: '/admin', label: 'Admin', icon: 'admin_panel_settings' }
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(item.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-main hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button (Mobile) / Search Bar (Desktop) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden flex size-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>

            <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all group">
              <span className="material-symbols-outlined text-gray-400 text-lg group-focus-within:text-primary transition-colors">search</span>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 py-0 pl-2 w-40 xl:w-52 dark:text-white"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:flex size-10 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white"
            >
              <span className="material-symbols-outlined text-xl">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-2xl dark:text-white group-hover:text-primary transition-colors">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-red-400 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-background-dark animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:block text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                Carrito
              </span>
            </Link>

            {/* User */}
            <button className="hidden sm:flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary hover:from-primary hover:to-primary-dark hover:text-white transition-all">
              <span className="material-symbols-outlined text-xl">person</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-4 animate-fadeIn">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl">
              <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Buscar productos..."
                autoFocus
                className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 py-0 pl-2 dark:text-white"
              />
              <button onClick={() => setIsSearchOpen(false)}>
                <span className="material-symbols-outlined text-gray-400">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-background-dark shadow-xl border-t border-gray-100 dark:border-gray-800 animate-slideDown">
            <nav className="flex flex-col p-4 gap-1">
              {[
                { to: '/', label: 'Inicio', icon: 'home' },
                { to: '/shop', label: 'Tienda', icon: 'storefront' },
                { to: '/admin', label: 'Administración', icon: 'admin_panel_settings' }
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all ${isActive(item.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-main hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-gray-100 dark:border-gray-800" />
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold text-text-main hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <span className="material-symbols-outlined text-xl">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
                {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
