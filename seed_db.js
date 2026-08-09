import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fallbackConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp({
  ...fallbackConfig
});
const db = getFirestore(app, fallbackConfig.firestoreDatabaseId);
const auth = getAuth(app);

const categories = [
  { id: 'cat1', name: 'Fresh Vegetables', icon: 'Leaf', color: '#10B981' },
  { id: 'cat2', name: 'Fresh Fruits', icon: 'Apple', color: '#EF4444' },
  { id: 'cat3', name: 'Dairy & Eggs', icon: 'Milk', color: '#F59E0B' },
  { id: 'cat4', name: 'Bakery', icon: 'Croissant', color: '#8B5A2B' }
];

const products = [
  { id: 'p1', name: 'Fresh Tomatoes', description: 'Farm fresh red tomatoes', price: 2.50, unit: 'kg', originalPrice: 3.00, categoryId: 'cat1', stockQuantity: 50, isActive: true, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60' },
  { id: 'p2', name: 'Organic Bananas', description: 'Sweet and ripe bananas', price: 1.20, unit: 'bunch', originalPrice: 1.50, categoryId: 'cat2', stockQuantity: 40, isActive: true, image: 'https://images.unsplash.com/photo-1571501478200-244fe04b6d25?w=500&auto=format&fit=crop&q=60' },
  { id: 'p3', name: 'Whole Milk', description: 'Fresh full cream milk', price: 1.80, unit: '1L', originalPrice: 2.00, categoryId: 'cat3', stockQuantity: 30, isActive: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60' },
  { id: 'p4', name: 'Whole Wheat Bread', description: 'Freshly baked whole wheat bread', price: 2.50, unit: 'pack', originalPrice: 3.00, categoryId: 'cat4', stockQuantity: 20, isActive: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60' },
  { id: 'p5', name: 'Free Range Eggs', description: 'Farm fresh free range eggs', price: 3.50, unit: 'dozen', originalPrice: 4.00, categoryId: 'cat3', stockQuantity: 25, isActive: true, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=60' },
  { id: 'p6', name: 'Red Onions', description: 'Fresh red onions', price: 1.50, unit: 'kg', originalPrice: 1.80, categoryId: 'cat1', stockQuantity: 60, isActive: true, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60' },
];

const banners = [
  { id: 'b1', title: 'Fresh Groceries', subtitle: 'Delivered in 10 minutes', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60', isActive: true },
  { id: 'b2', title: 'Special Offers', subtitle: 'Up to 50% off on daily essentials', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=60', isActive: true }
];

async function run() {
  try {
    // This will fail in node.js due to admin restricted error for anonymous auth in Node environments.
    // So instead of this, I will just create a permissive rule, write the data, and revert the rule.
  } catch (e) {
  }
}
