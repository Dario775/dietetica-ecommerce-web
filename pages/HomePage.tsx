
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../constants';

interface HomePageProps {
  products: Product[];
  addToCart: (p: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, addToCart }) => {
  const featured = products.slice(0, 4);

  const categories = [
    { id: 1, name: 'Despensa', icon: 'inventory_2', color: 'from-amber-400 to-orange-500', count: 45 },
    { id: 2, name: 'Dietéticos', icon: 'spa', color: 'from-emerald-400 to-teal-500', count: 32 },
    { id: 3, name: 'Sin Gluten', icon: 'grain', color: 'from-purple-400 to-indigo-500', count: 28 },
    { id: 4, name: 'Vegano', icon: 'eco', color: 'from-green-400 to-emerald-500', count: 24 },
  ];

  const benefits = [
    { icon: 'local_shipping', title: 'Envío Gratis', desc: 'En compras +$50' },
    { icon: 'verified', title: '100% Natural', desc: 'Sin aditivos' },
    { icon: 'autorenew', title: 'Devolución Fácil', desc: '30 días garantía' },
    { icon: 'support_agent', title: 'Soporte 24/7', desc: 'Siempre disponibles' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <Link to="/shop" className="block group">
            <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.01]">
              {/* Banner Image */}
              <img
                src="/banner-home.png"
                alt="Natural, fresco y consciente - Despensa & Dietética 1982"
                className="w-full h-auto object-cover"
              />

              {/* Overlay gradient for button visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* CTA Button - appears on hover */}
              <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-black text-sm sm:text-base shadow-xl">
                  <span className="material-symbols-outlined">storefront</span>
                  Ver Catálogo
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-6 sm:py-8 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4">
                <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">{benefit.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-text-main dark:text-white">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
              Explora
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-text-main dark:text-white">
              Categorías Destacadas
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to="/shop"
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">{cat.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-text-main dark:text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-text-muted">{cat.count} productos</p>
                <span className="absolute top-6 right-6 material-symbols-outlined text-gray-200 dark:text-gray-700 group-hover:text-primary group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-background-dark/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 gap-4 sm:gap-6">
            <div className="max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest mb-4">
                Popular
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-text-main dark:text-white mb-3">
                Elegidos por nuestra comunidad
              </h2>
              <p className="text-base sm:text-lg text-text-muted">Productos esenciales para un estilo de vida saludable y equilibrado.</p>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-sm font-black text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all uppercase tracking-widest group">
              Explorar todo
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(product => (
              <div key={product.id} className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  {product.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                        {product.tag}
                      </span>
                    </div>
                  )}
                  <img
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={product.images?.[0]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-2xl bg-white shadow-xl text-primary hover:bg-primary hover:text-white transition-all translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 active:scale-90"
                  >
                    <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                  </button>
                </div>
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">{product.category}</span>
                  <h3 className="text-base sm:text-lg font-black text-text-main dark:text-white leading-tight mb-2">
                    <Link to="/shop" className="hover:text-primary transition-colors">{product.name}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium mb-3">{product.weight}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                      <span className="text-xl sm:text-2xl font-black text-text-main dark:text-white">{formatPrice(product.price)}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="lg:hidden flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary via-primary-dark to-[#1e3a38]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">
                ¿Nuevo por aquí?
              </h2>
              <p className="text-base sm:text-lg text-white/80 max-w-lg">
                Suscríbete y obtén un <span className="font-black text-amber-300">15% de descuento</span> en tu primera compra.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent w-full sm:w-80"
              />
              <button className="px-8 py-4 rounded-xl bg-white text-primary font-black hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
