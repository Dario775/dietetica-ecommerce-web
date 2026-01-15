
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, Sale } from '../types';
import { INITIAL_SALES, formatPrice } from '../constants';

interface AdminPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Types for settings
interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  enabled: boolean;
}

interface PaymentMethodConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  instructions?: string;
}

const AdminPage: React.FC<AdminPageProps> = ({ products, setProducts }) => {
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('inventario');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Shipping Methods State
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    { id: '1', name: 'Envío Estándar', price: 5000, estimatedDays: '3-5 días hábiles', enabled: true },
    { id: '2', name: 'Envío Express', price: 8500, estimatedDays: '24-48 horas', enabled: true },
    { id: '3', name: 'Retiro en Local', price: 0, estimatedDays: 'Inmediato', enabled: true },
  ]);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([
    { id: '1', name: 'Mercado Pago', icon: 'credit_card', enabled: true, instructions: 'Pago seguro con tarjeta o saldo MP' },
    { id: '2', name: 'Transferencia Bancaria', icon: 'account_balance', enabled: true, instructions: 'CBU: 0000000000000000000000' },
    { id: '3', name: 'Efectivo', icon: 'payments', enabled: true, instructions: 'Pago al momento de la entrega o retiro' },
  ]);

  // New shipping/payment form states
  const [newShipping, setNewShipping] = useState({ name: '', price: '', estimatedDays: '' });
  const [newPayment, setNewPayment] = useState({ name: '', icon: 'credit_card', instructions: '' });

  // Form State for Products
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: 'Pantry Essentials'
  });

  // Image state - up to 4 images
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const MAX_IMAGES = 4;

  const handleImageAdd = (url: string) => {
    if (productImages.length < MAX_IMAGES && url.trim()) {
      setProductImages(prev => [...prev, url.trim()]);
    }
  };

  const handleImageRemove = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // Drag & Drop from desktop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const fileArray: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        fileArray.push(file);
      }
    }

    const filesToProcess = fileArray.slice(0, MAX_IMAGES - productImages.length);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setProductImages(prev => {
            if (prev.length < MAX_IMAGES) {
              return [...prev, result];
            }
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Reorder images via drag
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Reorder images
    setProductImages(prev => {
      const newImages = [...prev];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      return newImages;
    });
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesToProcess = Array.from(files).slice(0, MAX_IMAGES - productImages.length);

    filesToProcess.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setProductImages(prev => {
            if (prev.length < MAX_IMAGES) {
              return [...prev, result];
            }
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ''; // Reset input
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setProductImages(product.images || []);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) return;

    // Use uploaded images or a default placeholder
    const imagesToSave = productImages.length > 0
      ? productImages
      : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'];

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        images: imagesToSave,
        status: parseInt(formData.stock) > 5 ? 'In Stock' : 'Low Stock'
      } : p));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category: formData.category,
        weight: 'Unitario',
        description: 'Producto agregado manualmente.',
        images: imagesToSave,
        status: parseInt(formData.stock) > 5 ? 'In Stock' : 'Low Stock'
      };
      setProducts(prev => [...prev, newProduct]);
    }

    setIsAdding(false);
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '', stock: '', category: 'Pantry Essentials' });
    setProductImages([]);
  };

  const handleUpdateSaleStatus = (saleId: string, newStatus: Sale['status']) => {
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
  };

  const handleExportCSV = () => {
    const isSales = activeTab === 'ventas';
    const headers = isSales
      ? ['Orden ID', 'Cliente', 'Fecha', 'Total', 'Metodo Pago', 'Metodo Envio', 'Estado']
      : ['ID', 'Nombre', 'SKU', 'Categoria', 'Precio', 'Stock', 'Estado'];

    const dataToExport = isSales ? sales : products;
    const rows = dataToExport.map((item: any) => {
      if (isSales) {
        return [item.id, item.customerName, item.date, item.total, item.paymentMethod, item.shippingMethod, item.status];
      }
      return [item.id, item.name, item.sku, item.category, item.price, item.stock, item.status];
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${isSales ? 'ventas' : 'inventario'}_despensa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = useMemo(() => {
    const list = activeTab === 'ventas' ? sales : products;
    return list.filter((p: any) => {
      const search = searchTerm.toLowerCase();
      if (activeTab === 'ventas') {
        return p.customerName.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
      }
      return p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search);
    });
  }, [products, sales, searchTerm, activeTab]);

  // Adjust pagination when items are removed
  React.useEffect(() => {
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filtered.length, currentPage]);

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const totalSalesValue = sales.reduce((acc, s) => acc + (s.status !== 'Cancelado' ? s.total : 0), 0);
    const pendingOrders = sales.filter(s => s.status === 'Pendiente').length;

    return [
      { label: 'Valor Inventario', value: `$${totalInventoryValue.toLocaleString()}`, icon: 'inventory', color: 'bg-blue-500' },
      { label: 'Ingresos Totales', value: `$${totalSalesValue.toLocaleString()}`, icon: 'payments', color: 'bg-green-500' },
      { label: 'Pedidos Pendientes', value: pendingOrders, icon: 'pending_actions', color: 'bg-amber-500' }
    ];
  }, [products, sales]);

  return (
    <div className="flex h-screen bg-[#F8FAFB] text-slate-700 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Premium */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] flex flex-col shrink-0 h-full text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 lg:p-8 relative">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white lg:hidden"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="bg-primary rounded-xl size-10 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">eco</span>
            </div>
            <div>
              <h1 className="text-white text-sm font-black uppercase tracking-widest leading-none">Despensa</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </Link>

          <nav className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-2">Módulos</p>
            <button
              onClick={() => { setActiveTab('dashboard'); setCurrentPage(1); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-xl">grid_view</span>
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('inventario'); setCurrentPage(1); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'inventario' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-xl">inventory_2</span>
              Inventario
            </button>
            <button
              onClick={() => { setActiveTab('ventas'); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'ventas' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                Ventas
              </div>
              {sales.filter(s => s.status === 'Pendiente').length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {sales.filter(s => s.status === 'Pendiente').length}
                </span>
              )}
            </button>
          </nav>

          <nav className="mt-10 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-2">Sistema</p>
            <button
              onClick={() => { setActiveTab('configuracion'); setCurrentPage(1); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'configuracion' ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-xl">settings</span>
              Configuración
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-bold">
            <span className="material-symbols-outlined">logout</span>
            Sitio Público
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 lg:flex-none">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full lg:w-96 group focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-slate-400">search</span>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'ventas' ? "Buscar por cliente o ID de orden..." : "Buscar por nombre, SKU..."}
                className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900 leading-none">Admin Despensa</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Superusuario</p>
                </div>
                <img src={`https://ui-avatars.com/api/?name=Admin+Despensa&background=00b172&color=fff`} className="size-10 rounded-xl shadow-sm border border-slate-100" alt="Avatar" />
              </div>
            </div>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-6 lg:space-y-10">

          {activeTab === 'dashboard' ? (
            <div className="space-y-10 animate-in fade-in duration-500">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                      <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    </div>
                    <div className={`size-14 rounded-2xl ${s.color} flex items-center justify-center text-white shadow-lg`}>
                      <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Pedidos Recientes</h3>
                  <div className="space-y-4">
                    {sales.slice(0, 5).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="text-sm font-black text-slate-900">{s.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">{formatPrice(s.total)}</p>
                          <p className={`text-[9px] font-black uppercase ${s.status === 'Entregado' ? 'text-green-500' : 'text-amber-500'}`}>{s.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-7xl mb-4 opacity-20">trending_up</span>
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-center">Analíticas de ventas mensuales <br /> se activarán próximamente</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'ventas' ? (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Historial de Ventas</h2>
                  <p className="text-slate-500 font-medium text-sm mt-1">Gestiona los pedidos entrantes y el estado de tus entregas.</p>
                </div>
                <button onClick={handleExportCSV} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">download</span>
                  Exportar Historial
                </button>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                        <th className="px-10 py-5">Orden & Cliente</th>
                        <th className="px-8 py-5 text-center">Fecha</th>
                        <th className="px-8 py-5 text-center">Monto</th>
                        <th className="px-8 py-5 text-center">Método</th>
                        <th className="px-8 py-5 text-center">Estado</th>
                        <th className="px-10 py-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedData.map((s: any, idx: number) => (
                        <tr key={s.id} className={`transition-all group border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-primary/5`}>
                          <td className="px-10 py-5">
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight">{s.customerName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{s.id}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <p className="text-[11px] font-bold text-slate-500">{new Date(s.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-5 text-center text-sm font-black text-slate-900">{formatPrice(s.total)}</td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <p className="text-[10px] font-black text-slate-700 uppercase leading-none">{s.paymentMethod}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">{s.shippingMethod}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <select
                              value={s.status}
                              onChange={(e) => handleUpdateSaleStatus(s.id, e.target.value as Sale['status'])}
                              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-offset-2 transition-all cursor-pointer shadow-sm ${s.status === 'Entregado' ? 'bg-green-100 text-green-700 ring-green-500/10' :
                                s.status === 'Cancelado' ? 'bg-red-100 text-red-700 ring-red-500/10' :
                                  s.status === 'Enviado' ? 'bg-blue-100 text-blue-700 ring-blue-500/10' : 'bg-amber-100 text-amber-700 ring-amber-500/10'
                                }`}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Enviado">Enviado</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="px-10 py-5 text-right">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-white border border-slate-200 rounded-xl shadow-sm">
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'configuracion' ? (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuración</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Gestiona los métodos de envío y pago de tu tienda.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Methods Section */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">local_shipping</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Métodos de Envío</h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {shippingMethods.map(method => (
                      <div key={method.id} className={`p-4 rounded-xl border-2 transition-all ${method.enabled ? 'border-green-200 bg-green-50/30' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setShippingMethods(prev => prev.map(m => m.id === method.id ? { ...m, enabled: !m.enabled } : m))}
                              className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${method.enabled ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}
                            >
                              {method.enabled && <span className="material-symbols-outlined text-sm">check</span>}
                            </button>
                            <div>
                              <p className="font-bold text-slate-900">{method.name}</p>
                              <p className="text-xs text-slate-500">{method.estimatedDays}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-900">{method.price === 0 ? 'Gratis' : formatPrice(method.price)}</span>
                            <button
                              onClick={() => setShippingMethods(prev => prev.filter(m => m.id !== method.id))}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new shipping method */}
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Agregar Método de Envío</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={newShipping.name}
                        onChange={e => setNewShipping(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        value={newShipping.price}
                        onChange={e => setNewShipping(prev => ({ ...prev, price: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Tiempo estimado"
                        value={newShipping.estimatedDays}
                        onChange={e => setNewShipping(prev => ({ ...prev, estimatedDays: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newShipping.name && newShipping.estimatedDays) {
                          setShippingMethods(prev => [...prev, {
                            id: Date.now().toString(),
                            name: newShipping.name,
                            price: parseFloat(newShipping.price) || 0,
                            estimatedDays: newShipping.estimatedDays,
                            enabled: true
                          }]);
                          setNewShipping({ name: '', price: '', estimatedDays: '' });
                        }
                      }}
                      className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                      Agregar Método
                    </button>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">payments</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Métodos de Pago</h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map(method => (
                      <div key={method.id} className={`p-4 rounded-xl border-2 transition-all ${method.enabled ? 'border-green-200 bg-green-50/30' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, enabled: !m.enabled } : m))}
                              className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${method.enabled ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}
                            >
                              {method.enabled && <span className="material-symbols-outlined text-sm">check</span>}
                            </button>
                            <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-600">{method.icon}</span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{method.name}</p>
                              <p className="text-xs text-slate-500">{method.instructions}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setPaymentMethods(prev => prev.filter(m => m.id !== method.id))}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new payment method */}
                  <div className="border-t border-slate-100 pt-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Agregar Método de Pago</p>
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre del método"
                          value={newPayment.name}
                          onChange={e => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        />
                        <select
                          value={newPayment.icon}
                          onChange={e => setNewPayment(prev => ({ ...prev, icon: e.target.value }))}
                          className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="credit_card">💳 Tarjeta</option>
                          <option value="account_balance">🏦 Banco</option>
                          <option value="payments">💵 Efectivo</option>
                          <option value="qr_code">📱 QR</option>
                          <option value="currency_bitcoin">₿ Crypto</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Instrucciones (ej: CBU, alias, etc.)"
                        value={newPayment.instructions}
                        onChange={e => setNewPayment(prev => ({ ...prev, instructions: e.target.value }))}
                        className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (newPayment.name) {
                          setPaymentMethods(prev => [...prev, {
                            id: Date.now().toString(),
                            name: newPayment.name,
                            icon: newPayment.icon,
                            enabled: true,
                            instructions: newPayment.instructions
                          }]);
                          setNewPayment({ name: '', icon: 'credit_card', instructions: '' });
                        }
                      }}
                      className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                      Agregar Método
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600">info</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Información de la Tienda</h3>
                    <p className="text-xs text-slate-500">Datos que aparecerán en facturas y comunicaciones</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                    <input
                      type="text"
                      defaultValue="Despensa & Dietética 1982"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CUIT</label>
                    <input
                      type="text"
                      defaultValue="20-12345678-9"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email de Contacto</label>
                    <input
                      type="email"
                      defaultValue="hola@despensa1982.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</label>
                    <input
                      type="tel"
                      defaultValue="+54 9 11 1234-5678"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección</label>
                    <input
                      type="text"
                      defaultValue="Av. Principal 1234, Local 5, Buenos Aires, Argentina"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg">save</span>
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Inventario</h2>
                  <p className="text-slate-500 font-medium text-sm mt-1">Monitorea y actualiza tu catálogo de productos en tiempo real.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleExportCSV} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">download</span>
                    Exportar CSV
                  </button>
                  <button
                    onClick={() => { if (isAdding) setEditingProduct(null); setIsAdding(!isAdding); }}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">{isAdding ? 'close' : 'add'}</span>
                    {isAdding ? 'Cerrar' : 'Agregar Producto'}
                  </button>
                </div>
              </div>

              {isAdding && (
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">{editingProduct ? 'edit' : 'add_box'}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      {editingProduct ? `Editando: ${editingProduct.name}` : 'Nuevo Registro de Producto'}
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                      <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-bold" placeholder="Ej. Miel de Caña" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código SKU</label>
                      <input name="sku" required value={formData.sku} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-bold" placeholder="COD-123" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-bold cursor-pointer">
                        <option>Pantry Essentials</option>
                        <option>Dietetic & Bio</option>
                        <option>Gluten-Free</option>
                        <option>Vegan Options</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio ($)</label>
                      <input name="price" required type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-bold" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                      <input name="stock" required type="number" value={formData.stock} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-bold" placeholder="0" />
                    </div>

                    {/* Image Upload Section */}
                    <div className="md:col-span-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Imágenes del Producto ({productImages.length}/{MAX_IMAGES})
                          </label>
                          {productImages.length > 1 && (
                            <span className="text-[9px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              ↔ Arrastra para reordenar
                            </span>
                          )}
                        </div>
                        {productImages.length >= MAX_IMAGES && (
                          <span className="text-[10px] font-bold text-amber-500">Máximo alcanzado</span>
                        )}
                      </div>

                      {/* Drag & Drop Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${isDraggingOver
                          ? 'border-primary bg-primary/5 scale-[1.02]'
                          : 'border-slate-200 bg-slate-50/50'
                          } ${productImages.length === 0 ? 'min-h-[200px]' : 'p-4'}`}
                      >
                        {/* Drag overlay */}
                        {isDraggingOver && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-2xl z-10">
                            <div className="text-center">
                              <span className="material-symbols-outlined text-5xl text-primary mb-2 animate-bounce">cloud_upload</span>
                              <p className="text-sm font-black text-primary">Suelta las imágenes aquí</p>
                            </div>
                          </div>
                        )}

                        {/* Empty state */}
                        {productImages.length === 0 && !isDraggingOver && (
                          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">add_photo_alternate</span>
                            <p className="text-sm font-bold text-slate-500">Arrastra imágenes aquí o haz clic para subir</p>
                            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG hasta 4 imágenes</p>
                          </label>
                        )}

                        {/* Image Previews Grid */}
                        {productImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {productImages.map((img, index) => (
                              <div
                                key={index}
                                draggable
                                onDragStart={() => handleImageDragStart(index)}
                                onDragOver={(e) => handleImageDragOver(e, index)}
                                onDragEnd={handleImageDragEnd}
                                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 bg-white cursor-grab active:cursor-grabbing transition-all duration-200 ${draggedIndex === index
                                  ? 'border-primary scale-105 shadow-xl opacity-80 rotate-2'
                                  : 'border-slate-100 hover:border-primary/30 hover:shadow-lg'
                                  }`}
                              >
                                <img src={img} alt={`Producto ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />

                                {/* Drag Handle */}
                                <div className="absolute top-2 left-2 size-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow cursor-grab">
                                  <span className="material-symbols-outlined text-slate-400 text-sm">drag_indicator</span>
                                </div>

                                {/* Remove Button */}
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(index)}
                                  className="absolute top-2 right-2 size-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>

                                {/* Image label */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-white uppercase">
                                      {index === 0 ? '★ Principal' : `Imagen ${index + 1}`}
                                    </span>
                                    {index === 0 && (
                                      <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">COVER</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add More Image Slot */}
                            {productImages.length < MAX_IMAGES && (
                              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary/30 transition-all group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <span className="material-symbols-outlined text-2xl text-slate-300 group-hover:text-primary transition-colors mb-1">add</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Agregar</span>
                              </label>
                            )}
                          </div>
                        )}
                      </div>

                      {/* URL Input Alternative */}
                      {productImages.length < MAX_IMAGES && (
                        <div className="flex gap-3">
                          <input
                            id="imageUrlInput"
                            type="url"
                            placeholder="O ingresa una URL de imagen..."
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                handleImageAdd(input.value);
                                input.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                              handleImageAdd(input.value);
                              input.value = '';
                            }}
                            className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-300 transition-all flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-lg">link</span>
                            Agregar URL
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 flex items-end">
                      <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-lg uppercase tracking-widest text-sm">
                        {editingProduct ? 'Guardar Cambios' : 'Registrar Producto'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                        <th className="px-10 py-5">Info Producto</th>
                        <th className="px-8 py-5 text-center">Categoría</th>
                        <th className="px-8 py-5 text-center">Valor</th>
                        <th className="px-8 py-5 text-center">Stock</th>
                        <th className="px-8 py-5 text-center">Estatus</th>
                        <th className="px-10 py-5 text-right">Gestión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedData.map((p: any, idx: number) => (
                        <tr key={p.id} className={`transition-all group border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} ${p.status === 'Low Stock' ? 'hover:bg-red-50/50' : 'hover:bg-primary/5'}`}>
                          <td className="px-10 py-5 relative">
                            {p.status === 'Low Stock' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'} alt={p.name} className="size-12 rounded-xl object-cover shadow-sm ring-1 ring-slate-100" />
                                {p.images?.length > 1 && (
                                  <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow">
                                    +{p.images.length - 1}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-tight">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{p.sku}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="text-[10px] font-black text-slate-500 bg-slate-200/50 px-3 py-1.5 rounded-lg uppercase">{p.category}</span>
                          </td>
                          <td className="px-8 py-5 text-center text-sm font-black text-slate-900">{formatPrice(p.price)}</td>
                          <td className="px-8 py-5 text-center text-sm font-black text-slate-900">
                            <span className={p.status === 'Low Stock' ? 'text-red-600' : ''}>{p.stock}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${p.status === 'In Stock' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                              <span className={`size-1.5 rounded-full ${p.status === 'In Stock' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                              {p.status === 'In Stock' ? 'Disponible' : 'Stock Crítico'}
                            </span>
                          </td>
                          <td className="px-10 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <button onClick={() => handleEdit(p)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm"><span className="material-symbols-outlined text-lg">edit</span></button>
                              <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm"><span className="material-symbols-outlined text-lg">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'configuracion' && (
            <div className="px-10 py-6 flex items-center justify-between bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Mostrando <span className="font-black text-slate-900">{paginatedData.length}</span> de <span className="font-black text-slate-900">{filtered.length}</span> registros</p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`px-4 py-2 text-xs font-black rounded-lg border transition-all ${currentPage === 1 ? 'text-slate-200 border-slate-100' : 'text-slate-400 border-slate-200 hover:text-slate-700 bg-white hover:border-slate-300'}`}
                >Anterior</button>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${currentPage === totalPages || totalPages === 0 ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-md shadow-slate-900/10'}`}
                >Siguiente</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
