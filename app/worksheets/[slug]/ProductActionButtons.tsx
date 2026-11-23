'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Worksheet } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductActionButtons({ worksheet }: { worksheet: Worksheet }) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const alreadyInCart = isInCart(worksheet.id);

  const handleAddToCart = () => {
    addItem(worksheet);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(worksheet);
    router.push('/checkout');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleBuyNow}
        className="btn btn-gold btn-lg"
        style={{ width: '100%' }}
      >
        <Zap size={18} /> Buy Now & Download
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        className={`btn btn-lg ${alreadyInCart ? 'btn-outline' : 'btn-primary'}`}
        style={{ width: '100%' }}
        disabled={alreadyInCart}
      >
        {justAdded ? (
          <>
            <Check size={18} color="var(--success)" /> Added to Cart
          </>
        ) : alreadyInCart ? (
          'Already in Cart'
        ) : (
          <>
            <ShoppingBag size={18} /> Add to Cart
          </>
        )}
      </motion.button>
    </div>
  );
}
