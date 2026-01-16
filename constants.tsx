
import { Product, Sale } from './types';

// Helper for formatting prices
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aceite de Oliva Extra Virgen',
    category: 'Pantry Essentials',
    price: 18900,
    weight: '750ml • Acidez <0.5%',
    description: 'Aceite de oliva virgen extra de primera prensada en frío. Notas frutadas y picor equilibrado.',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    sku: 'OL-105',
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'Té Matcha Ceremonial',
    category: 'Dietetic & Bio',
    price: 24500,
    weight: '50g • Japón',
    description: 'Polvo de té verde grado ceremonial importado de Japón. Antioxidante natural y energizante.',
    images: [
      'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'NUEVO',
    stock: 10,
    sku: 'MA-013',
    status: 'In Stock'
  },
  {
    id: '3',
    name: 'Café de Especialidad',
    category: 'Pantry Essentials',
    price: 21000,
    weight: '250g • En Grano',
    description: 'Café tostado artesanalmente. Notas a chocolate y caramelo. 100% Arábica de altura.',
    images: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    sku: 'CF-016',
    status: 'In Stock'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'ORD-001',
    customerName: 'Juan Pérez',
    customerPhone: '1122334455',
    date: new Date().toISOString(),
    total: 31400,
    paymentMethod: 'Mercado Pago',
    shippingMethod: 'Envío',
    status: 'Entregado',
    items: [
      { productName: 'Granola Artesanal Miel y Nueces', quantity: 2, price: 12500 },
      { productName: 'Harina de Avena Integral', quantity: 1, price: 6400 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'María García',
    customerPhone: '1199887766',
    date: new Date(Date.now() - 86400000).toISOString(),
    total: 18900,
    paymentMethod: 'Transferencia',
    shippingMethod: 'Retiro',
    status: 'Pendiente',
    items: [
      { productName: 'Aceite de Oliva Extra Virgen', quantity: 1, price: 18900 }
    ]
  },
  {
    id: 'ORD-003',
    customerName: 'Carlos Rodríguez',
    customerPhone: '1155443322',
    date: new Date(Date.now() - 172800000).toISOString(),
    total: 45300,
    paymentMethod: 'Mercado Pago',
    shippingMethod: 'Envío',
    status: 'Enviado',
    items: [
      { productName: 'Mix de Frutos Secos', quantity: 2, price: 11500 },
      { productName: 'Miel Pura de Montaña', quantity: 1, price: 14900 },
      { productName: 'Semillas de Chía', quantity: 1, price: 7900 }
    ]
  }
];
