
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem, ShippingMethod, PaymentMethod } from '../types';
import { formatPrice } from '../constants';

interface CheckoutPageProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const [shipping, setShipping] = useState<ShippingMethod>('Envío');
  const [payment, setPayment] = useState<PaymentMethod>('Mercado Pago');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shipping === 'Envío' ? 500 : 0;
  const discount = payment === 'Transferencia' ? subtotal * 0.05 : 0;
  const total = subtotal + shippingCost - discount;

  const handleConfirmOrder = () => {
    if (!name || (shipping === 'Envío' && !address)) {
      alert('Por favor, completa tus datos para continuar.');
      return;
    }

    const cartText = cart.map(item => `- ${item.name} (${item.quantity}x) : ${formatPrice(item.price * item.quantity)}`).join('\n');
    const message = `¡Hola Despensa 1982! Quisiera realizar un pedido:
    
*Cliente:* ${name}
*Teléfono:* ${phone}
*Entrega:* ${shipping} ${shipping === 'Envío' ? `(Dirección: ${address})` : ''}
*Pago:* ${payment}

*Detalle:*
${cartText}

*Total:* ${formatPrice(total)}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5491122334455?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center flex flex-col items-center gap-6">
        <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <span className="material-symbols-outlined text-5xl">shopping_cart_off</span>
        </div>
        <div>
          <h1 className="text-3xl font-black dark:text-white">Tu carrito está vacío</h1>
          <p className="text-text-muted mt-2">Parece que aún no has agregado productos de nuestra despensa.</p>
        </div>
        <Link to="/shop" className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-primary-dark transition-all">
          Explorar Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight text-text-main dark:text-white">Tu Pedido</h1>
            <span className="text-sm font-bold text-primary bg-primary/5 px-4 py-1.5 rounded-full">
              {cart.length} productos
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all group">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <img src={item.images?.[0]} alt={item.name} className="rounded-2xl size-36 object-cover shadow-sm border border-gray-100" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">{item.category}</span>
                        <h3 className="text-xl font-black text-text-main dark:text-white leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-400 font-medium">{item.weight}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-4 mt-6">
                      <div className="flex items-center bg-[#f0f4f3] dark:bg-gray-800 rounded-2xl p-1.5 ring-1 ring-gray-100 dark:ring-gray-700">
                        <button onClick={() => updateQuantity(item.id, -1)} className="size-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 shadow-sm transition text-text-main dark:text-white">
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="w-12 text-center font-black dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="size-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-700 shadow-sm transition text-text-main dark:text-white">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-text-main dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="bg-[#f0f4f3] dark:bg-gray-800 px-8 py-8 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-black dark:text-white">Finalizar Compra</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Completa tus datos para el envío</p>
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nombre y Apellido</label>
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ej: Juan Pérez" className="w-full rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-4 px-5 dark:text-white focus:ring-primary focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Celular de Contacto</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Ej: 11 1234 5678" className="w-full rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-4 px-5 dark:text-white focus:ring-primary focus:border-primary transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(['Envío', 'Retiro'] as ShippingMethod[]).map(method => (
                    <button key={method} onClick={() => setShipping(method)} className={`p-4 rounded-2xl border-2 font-black text-xs transition-all ${shipping === method ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 dark:border-gray-800 text-gray-400'}`}>
                      {method} {method === 'Envío' ? '+$500' : '(Gratis)'}
                    </button>
                  ))}
                </div>

                {shipping === 'Envío' && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Dirección de Entrega</label>
                    <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder="Calle, número, depto..." className="w-full rounded-2xl border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm py-4 px-5 dark:text-white focus:ring-primary focus:border-primary transition-all" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Forma de Pago</p>
                <div className="grid grid-cols-1 gap-2">
                  {(['Mercado Pago', 'Transferencia', 'Efectivo'] as PaymentMethod[]).map(method => (
                    <button key={method} onClick={() => setPayment(method)} className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all ${payment === method ? 'border-primary bg-primary/5' : 'border-gray-50 dark:border-gray-800'}`}>
                      <span className={`text-sm font-black ${payment === method ? 'text-primary' : 'text-gray-500 dark:text-white'}`}>{method}</span>
                      {method === 'Transferencia' && <span className="text-[9px] bg-green-500 text-white font-black px-2 py-1 rounded-lg uppercase tracking-widest">-5% OFF</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-sm text-gray-500 font-bold"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-gray-500 font-bold"><span>Envío</span><span>+{formatPrice(shippingCost)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sm text-green-500 font-black"><span>Bonificación Pago</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between items-end pt-4">
                  <span className="text-xl font-black dark:text-white uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <button onClick={handleConfirmOrder} className="w-full bg-primary hover:bg-primary-dark text-white rounded-[1.25rem] py-6 font-black text-lg shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4">
                <span className="material-symbols-outlined fill-current text-2xl">chat</span>
                Confirmar por WhatsApp
              </button>

              <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                Serás redirigido para coordinar los detalles finales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
