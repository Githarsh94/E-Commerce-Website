import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/apiFetch';
import { showError, showSuccess } from '../../utils/alert';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedAddress');
      if (raw) setSelectedAddress(JSON.parse(raw));
    } catch (e) {
      setSelectedAddress(null);
    }
  }, []);

  useEffect(() => {
    // Listen for same-window selection updates from CheckAddress
    const handler = (e: Event) => {
      try {
        // CustomEvent stores the address in detail
        const ce = e as CustomEvent;
        if (ce && ce.detail) {
          setSelectedAddress(ce.detail);
          return;
        }
      } catch (err) {
        // ignore and fallback to reading localStorage
      }
      try {
        const raw = localStorage.getItem('selectedAddress');
        if (raw) setSelectedAddress(JSON.parse(raw));
        else setSelectedAddress(null);
      } catch (err) {
        setSelectedAddress(null);
      }
    };

    window.addEventListener('selectedAddressChanged', handler as EventListener);
    return () => window.removeEventListener('selectedAddressChanged', handler as EventListener);
  }, []);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on delivery');
  const [amount, setAmount] = useState<number>(0);

  const handleProceed = async () => {
    if (!isAuthenticated) {
      try { await showError('Please sign in to proceed'); } catch (e) { }
      navigate('/auth?mode=signin');
      return;
    }

    if (!selectedAddress || !selectedAddress.id) {
      try { await showError('Please select a shipping address before continuing'); } catch (e) { }
      return;
    }

    setLoading(true);
    try {
      // helper: try multiple endpoint variants until one succeeds
      const callWithFallback = async (candidates: string[], options?: RequestInit) => {
        let lastErr: any = null;
        for (const u of candidates) {
          try {
            return await apiFetch(u, options);
          } catch (err: any) {
            lastErr = err;
            // if 404 try next candidate
            if (err?.status === 404) continue;
            // for other errors, bubble up
            throw err;
          }
        }
        throw lastErr || new Error('All endpoints failed');
      };

      // NOTE: callWithFallback is also used by the amount loader effect below.

      // 1) fetch cart rows from backend (rows have productId and quantity)
      const cartRows: any = await callWithFallback(['/cart', '/carts']);
      if (!Array.isArray(cartRows) || cartRows.length === 0) {
        try { await showError('Your cart is empty'); } catch (e) { }
        setLoading(false);
        return;
      }

      // 2) build items payload and compute total by fetching product details
      const detailed = await Promise.all(cartRows.map(async (row: any) => {
        try {
          const p = await callWithFallback([`/products/single/${row.productId}`, `/products/${row.productId}`]);
          return {
            productId: row.productId,
            quantity: row.quantity,
            price: p.price || 0
          };
        } catch (err) {
          return { productId: row.productId, quantity: row.quantity, price: 0 };
        }
      }));

      // Include price on each item because backend OrderItem.price is non-nullable
      const items = detailed.map(d => ({ productId: d.productId, quantity: d.quantity, price: d.price || 0 }));
      const computedAmount = detailed.reduce((s, d) => s + (d.price || 0) * (d.quantity || 0), 0);

      // 3) create order first (server expects items in req.body)
      const orderBody = { items, shippingAddress: selectedAddress, totalAmount: computedAmount };
      // 3) create order. backend may register route as /orders or /order
      const order: any = await callWithFallback(['/orders', '/order'], { method: 'POST', body: JSON.stringify(orderBody) });

      // 4) process payment for the created order (call server controller)
      try {
        const paymentBody = { orderId: order.id, amount: computedAmount, method: paymentMethod };
        await callWithFallback(['/payments/process', '/payment/process'], { method: 'POST', body: JSON.stringify(paymentBody) });
      } catch (payErr) {
        console.error('payment call failed', payErr);
        try { await showError('Payment processing failed. Order created but payment could not be completed.'); } catch (e) { }
        // still navigate to orders page so the user can see their order
        navigate('/your-order');
        setLoading(false);
        return;
      }

      await showSuccess('Payment completed <br /> and order placed');
      // Optionally navigate to orders page or order details
      navigate('/your-order');
    } catch (err: any) {
      console.error('checkout failed', err);
      try { await showError('Checkout failed', err?.body?.error || err?.message || 'Unknown error'); } catch (e) { }
    } finally {
      setLoading(false);
    }
  };

  // Load cart and compute amount on mount so user sees the payable amount before clicking
  useEffect(() => {
    let mounted = true;

    const loader = async () => {
      // copy of callWithFallback from above
      const callWithFallback = async (candidates: string[], options?: RequestInit) => {
        let lastErr: any = null;
        for (const u of candidates) {
          try {
            return await apiFetch(u, options);
          } catch (err: any) {
            lastErr = err;
            if (err?.status === 404) continue;
            throw err;
          }
        }
        throw lastErr || new Error('All endpoints failed');
      };

      try {
        const cartRows: any = await callWithFallback(['/cart', '/carts']);
        if (!Array.isArray(cartRows) || cartRows.length === 0) {
          if (mounted) setAmount(0);
          return;
        }

        const detailed = await Promise.all(cartRows.map(async (row: any) => {
          try {
            const p = await callWithFallback([`/products/single/${row.productId}`, `/products/${row.productId}`]);
            return { productId: row.productId, quantity: row.quantity, price: p.price || 0 };
          } catch (err) {
            return { productId: row.productId, quantity: row.quantity, price: 0 };
          }
        }));

        const computed = detailed.reduce((s, d) => s + (d.price || 0) * (d.quantity || 0), 0);
        if (mounted) setAmount(computed);
      } catch (err) {
        if (mounted) setAmount(0);
      }
    };

    loader();
    return () => { mounted = false; };
  }, []);

  return (
    // Expose this id so CheckAddress can scroll to it reliably
    <div id="payment-section" className="payment-section">
      <h3>Payment</h3>
      {selectedAddress ? (
        <div className="selected-address">
          <div><strong>Ship to:</strong> {selectedAddress.name}</div>
          <div>{selectedAddress.addressLine}, {selectedAddress.locality}</div>
          <div>{selectedAddress.city} - {selectedAddress.pincode}, {selectedAddress.state}</div>
          <div>Phone: {selectedAddress.mobileNo || selectedAddress.phone || '-'}</div>
        </div>
      ) : (
        <p>No shipping address selected. Please choose an address in the Shipping address section.</p>
      )}
      <div className="payment-method">
        <label className="payment-method-label">Payment method</label>
        <div className="payment-method-options">
          {['debit card', 'credit card', 'UPI', 'Cash on delivery'].map(m => (
            <label key={m} className="payment-method-option">
              <input type="radio" name="paymentMethod" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
              <span className="payment-method-text">{m}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="payment-summary">
        <div className="pay-amount">Pay: - ₹{amount.toFixed(2)}</div>
        <button className="btn-payment-primary" onClick={handleProceed} disabled={loading}>{loading ? 'Processing...' : 'Proceed to Payment'}</button>
      </div>
    </div>
  );
};

export default Payment;