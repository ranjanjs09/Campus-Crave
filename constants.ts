
import { Vendor, Product } from './types';

export const VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Academic Canteen',
    location: 'Block A, Ground Floor',
    image: 'https://picsum.photos/seed/v1/400/300',
    rating: 4.5,
    estimatedTime: '15-20 min',
    isOpen: true
  },
  {
    id: 'v2',
    name: 'Spicy Bites (Hostel 4)',
    location: 'Nearby Boys Hostel 4',
    image: 'https://picsum.photos/seed/v2/400/300',
    rating: 4.2,
    estimatedTime: '10-15 min',
    isOpen: true
  },
  {
    id: 'v3',
    name: 'Juice Junction',
    location: 'Main Gate Complex',
    image: 'https://picsum.photos/seed/v3/400/300',
    rating: 4.8,
    estimatedTime: '5-10 min',
    isOpen: true
  },
  {
    id: 'v4',
    name: 'Stationary & Essentials',
    location: 'Central Library Basement',
    image: 'https://picsum.photos/seed/v4/400/300',
    rating: 4.0,
    estimatedTime: '20-30 min',
    isOpen: true
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Paneer Butter Masala',
    price: 180,
    description: 'Creamy paneer cubes in rich tomato gravy.',
    category: 'Main Course',
    image: 'https://picsum.photos/seed/p1/200/200',
    isAvailable: true
  },
  {
    id: 'p2',
    vendorId: 'v1',
    name: 'Butter Naan',
    price: 40,
    description: 'Freshly baked tandoori bread with butter.',
    category: 'Bread',
    image: 'https://picsum.photos/seed/p2/200/200',
    isAvailable: true
  },
  {
    id: 'p3',
    vendorId: 'v2',
    name: 'Chicken Biryani',
    price: 220,
    description: 'Hyderabadi style spicy chicken biryani.',
    category: 'Rice',
    image: 'https://picsum.photos/seed/p3/200/200',
    isAvailable: true
  },
  {
    id: 'p4',
    vendorId: 'v3',
    name: 'Mixed Fruit Juice',
    price: 60,
    description: 'Fresh blend of seasonal fruits.',
    category: 'Beverage',
    image: 'https://picsum.photos/seed/p4/200/200',
    isAvailable: true
  },
  {
    id: 'p5',
    vendorId: 'v4',
    name: 'Register (120 Pages)',
    price: 55,
    description: 'Hardbound A4 size register.',
    category: 'Retail',
    image: 'https://picsum.photos/seed/p5/200/200',
    isAvailable: true
  }
];
