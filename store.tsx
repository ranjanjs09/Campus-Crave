
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, User, UserRole, OrderStatus, Product } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  products: Product[];
  // Fix: Changed Omit to also exclude 'image' as it's generated internally by addProduct
  addProduct: (product: Omit<Product, 'id' | 'isAvailable' | 'image'>) => void;
  toggleProductAvailability: (productId: string) => void;
  placeOrder: (address: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, deliveryId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Load initial state from local storage
  useEffect(() => {
    const savedOrders = localStorage.getItem('cc_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedProducts = localStorage.getItem('cc_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem('cc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cc_products', JSON.stringify(products));
  }, [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Fix: Update parameter type to omit 'image' which is generated below
  const addProduct = (newProdData: Omit<Product, 'id' | 'isAvailable' | 'image'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      isAvailable: true,
      image: `https://picsum.photos/seed/${Math.random()}/200/200`
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  const placeOrder = (address: string) => {
    if (!currentUser || cart.length === 0) return;
    
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      studentId: currentUser.id,
      vendorId: cart[0].vendorId,
      items: [...cart],
      totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      deliveryAddress: address,
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, deliveryId?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status, deliveryId: deliveryId || order.deliveryId } : order
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      cart, addToCart, removeFromCart, clearCart,
      orders, products, addProduct, toggleProductAvailability,
      placeOrder, updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
