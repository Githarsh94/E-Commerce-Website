import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiFetch from '../../utils/apiFetch';
import { showSuccess, showError, showConfirm } from '../../utils/alert';
import gsap from 'gsap';
import './Profile.css';

type AddressType = {
  id?: number;
  name: string;
  phone?: string;
  mobileNo: string;
  alternatePhone?: string | null;
  pincode: string;
  locality?: string | null;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string | null;
  addressType: 'home' | 'work';
  isDefault?: boolean;
};

const emptyAddress = (): AddressType => ({
  name: '', phone: '', mobileNo: '', alternatePhone: '', pincode: '', locality: '', addressLine: '', city: '', state: '', landmark: '', addressType: 'home', isDefault: false
});

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth();

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [form, setForm] = useState<AddressType>(emptyAddress());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geoLoading, setGeoLoading] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const addressListRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial page load animation
    if (profileRef.current && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Animate address cards when loaded
    if (addressListRef.current && addresses.length > 0) {
      const cards = addressListRef.current.querySelectorAll('.address-item');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.1, 
          ease: 'back.out(1.2)' 
        }
      );
    }
  }, [addresses]);

  useEffect(() => {
    // Animate form appearance
    if (formRef.current && showAddForm) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, height: 0, y: -20 },
        { 
          opacity: 1, 
          height: 'auto', 
          y: 0, 
          duration: 0.6, 
          ease: 'power3.out' 
        }
      );
    }
  }, [showAddForm]);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res: any = await apiFetch('/api/addresses');
      setAddresses(Array.isArray(res.addresses) ? res.addresses : res);
    } catch (err: any) {
      console.error('fetchAddresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const openEdit = (addr: AddressType) => {
    setEditingAddress(addr);
    setForm({ ...addr });
    setShowAddForm(true);
  };

  const openAdd = () => {
    setEditingAddress(null);
    setForm(emptyAddress());
    setShowAddForm(true);
  };

  const cancelForm = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0,
        height: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setShowAddForm(false);
          setEditingAddress(null);
          setForm(emptyAddress());
          setErrors({});
        }
      });
    } else {
      setShowAddForm(false);
      setEditingAddress(null);
      setForm(emptyAddress());
      setErrors({});
    }
  };

  const handleChange = (k: keyof AddressType, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const validateForm = (f: AddressType) => {
    const e: Record<string, string> = {};
    if (!f.name || !f.name.trim()) e.name = 'Name is required';
    if (!f.mobileNo || !/^[0-9]{10}$/.test(f.mobileNo)) e.mobileNo = 'Mobile number must be a 10-digit number';
    if (!f.pincode || !/^[0-9]{4,6}$/.test(f.pincode)) e.pincode = 'Pincode is required';
    if (!f.addressLine || !f.addressLine.trim()) e.addressLine = 'Address is required';
    if (!f.city || !f.city.trim()) e.city = 'City is required';
    if (!f.state || !f.state.trim()) e.state = 'State is required';
    return e;
  };

  const saveAddress = async () => {
    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const firstKey = Object.keys(fieldErrors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      if (el) el.focus();
      return;
    }

    try {
      setLoading(true);
      if (editingAddress && editingAddress.id) {
        await apiFetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
        await showSuccess('Address updated');
      } else {
        await apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(form) });
        await showSuccess('Address added');
      }
      await fetchAddresses();
      cancelForm();
    } catch (error: any) {
      console.error('saveAddress', error);
      await showError('Save failed', error?.body?.error || error?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id?: number) => {
    if (!id) return;
    const confirmed = await showConfirm({ title: 'Delete address?', text: 'This action cannot be undone.' });
    if (!confirmed.isConfirmed) return;
    try {
      await apiFetch(`/api/addresses/${id}`, { method: 'DELETE' });
      await showSuccess('Address deleted');
      await fetchAddresses();
    } catch (err: any) {
      console.error('deleteAddress', err);
      await showError('Delete failed', err?.body?.error || err?.message || 'Failed to delete address');
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('Reverse geocode failed');
      const data = await res.json();
      const addr = data.address || {};
      const newForm = { ...form } as any;
      newForm.pincode = addr.postcode || newForm.pincode || '';
      newForm.city = addr.city || addr.town || addr.village || addr.county || newForm.city;
      newForm.state = addr.state || newForm.state;
      const parts = [];
      if (addr.house_number) parts.push(addr.house_number);
      if (addr.road) parts.push(addr.road);
      if (addr.suburb) parts.push(addr.suburb);
      if (addr.neighbourhood) parts.push(addr.neighbourhood);
      newForm.addressLine = parts.join(', ') || newForm.addressLine;
      newForm.locality = addr.suburb || addr.neighbourhood || newForm.locality;
      setForm(newForm);
      await showSuccess('Location detected', 'Fields have been pre-filled from your location');
    } catch (err: any) {
      console.error('reverseGeocode', err);
      await showError('Location failed', 'Could not determine address from your location');
    } finally {
      setGeoLoading(false);
    }
  };

  const useCurrentLocation = async () => {
    if (!('geolocation' in navigator)) {
      await showError('Unsupported', 'Geolocation is not available in this browser');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      await reverseGeocode(latitude, longitude);
    }, async (err) => {
      console.error('geolocation error', err);
      setGeoLoading(false);
      await showError('Location failed', 'Unable to read your location');
    }, { enableHighAccuracy: false, timeout: 10000 });
  };

  return (
    <div className="profile-page" ref={profileRef}>
      <div className="profile-container">
        <div className="profile-header" ref={headerRef}>
          <div className="header-content">
            <h1 className="profile-title">Your Profile</h1>
            <div className="role-badge">{role}</div>
          </div>
        </div>

        <div className="addresses-section">
          <div className="section-header">
            <h2>Saved Addresses</h2>
            <button className="btn-add" onClick={openAdd}>
              <span className="btn-icon">+</span>
              Add New Address
            </button>
          </div>

          {showAddForm && (
            <div className="address-form-card" ref={formRef}>
              <div className="form-header">
                <h3>{editingAddress ? 'Edit Address' : 'Add a New Address'}</h3>
                <button className="btn-location" onClick={useCurrentLocation} disabled={geoLoading}>
                  <span className="location-icon">📍</span>
                  {geoLoading ? 'Detecting...' : 'Use Current Location'}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Name <span className="required">*</span></label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Mobile Number <span className="required">*</span></label>
                  <input 
                    name="mobileNo" 
                    value={form.mobileNo} 
                    onChange={(e) => handleChange('mobileNo', e.target.value)}
                    className={errors.mobileNo ? 'error' : ''}
                    placeholder="10-digit number"
                  />
                  {errors.mobileNo && <span className="error-message">{errors.mobileNo}</span>}
                </div>

                <div className="form-group">
                  <label>Alternate Phone</label>
                  <input 
                    name="alternatePhone" 
                    value={form.alternatePhone || ''} 
                    onChange={(e) => handleChange('alternatePhone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Pincode <span className="required">*</span></label>
                  <input 
                    name="pincode" 
                    value={form.pincode} 
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>

                <div className="form-group">
                  <label>Locality</label>
                  <input 
                    name="locality" 
                    value={form.locality || ''} 
                    onChange={(e) => handleChange('locality', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address (Area and Street) <span className="required">*</span></label>
                  <textarea 
                    name="addressLine" 
                    value={form.addressLine} 
                    onChange={(e) => handleChange('addressLine', e.target.value)}
                    className={errors.addressLine ? 'error' : ''}
                    rows={3}
                  />
                  {errors.addressLine && <span className="error-message">{errors.addressLine}</span>}
                </div>

                <div className="form-group">
                  <label>City/District/Town <span className="required">*</span></label>
                  <input 
                    name="city" 
                    value={form.city} 
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <input 
                    name="state" 
                    value={form.state} 
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group full-width">
                  <label>Landmark</label>
                  <input 
                    name="landmark" 
                    value={form.landmark || ''} 
                    onChange={(e) => handleChange('landmark', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <div className="radio-checkbox-group">
                    <div className="address-type-group">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="addressType" 
                          checked={form.addressType === 'home'} 
                          onChange={() => handleChange('addressType', 'home')} 
                        />
                        <span>🏠 Home</span>
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="addressType" 
                          checked={form.addressType === 'work'} 
                          onChange={() => handleChange('addressType', 'work')} 
                        />
                        <span>💼 Work</span>
                      </label>
                    </div>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        name="isDefault" 
                        checked={!!form.isDefault} 
                        onChange={(e) => handleChange('isDefault', e.target.checked)} 
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={saveAddress} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
                <button className="btn-cancel" onClick={cancelForm}>Cancel</button>
              </div>
            </div>
          )}

          {loading && !showAddForm ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading addresses...</p>
            </div>
          ) : (
            <div className="address-list" ref={addressListRef}>
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No addresses saved yet</h3>
                  <p>Add your first delivery address to get started</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="address-item">
                    <div className="address-header-row">
                      <div className="address-title-group">
                        <h3>{addr.name}</h3>
                        <span className={`address-type-badge ${addr.addressType}`}>
                          {addr.addressType === 'home' ? '🏠' : '💼'} {addr.addressType}
                        </span>
                        {addr.isDefault && <span className="default-badge">DEFAULT</span>}
                      </div>
                      <div className="address-actions">
                        <button onClick={() => openEdit(addr)} className="btn-edit">Edit</button>
                        <button onClick={() => deleteAddress(addr.id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                    <div className="address-details">
                      <p className="address-line">
                        <span className="icon">📍</span>
                        {addr.addressLine}{addr.locality ? `, ${addr.locality}` : ''}, {addr.city} - {addr.pincode}, {addr.state}
                      </p>
                      {addr.landmark && (
                        <p className="address-landmark">
                          <span className="icon">🗺️</span>
                          Landmark: {addr.landmark}
                        </p>
                      )}
                      <p className="address-contact">
                        <span className="icon">📞</span>
                        {addr.mobileNo}
                        {addr.alternatePhone && ` • ${addr.alternatePhone}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;