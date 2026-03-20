'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CrudModal } from '@/components/CrudModal';
import { DataTable } from '@/components/DataTable';
import { SectionHeader } from '@/components/SectionHeader';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { MarketplaceItem } from '@/types';

export function MarketplacePage({ category }: { category?: MarketplaceItem['category'] }) {
  const state = useEsportsStore();
  const [editing, setEditing] = useState<MarketplaceItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const items = useMemo(() => state.marketplace.filter((item) => (category ? item.category === category : true)), [category, state.marketplace]);
  const cartItems = state.cart.map((entry) => ({ ...entry, item: state.marketplace.find((item) => item.id === entry.marketplaceItemId) })).filter((entry) => entry.item);
  const total = cartItems.reduce((sum, entry) => sum + (entry.item?.price ?? 0) * entry.quantity, 0);

  return (
    <>
      <SectionHeader title={category ? `Marketplace · ${category}` : 'Marketplace'} description="Add products, services, or accounts. All cart and checkout actions are local-only simulations." action={<div className="inline-actions"><button className="primary-button" onClick={() => setCreating(true)}>Add product</button><button className="ghost-button" onClick={() => state.fakeCheckout()}>Fake checkout</button></div>} />
      <div className="grid-two">
        <section className="card list-card">
          <div className="inline-actions">
            <Link href="/marketplace" className="ghost-button">All</Link>
            <Link href="/marketplace/accounts" className="ghost-button">Accounts</Link>
            <Link href="/marketplace/coaching" className="ghost-button">Coaching</Link>
            <Link href="/marketplace/items" className="ghost-button">Items</Link>
          </div>
          <p className="muted">Filter marketplace categories and test add-to-cart flows without any real commerce integration.</p>
        </section>
        <section className="card list-card">
          <div className="split"><strong>Cart total</strong><strong>{formatCurrency(total)}</strong></div>
          {cartItems.length === 0 ? <p className="muted">Cart is empty.</p> : cartItems.map((entry) => <div key={entry.id} className="split"><span>{entry.item?.title} × {entry.quantity}</span><button className="ghost-button" onClick={() => state.removeFromCart(entry.marketplaceItemId)}>Remove</button></div>)}
        </section>
      </div>
      <DataTable columns={['Listing', 'Category', 'Price', 'Seller', 'Actions']} rows={items.map((item) => [
        <div key={item.id}><strong>{item.title}</strong><div className="muted small">{item.description}</div></div>,
        item.category,
        formatCurrency(item.price),
        item.seller,
        <div key={`${item.id}-actions`} className="inline-actions"><button className="primary-button" onClick={() => state.addToCart(item.id)}>Add</button><button className="ghost-button" onClick={() => setEditing(item)}>Edit</button><button className="danger-button" onClick={() => setDeletingId(item.id)}>Delete</button></div>,
      ])} />
      <CrudModal title={editing ? 'Edit listing' : 'Add listing'} open={creating || Boolean(editing)} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={(values) => {
        const payload = { name: values.title, title: values.title, category: (values.category || 'item') as MarketplaceItem['category'], price: Number(values.price || 0), description: values.description, seller: values.seller };
        if (editing) state.updateEntity('marketplace', editing.id, payload); else state.createEntity('marketplace', payload);
      }} fields={[
        { name: 'title', label: 'Title' },
        { name: 'category', label: 'Category', type: 'select', options: ['account', 'coaching', 'item'].map((value) => ({ value, label: value })) },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'seller', label: 'Seller' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]} initialValues={editing ?? (category ? { category } : undefined)} />
      <ConfirmDialog open={Boolean(deletingId)} title="Delete listing?" message="Only local prototype data will be affected." onClose={() => setDeletingId(null)} onConfirm={() => { if (deletingId) state.deleteEntity('marketplace', deletingId); setDeletingId(null); }} />
    </>
  );
}
