
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-[#1a2625] to-[#0f1716] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <span className="material-symbols-outlined text-sm">mail</span>
                Newsletter
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">Únete a nuestra comunidad</h3>
              <p className="text-gray-400 max-w-md">Recibe ofertas exclusivas, recetas saludables y novedades directo en tu correo.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="pl-12 pr-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary w-full sm:w-80 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-black hover:shadow-lg hover:shadow-primary/30 transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                Suscribirme
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105 bg-white">
                <img
                  src="/logo.png"
                  alt="Despensa & Dietética 1982"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase">Despensa & Dietética</span>
                <span className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Desde 1982</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Desde 1982 seleccionando lo mejor de la naturaleza para tu hogar. Alimentos naturales para una vida más sana.
            </p>
            <div className="flex gap-3">
              {['facebook', 'rss_feed', 'mail'].map((icon, i) => (
                <button
                  key={i}
                  className="size-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Tienda</h3>
            <ul className="space-y-3">
              {['Catálogo Completo', 'Ofertas del Mes', 'Novedades', 'Más Vendidos'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-400 hover:text-primary text-sm transition-colors flex items-center gap-2 group">
                    <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">chevron_right</span>
                    <span className="-ml-4 group-hover:ml-0 transition-all">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Ayuda</h3>
            <ul className="space-y-3">
              {['Cómo Comprar', 'Envíos', 'Devoluciones', 'Preguntas Frecuentes'].map((item) => (
                <li key={item}>
                  <a className="text-gray-400 hover:text-primary text-sm transition-colors flex items-center gap-2 group" href="#">
                    <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">chevron_right</span>
                    <span className="-ml-4 group-hover:ml-0 transition-all">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Empresa</h3>
            <ul className="space-y-3">
              {['Sobre Nosotros', 'Nuestra Historia', 'Sustentabilidad', 'Trabaja con Nosotros'].map((item) => (
                <li key={item}>
                  <a className="text-gray-400 hover:text-primary text-sm transition-colors flex items-center gap-2 group" href="#">
                    <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">chevron_right</span>
                    <span className="-ml-4 group-hover:ml-0 transition-all">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                <span className="text-gray-400 text-sm">Av. Principal 1234, Local 5<br />Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">phone</span>
                <a href="tel:+5491112345678" className="text-gray-400 hover:text-white text-sm transition-colors">+54 9 11 1234-5678</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                <a href="mailto:hola@despensa1982.com" className="text-gray-400 hover:text-white text-sm transition-colors">hola@despensa1982.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                <span className="text-gray-400 text-sm">Lun-Sáb: 9:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © 2024 Despensa & Dietética 1982. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Términos', 'Privacidad', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{item}</a>
              ))}
            </div>
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">Pagos seguros:</span>
              {['credit_card', 'account_balance', 'qr_code_scanner'].map((icon, i) => (
                <div key={i} className="size-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-gray-400">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
