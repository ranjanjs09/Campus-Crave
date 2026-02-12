
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, User, UserRole, OrderStatus, Product, Vendor } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, VENDORS as INITIAL_VENDORS, MOCK_USERS } from './constants';

type UserWithPassword = User & { password: string };

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  products: Product[];
  vendors: Vendor[];
  users: UserWithPassword[];
  addProduct: (product: Omit<Product, 'id' | 'isAvailable' | 'image'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  toggleProductAvailability: (productId: string) => void;
  updateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
  placeOrder: (address: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, deliveryId?: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<UserWithPassword, 'id' | 'avatar'>) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [users, setUsers] = useState<UserWithPassword[]>(MOCK_USERS);

  // Load initial state from local storage
  useEffect(() => {
    const savedOrders = localStorage.getItem('cc_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedProducts = localStorage.getItem('cc_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));

    const savedVendors = localStorage.getItem('cc_vendors');
    if (savedVendors) setVendors(JSON.parse(savedVendors));

    const savedUsers = localStorage.getItem('cc_users_list');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedUser = localStorage.getItem('cc_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('cc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cc_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('cc_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cc_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<UserWithPassword, 'id' | 'avatar'>): Promise<boolean> => {
    const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) return false;

    const newUser: UserWithPassword = {
      ...userData,
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
      vendorId: userData.role === UserRole.VENDOR ? 'v1' : undefined // Default to v1 for demo
    };

    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

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

  const addProduct = (newProdData: Omit<Product, 'id' | 'isAvailable' | 'image'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      isAvailable: true,
      image: `https://picsum.photos/seed/${Math.random()}/200/200`
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  const updateVendor = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updates } : v));
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
      orders, products, vendors, users, addProduct, updateProduct, toggleProductAvailability,
      updateVendor, placeOrder, updateOrderStatus, login, register, logout
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
