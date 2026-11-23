'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Worksheet, ClassLevel, DifficultyLevel } from '@/lib/types';
import WorksheetCard from '@/components/WorksheetCard';
import { Search, SlidersHorizontal, Grid, List, Sparkles, Filter, X } from 'lucide-react';

export default function WorksheetsMarketplacePage() {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/worksheets')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setWorksheets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load worksheets', err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return worksheets
      .filter((w) => {
        if (selectedClass !== 'all' && w.class_level.toUpperCase() !== selectedClass.toUpperCase()) {
          return false;
        }
        if (selectedDifficulty !== 'all' && w.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
          return false;
        }
        if (selectedType !== 'all' && w.material_type !== selectedType) {
          return false;
        }
        if (priceFilter === 'free' && (!w.is_free && w.price_paise > 0)) {
          return false;
        }
        if (priceFilter === 'paid' && (w.is_free || w.price_paise === 0)) {
          return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = w.title.toLowerCase().includes(q);
          const matchChapter = w.chapter.toLowerCase().includes(q);
          const matchDesc = w.description.toLowerCase().includes(q);
          const matchTopic = w.topic?.toLowerCase().includes(q);
          return matchTitle || matchChapter || matchDesc || matchTopic;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price_paise - b.price_paise;
        if (sortBy === 'price_high') return b.price_paise - a.price_paise;
        if (sortBy === 'popular') return (b.download_count || 0) - (a.download_count || 0);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [worksheets, search, selectedClass, selectedDifficulty, selectedType, priceFilter, sortBy]);

  const classes: Array<{ label: string; value: string }> = [
    { label: 'All Classes', value: 'all' },
    { label: 'Class VI', value: 'VI' },
    { label: 'Class VII', value: 'VII' },
    { label: 'Class VIII', value: 'VIII' },
    { label: 'Class IX', value: 'IX' },
    { label: 'Class X', value: 'X' },
    { label: 'Class XI', value: 'XI' },
    { label: 'Class XII', value: 'XII' },
  ];

  return (
    <main style={{ padding: '48px 0 80px' }}>
      <div className="wrap">
        {/* Marketplace Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="eyebrow">Complete CBSE Curriculum</div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(32px, 4vw, 44px)', margin: '8px 0 12px' }}>
            Worksheet Marketplace
          </h1>
          <p className="subheading" style={{ maxWidth: '680px' }}>
            Discover chapter-wise mathematics worksheets, question banks, and complete NCERT step-by-step solutions
            with instant verified digital downloads.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <Search
              size={18}
              color="var(--muted)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '42px', margin: 0 }}
              placeholder="Search by chapter, topic, or keyword (e.g. Quadratic, Trigonometry, Integrals)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown & View Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ color: 'var(--muted)' }}>Sort by:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '8px 14px', margin: 0, fontSize: '13.5px' }}
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
              >
                <option value="newest">Recently Published</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-ghost btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px 0 0 6px',
                  background: viewMode === 'grid' ? 'var(--cream)' : 'transparent',
                }}
                title="Grid View"
              >
                <Grid size={16} color={viewMode === 'grid' ? 'var(--maroon)' : 'var(--muted)'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-ghost btn-sm ${viewMode === 'list' ? 'active' : ''}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '0 6px 6px 0',
                  background: viewMode === 'list' ? 'var(--cream)' : 'transparent',
                }}
                title="List View"
              >
                <List size={16} color={viewMode === 'list' ? 'var(--maroon)' : 'var(--muted)'} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="filters-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--maroon)', fontWeight: 700, fontSize: '13.5px', marginRight: '6px' }}>
            <Filter size={15} /> Class:
          </div>
          {classes.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedClass(c.value)}
              className={`filter-pill ${selectedClass === c.value ? 'active' : ''}`}
            >
              {c.label}
            </button>
          ))}

          <span style={{ color: 'var(--line-strong)', margin: '0 4px' }}>|</span>

          {/* Difficulty Dropdown */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', margin: 0, fontSize: '13px' }}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (Foundations)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Board Exam / Exemplar)</option>
          </select>

          {/* Type Dropdown */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', margin: 0, fontSize: '13px' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Material Types</option>
            <option value="worksheet">Practice Worksheets</option>
            <option value="ncert_solution">NCERT Solutions</option>
            <option value="study_material">Study Materials</option>
            <option value="mock_test">Mock Tests</option>
            <option value="formula_sheet">Formula Sheets</option>
          </select>

          {/* Free vs Paid Toggle */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', margin: 0, fontSize: '13px' }}
            value={priceFilter}
            onChange={(e: any) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="free">Free Worksheets Only</option>
            <option value="paid">Paid Materials</option>
          </select>

          {(selectedClass !== 'all' || selectedDifficulty !== 'all' || selectedType !== 'all' || priceFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setPriceFilter('all');
                setSearch('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                marginLeft: 'auto',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'worksheet' : 'worksheets'}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--maroon)' }}>
              Loading curriculum materials...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div
            className="card"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--cream)',
                color: 'var(--maroon)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 18px',
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ color: 'var(--maroon)', fontSize: '22px', margin: '0 0 8px' }}>
              No worksheets match your filters
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14.5px', marginBottom: '24px' }}>
              Try loosening your search terms or resetting filters to browse our complete collection.
            </p>
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedDifficulty('all');
                setSelectedType('all');
                setPriceFilter('all');
                setSearch('');
              }}
              className="btn btn-primary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Worksheets Grid */}
        {!loading && filtered.length > 0 && (
          <div className={viewMode === 'grid' ? 'worksheet-grid' : 'admin-list'}>
            {filtered.map((ws) => (
              <WorksheetCard key={ws.id} worksheet={ws} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
