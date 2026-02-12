
export enum UserRole {
  STUDENT = 'STUDENT',
  VENDOR = 'VENDOR',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  vendorId: string;
  isAvailable: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  estimatedTime: string;
  isOpen: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  studentId: string;
  vendorId: string;
  deliveryId?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  otp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  vendorId?: string; // Only for vendors
}
