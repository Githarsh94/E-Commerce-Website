import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Package, Search, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import './UpdateShipment.css';
import { showSuccess, showError } from '../../utils/alert';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    .from('.shipment-header', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.search-container', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');

    fetchShipments();
  }, []);

  useEffect(() => {
    if (shipments.length > 0) {
      gsap.from(shipmentsRef.current.filter(Boolean) as HTMLDivElement[], {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [shipments]);

  const fetchShipments = async () => {
    const mockShipments: Shipment[] = [
      { id: 1, orderId: 'ORD-001', status: 'Processing', trackingNumber: 'TRK123456' },
      { id: 2, orderId: 'ORD-002', status: 'Shipped', trackingNumber: 'TRK789012' },
      { id: 3, orderId: 'ORD-003', status: 'Delivered', trackingNumber: 'TRK345678' },
    ];
    setShipments(mockShipments);
  };

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);

    gsap.from('.update-panel', {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(1.4)'
    });
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment || !newStatus) {
      setMessage({ type: 'error', text: 'Please select a status' });
      return;
    }

    try {
      setShipments(
        shipments.map((s) =>
          s.id === selectedShipment.id ? { ...s, status: newStatus } : s
        )
      );

      gsap.to('.update-panel', {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        onComplete: () => setSelectedShipment(null)
      });

      const msg = `Shipment ${selectedShipment.orderId} status updated to ${newStatus}`;
      setMessage({ type: 'success', text: msg });
      try { await showSuccess('Shipment updated', msg); } catch (e) { /* ignore */ }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      const errMsg = 'Failed to update shipment';
      setMessage({ type: 'error', text: errMsg });
      try { await showError('Update failed', errMsg); } catch (e) { /* ignore */ }
      setTimeout(() => setMessage(null), 3000);
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
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Tracking Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {message && (
          <div className={`toast-message toast-${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="shipment-content">
          <div className="shipment-list">
            <h2 className="section-title">Shipments</h2>
            {filteredShipments.length === 0 ? (
              <p className="empty-text">No shipments found</p>
            ) : (
              filteredShipments.map((shipment, index) => (
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
                  <span className={`status-badge status-${shipment.status.toLowerCase()}`}>
                    {shipment.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {selectedShipment && (
            <div className="update-panel">
              <h2 className="section-title">Update Status</h2>
              <div className="update-content">
                <div className="update-info">
                  <p><strong>Order ID:</strong> {selectedShipment.orderId}</p>
                  <p><strong>Tracking:</strong> {selectedShipment.trackingNumber}</p>
                  <p><strong>Current Status:</strong> {selectedShipment.status}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button onClick={handleUpdateStatus} className="update-button">
                  Update Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
