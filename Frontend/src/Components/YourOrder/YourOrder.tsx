import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/apiFetch';
import Swal from 'sweetalert2';
import './YourOrder.css';
interface OrderItem {
  id: number;
  productId?: number;
  name?: string;
  quantity?: number;
  price?: number;
}

interface Order {
  id: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  orderItems?: OrderItem[];
}

const YourOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState<{ [key: number]: number | null }>({});
  const [rating, setRating] = useState<{ [key: number]: number }>({});
  const [comment, setComment] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await apiFetch('/orders?limit=50&offset=0');
        const data = (res && res.data) || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('YourOrder fetch error', err);
        setError(err?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openReview = (orderId: number, itemId: number) => {
    setReviewOpen((s) => ({ ...s, [orderId]: itemId }));
    setRating((r) => ({ ...r, [itemId]: 5 }));
    setComment((c) => ({ ...c, [itemId]: '' }));
  };

  const closeReview = (orderId: number) => {
    setReviewOpen((s) => ({ ...s, [orderId]: null }));
  };

  const submitReview = async (orderId: number, item: OrderItem) => {
    const itemId = item.id;
    const r = rating[itemId] || 5;
    const c = comment[itemId] || '';
    try {
      // Attempt to post to /reviews - if your backend has a different path, adjust accordingly.
      await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId: item.productId, orderId, rating: r, comment: c })
      });
      // close and show success
      closeReview(orderId);
      await Swal.fire({ icon: 'success', title: 'Thanks!', text: 'Your review was submitted.', timer: 2000, showConfirmButton: false });
    } catch (err: any) {
      console.error('submit review error', err);
      await Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Failed to submit review' });
    }
  };

  if (loading) return <div className="your-order">Loading orders...</div>;
  if (error) return <div className="your-order error">Error: {error}</div>;

  return (
    <div className="your-order">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <strong>Order #{o.id}</strong>
                  <div className="order-date">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</div>
                </div>
                <div className={`status status-${(o.status || '').replace(/\s+/g, '-')}`}>{(o.status || '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</div>
              </div>

              <div className="order-items-cart">
                {o.orderItems && o.orderItems.length > 0 ? (
                  o.orderItems.map((it) => {
                    const product = (it as any).product;
                    const productName = product?.name || it.name || `Product ${it.productId}`;
                    const productImage = product?.image_url || (product && (product.image || product.imageUrl)) || 'https://via.placeholder.com/120x120?text=No+Image';
                    const productDescription = product?.description || '';
                    const itemPrice = (it.price != null && it.price) ? it.price : (product?.price ?? 0);
                    return (
                      <div key={it.id} className="cart-row item-card">
                        <div className="item-thumb">
                          <img src={productImage} alt={productName} />
                        </div>
                        <div className="item-main">
                          <div className="item-name">{productName}</div>
                          {productDescription && <div className="item-desc">{productDescription}</div>}
                          <div className="item-meta">Qty: <strong>{it.quantity ?? 1}</strong></div>
                        </div>
                        <div className="item-side">
                          <div className="item-price">₹{itemPrice?.toFixed ? itemPrice.toFixed(2) : (Number(itemPrice).toFixed(2))}</div>
                          {o.status === 'delivered' && (
                            <div className="review-actions">
                              <button className="btn btn-sm" onClick={() => openReview(o.id, it.id)}>Review</button>
                            </div>
                          )}
                        </div>

                        {/* review form for this order (single item at a time) */}
                        {reviewOpen[o.id] === it.id && (
                          <div className="review-form">
                            <label>Rating:</label>
                            <select value={rating[it.id] ?? 5} onChange={(e) => setRating((r) => ({ ...r, [it.id]: parseInt(e.target.value, 10) }))}>
                              <option value={5}>5</option>
                              <option value={4}>4</option>
                              <option value={3}>3</option>
                              <option value={2}>2</option>
                              <option value={1}>1</option>
                            </select>
                            <label>Comment:</label>
                            <textarea value={comment[it.id] ?? ''} onChange={(e) => setComment((c) => ({ ...c, [it.id]: e.target.value }))} />
                            <div className="review-buttons">
                              <button className="btn" onClick={() => submitReview(o.id, it)}>Submit</button>
                              <button className="btn btn-ghost" onClick={() => closeReview(o.id)}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div>No items</div>
                )}
              </div>

              <div className="order-card-footer">Total: ₹{o.totalAmount?.toFixed(2) ?? '0.00'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourOrder;