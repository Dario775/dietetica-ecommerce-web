
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  weight: string;
  description: string;
  images: string[]; // Up to 4 images
  tag?: string;
  stock: number;
  sku: string;
  status: 'In Stock' | 'Low Stock' | 'Hidden';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SaleItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  total: number;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  status: 'Pendiente' | 'Enviado' | 'Entregado' | 'Cancelado';
}

export type PaymentMethod = 'Mercado Pago' | 'Transferencia' | 'Efectivo';
export type ShippingMethod = 'Envío' | 'Retiro';
