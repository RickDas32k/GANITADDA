'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Worksheet } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, Eye, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorksheetCard({ worksheet }: { worksheet: Worksheet }) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const alreadyInCart = isInCart(worksheet.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(worksheet);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const difficultyColors = {
    Easy: 'badge-green',
    Medium: 'badge-gold',
    Hard: 'badge-maroon',
  };

  return (
    <article className="worksheet-card">
      <div className="worksheet-card-header">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-maroon">Class {worksheet.class_level}</span>
          <span className={`badge ${difficultyColors[worksheet.difficulty] || 'badge-gold'}`}>
            {worksheet.difficulty}
          </span>
          {worksheet.is_bestseller && (
            <span className="badge badge-gold" style={{ background: '#fcedcc' }}>
              ★ Bestseller
            </span>
          )}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
          {worksheet.number_of_pages} Pages
        </div>
      </div>

      <div className="worksheet-card-body">
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
          {worksheet.chapter}
        </div>
        <h3 style={{ margin: '0 0 10px', fontSize: '17.5px', color: 'var(--maroon)', lineHeight: 1.35, fontWeight: 700 }}>
          <Link href={`/worksheets/${worksheet.slug || worksheet.id}`} style={{ color: 'inherit' }}>
            {worksheet.title}
          </Link>
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {worksheet.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={14} color="var(--gold-dark)" /> {worksheet.number_of_questions || 30}+ Questions
          </span>
          <span>•</span>
          <span>Verified Solutions</span>
        </div>
      </div>

      <div className="worksheet-card-footer">
        <div className="price-tag">
          {worksheet.is_free || (worksheet.price_paise || 0) === 0 ? (
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>
              FREE
            </span>
          ) : (
            <>
              <span className="price-current">
                ₹{((worksheet.price_paise || 0) / 100).toFixed(0)}
              </span>
              {worksheet.original_price_paise && worksheet.original_price_paise > (worksheet.price_paise || 0) && (
                <span className="price-original">
                  ₹{((worksheet.original_price_paise || 0) / 100).toFixed(0)}
                </span>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href={`/worksheets/${worksheet.slug || worksheet.id}`}
            className="btn btn-ghost btn-sm"
            style={{ padding: '8px 12px' }}
            title="View Details"
          >
            <Eye size={16} />
          </Link>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            className={`btn btn-sm ${alreadyInCart ? 'btn-outline' : 'btn-primary'}`}
            disabled={alreadyInCart}
            style={{ minWidth: '108px' }}
          >
            {justAdded ? (
              <>
                <Check size={15} color="var(--success)" /> Added
              </>
            ) : alreadyInCart ? (
              'In Cart'
            ) : worksheet.is_free ? (
              'Get Free'
            ) : (
              <>
                <ShoppingBag size={14} /> Add to Cart
              </>
            )}
          </motion.button>
        </div>
      </div>
    </article>
  );
}
