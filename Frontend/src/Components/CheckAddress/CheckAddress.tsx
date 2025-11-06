import React, { useEffect, useState } from 'react';
import apiFetch from '../../utils/apiFetch';
import { showError, showSuccess, showConfirm } from '../../utils/alert';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CheckAddress.css';
interface AddressType {
  id?: number;
  name?: string;
  mobileNo?: string;
  phone?: string;
  pincode?: string;
  locality?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  landmark?: string;
  addressType?: string;
  isDefault?: boolean;
}

const CheckAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setAddresses([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res: any = await apiFetch('/api/addresses');
        const list = Array.isArray(res.addresses) ? res.addresses : res;
        setAddresses(list || []);
        if (Array.isArray(list) && list.length) {
          const def = list.find((a: any) => a.isDefault);
          setSelectedId(def ? def.id : list[0].id);
        } else {
          setSelectedId(null);
        }
      } catch (err: any) {
        console.error('fetch addresses', err);
        try { await showError('Failed to load addresses', err?.message || String(err)); } catch (e) { }
        setAddresses([]);
        setSelectedId(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, isAuthenticated]);

  const handleAddAddress = () => {
    navigate('/profile');
  };

  const handleContinue = async () => {
    if (!selectedId) {
      try { await showError('Please select an address to continue'); } catch (e) { }
      return;
    }
    const selected = addresses.find(a => a.id === selectedId) as AddressType | undefined;
    if (!selected) {
      try { await showError('Selected address not found'); } catch (e) { }
      return;
    }

    // Persist selection for Payment/checkout step
    try {
      localStorage.setItem('selectedAddress', JSON.stringify(selected));
      // Notify other parts of the app (same-window listeners) that the selected address changed
      try {
        const ev = new CustomEvent('selectedAddressChanged', { detail: selected });
        window.dispatchEvent(ev);
      } catch (e) {
        // fallback: nothing to do
      }
      try { await showSuccess('Address selected'); } catch (e) { }
      // Optionally navigate or scroll to payment step. If OrderSummary page renders Payment below,
      // we can attempt to scroll to it. Otherwise keep the selection in localStorage for Payment to read.
      const el = document.querySelector('#payment-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('persist selection', err);
      try { await showError('Failed to save selected address'); } catch (e) { }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-address-wrapper">
        <p className="checkout-address-message">Please sign in to continue to checkout.</p>
        <button className="checkout-address-btn-signin" onClick={() => navigate('/auth?mode=signin')}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="checkout-address-wrapper">
      <h3 className="checkout-address-heading">Shipping Address</h3>
      {loading ? (
        <p className="checkout-address-loading">Loading addresses...</p>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="checkout-address-empty-state">
              <p className="checkout-address-empty-message">No address on file. Please add an address to continue.</p>
              <button className="checkout-address-btn-add" onClick={handleAddAddress}>Add address</button>
            </div>
          ) : (
            <div className="checkout-address-grid">
              {addresses.map((addr) => (
                <label key={addr.id} className="checkout-address-card">
                  <input 
                    type="radio" 
                    name="selectedAddress" 
                    className="checkout-address-radio"
                    checked={selectedId === addr.id} 
                    onChange={() => setSelectedId(addr.id as number)} 
                  />
                  <div className="checkout-address-content">
                    <div className="checkout-address-name-row">
                      <strong className="checkout-address-name">{addr.name}</strong> 
                      {addr.isDefault && <span className="checkout-address-default-tag">DEFAULT</span>}
                    </div>
                    <div className="checkout-address-text">{addr.addressLine}, {addr.locality}</div>
                    <div className="checkout-address-text">{addr.city} - {addr.pincode}, {addr.state}</div>
                    <div className="checkout-address-text">Phone: {addr.mobileNo || addr.phone || '-'}</div>
                  </div>
                </label>
              ))}
              <div className="checkout-address-actions">
                <button 
                  className="checkout-address-btn-continue" 
                  onClick={handleContinue} 
                  disabled={!selectedId}
                >
                  Use selected address
                </button>
                <button 
                  className="checkout-address-btn-add-new" 
                  onClick={handleAddAddress}
                >
                  Add new address
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckAddress;