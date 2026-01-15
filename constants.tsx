
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
    name: 'Granola Artesanal Miel y Nueces',
    category: 'Pantry Essentials',
    price: 12500,
    oldPrice: 15000,
    weight: '500g • Orgánica',
    description: 'Nuestra granola estrella horneada lentamente con miel pura de abejas y nueces seleccionadas.',
    images: [
      'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'BEST SELLER',
    stock: 45,
    sku: 'GR-001',
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'Almendras Naturales Premium',
    category: 'Dietetic & Bio',
    price: 8500,
    oldPrice: 10000,
    weight: '250g • Crudas',
    description: 'Almendras seleccionadas de primera calidad, perfectas para snacks saludables.',
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'SALE -15%',
    stock: 12,
    sku: 'AL-042',
    status: 'In Stock'
  },
  {
    id: '3',
    name: 'Aceite de Oliva Extra Virgen',
    category: 'Pantry Essentials',
    price: 18900,
    weight: '750ml • Prensado en Frío',
    description: 'Aceite de oliva virgen extra de cosecha temprana, ideal para ensaladas y cocina gourmet.',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    sku: 'OL-105',
    status: 'In Stock'
  },
  {
    id: '4',
    name: 'Harina de Avena Integral',
    category: 'Gluten-Free',
    price: 6500,
    weight: '1kg • Sin TACC',
    description: 'Harina de avena certificada sin gluten, perfecta para panqueques y repostería.',
    images: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'GLUTEN-FREE',
    stock: 15,
    sku: 'FL-002',
    status: 'In Stock'
  },
  {
    id: '5',
    name: 'Miel Pura de Montaña',
    category: 'Pantry Essentials',
    price: 14900,
    weight: '500g • Orgánica',
    description: 'Miel 100% pura de abejas, cosechada en las montañas de manera artesanal.',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'ORGÁNICO',
    stock: 30,
    sku: 'MI-003',
    status: 'In Stock'
  },
  {
    id: '6',
    name: 'Quinoa Blanca Premium',
    category: 'Gluten-Free',
    price: 9900,
    weight: '500g • Sin TACC',
    description: 'Quinoa blanca de grano entero, fuente de proteínas y fibra.',
    images: [
      'https://images.unsplash.com/photo-1612257416648-ee7a6c5a5b6f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    sku: 'QU-004',
    status: 'In Stock'
  },
  {
    id: '7',
    name: 'Mix de Frutos Secos',
    category: 'Dietetic & Bio',
    price: 11500,
    oldPrice: 13000,
    weight: '300g • Natural',
    description: 'Mezcla de almendras, nueces, castañas de cajú y pasas de uva.',
    images: [
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'POPULAR',
    stock: 40,
    sku: 'MX-005',
    status: 'In Stock'
  },
  {
    id: '8',
    name: 'Semillas de Chía',
    category: 'Dietetic & Bio',
    price: 7900,
    weight: '250g • Orgánicas',
    description: 'Semillas de chía ricas en omega-3 y fibra, perfectas para smoothies.',
    images: [
      'https://images.unsplash.com/photo-1541990554162-6d33c52fd8ab?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 35,
    sku: 'CH-006',
    status: 'In Stock'
  },
  {
    id: '9',
    name: 'Pasta de Maní Natural',
    category: 'Vegan Options',
    price: 8900,
    weight: '350g • Sin Azúcar',
    description: 'Mantequilla de maní 100% natural, sin azúcar añadida ni conservantes.',
    images: [
      'https://images.unsplash.com/photo-1597079910443-60c43fc2e3d1?w=800&auto=format&fit=crop&q=80'
    ],
    tag: 'VEGANO',
    stock: 22,
    sku: 'PM-007',
    status: 'In Stock'
  },
  {
    id: '10',
    name: 'Leche de Almendras',
    category: 'Vegan Options',
    price: 5900,
    weight: '1L • Sin Lactosa',
    description: 'Bebida vegetal de almendras, sin lactosa y fortificada con calcio.',
    images: [
      'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 50,
    sku: 'LA-008',
    status: 'In Stock'
  },
  {
    id: '11',
    name: 'Arroz Integral Orgánico',
    category: 'Pantry Essentials',
    price: 4500,
    weight: '1kg • Grano Largo',
    description: 'Arroz integral de cultivo orgánico, alto en fibra y nutrientes.',
    images: [
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 60,
    sku: 'AR-009',
    status: 'In Stock'
  },
  {
    id: '12',
    name: 'Avena Instantánea',
    category: 'Gluten-Free',
    price: 5500,
    weight: '500g • Sin TACC',
    description: 'Avena instantánea certificada sin gluten, lista en minutos.',
    images: [
      'https://images.unsplash.com/photo-1490567674939-d8c9b8b3d5d5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    sku: 'AV-010',
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
