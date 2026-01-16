import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { formatPrice } from '../constants';

interface ShopPageProps {
  products: Product[];
  addToCart: (p: Product) => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'recommended' | 'price-low' | 'price-high' | 'name';

const ShopPage: React.FC<ShopPageProps> = ({ products, addToCart }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewProduct]);

  const categoryDefs = [
    { id: 'pantry', label: 'Pantry Essentials', icon: 'inventory_2' },
    { id: 'dietetic', label: 'Dietetic & Bio', icon: 'spa' },
    { id: 'glutenfree', label: 'Gluten-Free', icon: 'grain' },
    { id: 'vegan', label: 'Vegan Options', icon: 'eco' },
  ];

  const categories = categoryDefs.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.label).length
  }));

  const toggleCategory = (label: string) => {
    setSelectedCategories(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedCategories, searchQuery, sortBy]);

  return (
    <>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-background-dark dark:to-secondary/10 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <nav className="flex items-center gap-2 text-sm text-text-muted mb-3">
                  <a href="/" className="hover:text-primary transition-colors">Inicio</a>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-text-main dark:text-white font-medium">Tienda</span>
                </nav>
                <h1 className="text-3xl sm:text-4xl font-black text-text-main dark:text-white">
                  Todos los Productos
                </h1>
                <p className="text-text-muted mt-2">
                  {filteredAndSortedProducts.length} productos encontrados
                </p>
              </div>

              {/* Search Bar - Mobile */}
              <div className="sm:hidden w-full">
                <div className="flex items-center bg-white dark:bg-surface-dark px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 py-0 pl-2 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white dark:bg-surface-dark px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Filtros
              {selectedCategories.length > 0 && (
                <span className="size-5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  {selectedCategories.length}
                </span>
              )}
            </button>

            {/* Sidebar - Mobile Overlay */}
            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
                <div className="relative w-80 max-w-[85%] bg-white dark:bg-surface-dark h-full shadow-2xl animate-slideRight overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-black text-text-main dark:text-white">Filtros</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                      <span className="material-symbols-outlined dark:text-white">close</span>
                    </button>
                  </div>
                  <div className="p-4 space-y-6">
                    <SidebarContent
                      categories={categories}
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      setSelectedCategories={setSelectedCategories}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0 space-y-6">
              <div className="sticky top-28">
                <SidebarContent
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                {/* Active Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategories.length > 0 ? (
                    <>
                      {selectedCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                        >
                          {cat}
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-xs font-bold text-text-muted hover:text-primary transition-colors"
                      >
                        Limpiar todo
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-text-muted">Mostrando todos los productos</span>
                  )}
                </div>

                {/* View & Sort Controls */}
                <div className="flex items-center gap-3">
                  {/* Desktop Search */}
                  <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-gray-400 py-0 pl-2 w-32 dark:text-white"
                    />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`size-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <span className="material-symbols-outlined text-lg">grid_view</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`size-8 flex items-center justify-center rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <span className="material-symbols-outlined text-lg">view_list</span>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2 focus:ring-primary/20 focus:border-primary cursor-pointer dark:text-white"
                  >
                    <option value="recommended">Recomendado</option>
                    <option value="price-low">Menor precio</option>
                    <option value="price-high">Mayor precio</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  : "flex flex-col gap-4"
                }>
                  {filteredAndSortedProducts.map(product => (
                    viewMode === 'grid'
                      ? <ProductCard key={product.id} product={product} addToCart={addToCart} onQuickView={() => setQuickViewProduct(product)} />
                      : <ProductListItem key={product.id} product={product} addToCart={addToCart} onQuickView={() => setQuickViewProduct(product)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-20 bg-white dark:bg-surface-dark rounded-3xl border border-gray-100 dark:border-gray-800">
                  <div className="size-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">search_off</span>
                  </div>
                  <h3 className="text-xl font-black text-text-main dark:text-white mb-2">No se encontraron productos</h3>
                  <p className="text-text-muted mb-6">Intenta ajustar los filtros o buscar algo diferente.</p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">restart_alt</span>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {
        quickViewProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setQuickViewProduct(null)}
          >
            <div
              className="relative bg-white dark:bg-surface-dark rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-600">close</span>
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image Gallery */}
                <div className="md:w-1/2 bg-gray-50 dark:bg-gray-900 p-6">
                  <div className="relative aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={quickViewProduct.images?.[0]}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {quickViewProduct.tag && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                          {quickViewProduct.tag}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Thumbnail Strip */}
                  {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                    <div className="flex gap-3 mt-4 justify-center">
                      {quickViewProduct.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className={`size-16 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-primary/50 transition-all`}>
                          <img src={img} alt={`${quickViewProduct.name} ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 p-8 flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-text-main dark:text-white mb-2">
                    {quickViewProduct.name}
                  </h2>
                  <p className="text-gray-400 font-medium mb-4">
                    {quickViewProduct.weight}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    {quickViewProduct.oldPrice && (
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(quickViewProduct.oldPrice)}
                      </span>
                    )}
                    <span className="text-4xl font-black text-primary">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                  </div>

                  <p className="text-text-muted leading-relaxed mb-6 flex-1">
                    {quickViewProduct.description}
                  </p>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className={`size-3 rounded-full ${quickViewProduct.stock > 5 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                    <span className={`text-sm font-bold ${quickViewProduct.stock > 5 ? 'text-green-600' : 'text-amber-600'}`}>
                      {quickViewProduct.stock > 5 ? `${quickViewProduct.stock} unidades disponibles` : `¡Últimas ${quickViewProduct.stock} unidades!`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-primary text-white font-black text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
                      Agregar al Carrito
                    </button>
                    <button className="size-14 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 transition-all">
                      <span className="material-symbols-outlined text-2xl">favorite</span>
                    </button>
                  </div>

                  {/* SKU */}
                  <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    SKU: <span className="font-bold">{quickViewProduct.sku}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

// Sidebar Content Component
const SidebarContent: React.FC<{
  categories: { id: string; label: string; icon: string; count: number }[];
  selectedCategories: string[];
  toggleCategory: (label: string) => void;
  setSelectedCategories: (cats: string[]) => void;
}> = ({ categories, selectedCategories, toggleCategory, setSelectedCategories }) => (
  <>
    {/* Categories */}
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">category</span>
          <h2 className="text-sm font-black uppercase tracking-widest text-text-main dark:text-white">Categorías</h2>
        </div>
        {selectedCategories.length > 0 && (
          <button
            onClick={() => setSelectedCategories([])}
            className="text-xs font-bold text-primary hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="space-y-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.label)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selectedCategories.includes(cat.label)
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-text-main dark:text-gray-300 border border-transparent'
              }`}
          >
            <span className="material-symbols-outlined text-lg">{cat.icon}</span>
            <span className="flex-1 text-sm font-medium">{cat.label}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategories.includes(cat.label) ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Concierge Card */}
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-5 border border-primary/10">
      <div className="size-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm">
        <span className="material-symbols-outlined text-2xl text-primary">support_agent</span>
      </div>
      <h3 className="text-base font-black text-text-main dark:text-white mb-2">¿Necesitas ayuda?</h3>
      <p className="text-xs text-text-muted leading-relaxed mb-4">
        Nuestros nutricionistas están disponibles para asesorarte de forma personalizada.
      </p>
      <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-primary text-sm font-black py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
        <span className="material-symbols-outlined text-lg">chat</span>
        Chatear Ahora
      </button>
    </div>

    {/* Promo Banner */}
    <div className="bg-gradient-to-br from-secondary to-orange-400 rounded-2xl p-5 text-white">
      <span className="text-3xl font-black">15%</span>
      <p className="text-sm font-bold mt-1 opacity-90">de descuento en tu primera compra</p>
      <p className="text-xs mt-2 opacity-75">Usa el código: BIENVENIDO15</p>
    </div>
  </>
);

// Product Card Component
const ProductCard: React.FC<{ product: Product; addToCart: (p: Product) => void; onQuickView: () => void }> = ({ product, addToCart, onQuickView }) => (
  <div className="group flex flex-col bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Quick Actions */}
      <div className="absolute bottom-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
        <button onClick={onQuickView} className="size-10 flex items-center justify-center rounded-xl bg-white shadow-lg text-gray-600 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">visibility</span>
        </button>
        <button
          onClick={() => addToCart(product)}
          className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
        </button>
      </div>
    </div>

    <div className="p-4 flex flex-col flex-1">
      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
        {product.category}
      </span>
      <h3 className="text-base font-black text-text-main dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors flex-1">
        {product.name}
      </h3>
      <p className="text-xs text-gray-400 font-medium mb-3">
        {product.weight}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          {product.oldPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-xl font-black text-text-main dark:text-white">
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="lg:hidden size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  </div>
);

// Product List Item Component
const ProductListItem: React.FC<{ product: Product; addToCart: (p: Product) => void; onQuickView: () => void }> = ({ product, addToCart, onQuickView }) => (
  <div className="group flex flex-col sm:flex-row bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
    <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-gray-50">
      {product.tag && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
            {product.tag}
          </span>
        </div>
      )}
      <img
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={product.images?.[0]}
      />
    </div>

    <div className="p-5 flex flex-col sm:flex-row sm:items-center flex-1 gap-4">
      <div className="flex-1">
        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">
          {product.category}
        </span>
        <h3 className="text-lg font-black text-text-main dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 font-medium mb-2">
          {product.weight}
        </p>
        <p className="text-sm text-text-muted line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center sm:flex-col sm:items-end gap-4 sm:gap-3">
        <div className="flex items-center sm:flex-col sm:items-end gap-2">
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-2xl font-black text-text-main dark:text-white">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onQuickView}
            className="size-12 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ShopPage;
