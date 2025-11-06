import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Package, Search, Truck } from 'lucide-react';
import apiFetch from '../../utils/apiFetch';
import './UpdateShipment.css';
import Swal from 'sweetalert2';

interface Shipment {
  id: number;
  orderId: string;
  status: string;
  trackingNumber: string;
}

export default function UpdateShipment() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const shipmentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const setShipmentRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    shipmentsRef.current[idx] = el;
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(containerRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
      .from('.shipment-header', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from('.search-container', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    // initial load
    loadOrders();
  }, []);

  // --- API wrapper helpers (use the backend controller endpoints you provided) ---
  // Calls backend admin list endpoint with pagination
  const getAllOrders = async (search?: string, limit = 5, offset = 0) => {
    const q = search ? `?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}` : `?limit=${limit}&offset=${offset}`;
    const res: any = await apiFetch(`/api/orders/all${q}`);
    return (res && res.data) || [];
  };

  const getOrderById = async (id: number) => {
    const list = await getAllOrders(String(id), 1, 0);
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  };

  const updateOrderStatusApi = async (id: number, status: string) => {
    const res: any = await apiFetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res && res.order ? res.order : null;
  };

  // Simplified loader that uses the wrapper above. By default loads 5 items.
  // If offset > 0 we append results (for "Show more").
  const loadOrders = async (search?: string, limit = 5, offset = 0) => {
    try {
      const orders = await getAllOrders(search, limit, offset);
      const mapped = (Array.isArray(orders) ? orders : []).map((o: any) => ({
        id: o.id,
        orderId: o.id ? String(o.id) : (o.orderNumber || `ORD-${o.id}`),
        status: (o.status || 'processing').toString().toLowerCase(),
        trackingNumber: (o.shipment && o.shipment.trackingNumber) || ''
      }));
      if (offset && offset > 0) {
        // append but avoid duplicates
        setShipments((prev) => {
          const ids = new Set(prev.map(p => p.id));
          const toAdd = mapped.filter(m => !ids.has(m.id));
          return [...prev, ...toAdd];
        });
        // determine whether there are more pages available
        setHasMore(mapped.length === limit);
      } else {
        setShipments(mapped);
        setHasMore(mapped.length === limit);
      }
      // if search returned a single result, auto-select it but require explicit newStatus selection
      if (search && mapped.length === 1) {
        setSelectedShipment(mapped[0]);
        setNewStatus('');
      }
    } catch (err: any) {
      console.error('loadOrders error', err);
      try { await Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Failed to load orders.' }); } catch (e) {}
      setShipments([]);
    }
  };

  const filteredShipments = shipments.filter(
    (s) =>
      s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleShipments = filteredShipments.slice(0, visibleCount);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      await loadOrders(undefined, 5, 0);
      setVisibleCount(5);
      setSelectedShipment(null);
      setNewStatus('');
      return;
    }

  // Use the simplified loader which calls the admin list endpoint (search resets pagination)
  await loadOrders(term, 5, 0);
  setVisibleCount(5);
  };

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    // Keep newStatus empty so the select shows the placeholder and the admin must choose.
    setNewStatus('');

    gsap.from('.update-panel', { scale: 0.95, opacity: 0, duration: 0.4, ease: 'back.out(1.4)' });
  };

  const handleShowMore = async () => {
    const current = shipments.length || 0;
    await loadOrders(undefined, 5, current);
    setVisibleCount((v) => v + 5);
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment) {
      await Swal.fire({ icon: 'error', title: 'Validation', text: 'Please select an order to update.' });
      return;
    }
    if (!newStatus) {
      await Swal.fire({ icon: 'error', title: 'Validation', text: 'Please choose a new status.' });
      return;
    }

    const prevStatus = selectedShipment.status;

    // optimistic update
    setShipments((prev) => prev.map((s) => (s.id === selectedShipment.id ? { ...s, status: newStatus } : s)));
    setSelectedShipment((s) => (s ? { ...s, status: newStatus } : s));

    try {
      const updated = await updateOrderStatusApi(selectedShipment.id, newStatus);
      if (updated) {
        const normalized = (updated.status || newStatus).toString().toLowerCase();
        setShipments((prev) => prev.map((s) => (s.id === updated.id ? { ...s, status: normalized } : s)));
        setSelectedShipment((s) => (s ? { ...s, status: normalized } : s));
        await Swal.fire({ icon: 'success', title: 'Updated', text: `Order ${updated.id} status set to ${normalized}`, timer: 2000, showConfirmButton: false });
      } else {
        // fallback
        setShipments((prev) => prev.map((s) => (s.id === selectedShipment.id ? { ...s, status: newStatus } : s)));
        await Swal.fire({ icon: 'success', title: 'Updated', text: `Status updated to ${newStatus}`, timer: 2000, showConfirmButton: false });
      }
    } catch (err: any) {
      console.error('update status error', err);
      // rollback
      setShipments((prev) => prev.map((s) => (s.id === selectedShipment.id ? { ...s, status: prevStatus } : s)));
      setSelectedShipment((s) => (s ? { ...s, status: prevStatus } : s));

      let message = 'Failed to update order status.';
      if (err && err.body && err.body.error) message = err.body.error;
      if (err && err.message) message = err.message;

      await Swal.fire({ icon: 'error', title: 'Update failed', text: message });
    }
  };

  return (
    <div className="shipment-page">
      <div className="shipment-container" ref={containerRef}>
        <div className="shipment-header">
          <div className="header-icon">
            <Truck size={32} />
          </div>
          <h1 className="shipment-title">Update Shipment Status</h1>
          <p className="shipment-subtitle">Track and manage order shipments in real-time</p>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} onClick={handleSearch} style={{ cursor: 'pointer' }} />
          <input
            type="text"
            placeholder="Search by Order ID or Tracking Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="search-input"
          />
        </div>

        <div className="shipment-content">
          <div className="shipment-list">
            <h2 className="section-title">Shipments</h2>
            {visibleShipments.length === 0 ? (
              <p className="empty-text">No shipments found</p>
            ) : (
              visibleShipments.map((shipment, index) => (
                <div
                  key={shipment.id}
                  ref={(el) => setShipmentRef(el, index)}
                  className={`shipment-item ${selectedShipment?.id === shipment.id ? 'selected' : ''}`}
                  onClick={() => handleSelectShipment(shipment)}
                >
                  <Package size={20} />
                  <div className="shipment-info">
                    <p className="shipment-order-id">{shipment.orderId}</p>
                    <p className="shipment-tracking">{shipment.trackingNumber}</p>
                  </div>
                  <span className={`status-badge status-${shipment.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {shipment.status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              ))
            )}

            {(hasMore || filteredShipments.length > visibleCount) && (
              <div className="show-more-wrapper">
                <button className="show-more-button" onClick={handleShowMore}>Show more</button>
              </div>
            )}
          </div>

          {selectedShipment && (
            <div className="update-panel">
              <h2 className="section-title">Update Status</h2>
              <div className="update-content">
                <div className="update-info">
                  <p><strong>Order ID:</strong> {selectedShipment.orderId}</p>
                  <p><strong>Tracking:</strong> {selectedShipment.trackingNumber}</p>
                  <p><strong>Current Status:</strong> {selectedShipment.status.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">New Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="form-select">
                    <option value="">-- Select status --</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="in transit">In Transit</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button onClick={handleUpdateStatus} className="update-button">Update Status</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
