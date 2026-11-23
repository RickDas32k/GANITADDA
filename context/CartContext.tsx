'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Worksheet, Coupon } from '@/lib/types';

interface CartContextType {
  items: Worksheet[];
  addItem: (worksheet: Worksheet) => void;
  removeItem: (worksheetId: string) => void;
  clearCart: () => void;
  isInCart: (worksheetId: string) => boolean;
  coupon: Coupon | null;
  couponDiscountPaise: number;
  couponMessage: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotalPaise: number;
  totalPaise: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ga_cart_v1';
const COUPON_STORAGE_KEY = 'ga_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Worksheet[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponDiscountPaise, setCouponDiscountPaise] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
    setLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  }, [items, loaded]);

  const subtotalPaise = items.reduce((sum, item) => sum + (item.price_paise || 0), 0);

  // Re-calculate coupon discount whenever subtotal changes
  useEffect(() => {
    if (!coupon) {
      setCouponDiscountPaise(0);
      return;
    }
    if (subtotalPaise < coupon.min_order_paise) {
      setCouponDiscountPaise(0);
      setCouponError(`Min order amount of ₹${(coupon.min_order_paise / 100).toFixed(0)} required`);
      return;
    }
    setCouponError(null);
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotalPaise * Number(coupon.discount_value)) / 100);
      if (coupon.max_discount_paise && discount > coupon.max_discount_paise) {
        discount = coupon.max_discount_paise;
      }
    } else {
      discount = Math.round(Number(coupon.discount_value));
    }
    setCouponDiscountPaise(Math.min(discount, subtotalPaise));
  }, [coupon, subtotalPaise]);

  const totalPaise = Math.max(0, subtotalPaise - couponDiscountPaise);

  const addItem = (worksheet: Worksheet) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === worksheet.id)) return prev;
      return [...prev, worksheet];
    });
  };

  const removeItem = (worksheetId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== worksheetId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponDiscountPaise(0);
    setCouponMessage(null);
    setCouponError(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const isInCart = (worksheetId: string) => {
    return items.some((item) => item.id === worksheetId);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    setCouponMessage(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalPaise }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.message || 'Invalid coupon code');
        return false;
      }
      setCoupon(data.coupon);
      setCouponDiscountPaise(data.discountPaise);
      setCouponMessage(data.message);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(data.coupon));
      } catch {}
      return true;
    } catch {
      setCouponError('Network error while validating coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponDiscountPaise(0);
    setCouponMessage(null);
    setCouponError(null);
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        coupon,
        couponDiscountPaise,
        couponMessage,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotalPaise,
        totalPaise,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
