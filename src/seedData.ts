import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES = [
  { name: 'Groceries', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200', isActive: true },
  { name: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=200', isActive: true },
  { name: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200', isActive: true },
];

const PRODUCTS = [
  { name: 'Fresh Apples', category: 'Groceries', price: 120, stockQuantity: 50, rating: 4.8, reviewCount: 124, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?auto=format&fit=crop&q=80&w=300', isActive: true },
  { name: 'Potato Chips', category: 'Snacks', price: 40, stockQuantity: 100, rating: 4.2, reviewCount: 89, imageUrl: 'https://images.unsplash.com/photo-1566478989037-e924ee24ba8a?auto=format&fit=crop&q=80&w=300', isActive: true },
  { name: 'Cola Can 330ml', category: 'Beverages', price: 35, stockQuantity: 200, rating: 4.5, reviewCount: 412, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300', isActive: true },
  { name: 'Milk 1L', category: 'Groceries', price: 65, stockQuantity: 30, rating: 4.9, reviewCount: 230, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300', isActive: true },
];

const BANNERS = [
  { title: 'Fresh Sale', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', isActive: true }
];

export const seedDatabase = async () => {
  if (!db) return;
  
  try {
    // Check if data exists
    const catSnapshot = await getDocs(collection(db, 'categories'));
    if (!catSnapshot.empty) {
      alert("Database is already seeded!");
      return;
    }

    // Add Categories
    for (const cat of CATEGORIES) {
      await addDoc(collection(db, 'categories'), cat);
    }
    
    // Add Products
    for (const prod of PRODUCTS) {
      await addDoc(collection(db, 'products'), prod);
    }

    // Add Banners
    for (const banner of BANNERS) {
      await addDoc(collection(db, 'banners'), banner);
    }

    alert("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    alert("Error seeding database.");
  }
};
