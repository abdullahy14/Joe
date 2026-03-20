'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { EntitySection } from '@/components/EntitySection';
import { formatCurrency } from '@/lib/utils';
import { useEsportsStore } from '@/store/useEsportsStore';
import type { MarketplaceCategory, MarketplaceItem } from '@/types';

export function MarketplaceBoard({ category }: { category?: MarketplaceCategory }) {
  const { marketplace, createMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem, addToCart, cart, removeFromCart, checkout } = useEsportsStore();
  const rows = useMemo(() => marketplace.filter((item) => (!category ? true : item.category === category)), [category, marketplace]);
  const cartItems = cart.map((item) => ({ ...item, product: marketplace.find((entry) => entry.id === item.marketplaceItemId) })).filter((item) => item.product);
  const total = cartItems.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  return (
    <div className="page-grid two-column">
      <div>
        <div className="category-tabs">
          <Link href="/marketplace">All</Link>
          <Link href="/marketplace/accounts">Accounts</Link>
          <Link href="/marketplace/coaching">Coaching</Link>
          <Link href="/marketplace/items">Items</Link>
        </div>
        <EntitySection<MarketplaceItem>
          title={category ? `${category} listings` : 'Marketplace listings'}
          rows={rows}
          columns={[
            { key: 'title', label: 'Product', render: (row) => row.title },
            { key: 'category', label: 'Category', render: (row) => row.category },
            { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
            { key: 'stock', label: 'Stock', render: (row) => row.stock },
          ]}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category', type: 'select', options: ['accounts', 'coaching', 'items'].map((entry) => ({ label: entry, value: entry })) },
            { key: 'price', label: 'Price', type: 'number' },
            { key: 'stock', label: 'Stock', type: 'number' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
          createItem={(payload) => createMarketplaceItem(payload as Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt'>)}
          updateItem={(id, payload) => updateMarketplaceItem(id, payload as Partial<MarketplaceItem>)}
          deleteItem={deleteMarketplaceItem}
          toInitialValues={(row) => row ?? { title: '', name: '', category: category ?? 'items', price: 0, stock: 1, description: '' }}
          toPayload={(values) => ({ ...values, price: Number(values.price), stock: Number(values.stock), category: values.category as MarketplaceCategory })}
          extraActions={(row) => <button onClick={() => addToCart(row.id)}>Add to cart</button>}
        />
      </div>
      <section className="card">
        <div className="section-header">
          <h2>Cart</h2>
          <span className="muted">Fake checkout only</span>
        </div>
        <div className="stack-list">
          {cartItems.length ? (
            cartItems.map((item) => (
              <article key={item.marketplaceItemId} className="list-item">
                <div>
                  <strong>{item.product?.title}</strong>
                  <p className="muted">
                    Qty {item.quantity} · {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                  </p>
                </div>
                <button className="danger-button" onClick={() => removeFromCart(item.marketplaceItemId)}>
                  Remove
                </button>
              </article>
            ))
          ) : (
            <p className="muted">Cart is empty. Add products from the marketplace table.</p>
          )}
        </div>
        <div className="checkout-box">
          <strong>Total: {formatCurrency(total)}</strong>
          <button onClick={checkout}>Fake checkout</button>
        </div>
      </section>
    </div>
  );
}
