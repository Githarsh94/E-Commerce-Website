import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Edit2, Trash2, Save, X, FolderOpen, CheckCircle, AlertCircle } from 'lucide-react';
import apiFetch from '../../utils/apiFetch';
import { showConfirm, showSuccess, showError } from '../../utils/alert';
import './AdminCategories.css';

interface Category {
  id: number;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const setCardRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    cardsRef.current[idx] = el;
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !loading) {
      const tl = gsap.timeline();

      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      })
      .from(cardsRef.current.filter(Boolean) as HTMLDivElement[], {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        clearProps: 'all'
      }, '-=0.3');
    }
  }, [categories, loading]);

  const fetchCategories = async () => {
    try {
      const data: any = await apiFetch('/api/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to load categories', err);
      setCategories([]);
      try { await showError('Failed to load categories', err?.message || 'Server error'); } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, index: number) => {
    const res = await showConfirm({ title: 'Delete category', text: 'Are you sure you want to delete this category?', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' });
    if (!res || !res.isConfirmed) return;

    const card = cardsRef.current[index];
    try {
      await apiFetch(`/api/categories/remove/${id}`, { method: 'DELETE' });
      if (card) {
        gsap.to(card, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setCategories((c) => c.filter(cat => cat.id !== id));
          }
        });
      } else {
        setCategories((c) => c.filter(cat => cat.id !== id));
      }
      try { await showSuccess('Category deleted', 'Category removed successfully'); } catch (e) { /* ignore */ }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Delete failed', err);
      try { await showError('Delete failed', err?.message || 'Server error'); } catch (e) { /* ignore */ }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSave = async (id: number) => {
    if (!editValue.trim()) {
      setMessage({ type: 'error', text: 'Category name cannot be empty' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const updated: any = await apiFetch(`/api/categories/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ newName: editValue })
      });
      setCategories(categories.map(cat => cat.id === id ? { ...cat, name: updated?.name || editValue } : cat));
      setEditingId(null);
      try { await showSuccess('Category updated', 'Category name updated successfully'); } catch (e) { /* ignore */ }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Update failed', err);
      try { await showError('Update failed', err?.message || 'Server error'); } catch (e) { /* ignore */ }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-header" ref={headerRef}>
        <div>
          <h1 className="categories-title">All Categories</h1>
          <p className="categories-subtitle">Manage and organize your product categories</p>
        </div>
        <div className="category-count">
          <FolderOpen size={24} />
          <span>{categories.length} Categories</span>
        </div>
      </div>

      {message && (
        <div className={`toast-message toast-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} strokeWidth={1.5} />
            <p>No categories found</p>
            <span>Add your first category to get started!</span>
          </div>
        ) : (
          categories.map((category, index) => (
            <div
              key={category.id}
              className="category-card"
              ref={(el) => setCardRef(el, index)}
            >
              <div className="card-glow"></div>
              {editingId === category.id ? (
                <div className="category-edit">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="category-input"
                    autoFocus
                  />
                  <div className="category-actions">
                    <button
                      onClick={() => handleSave(category.id)}
                      className="action-button save-button"
                      title="Save"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="action-button cancel-button"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="category-view">
                  <div className="category-icon">
                    <FolderOpen size={24} />
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-id">ID: {category.id}</div>
                  <div className="category-card-viewbtn">
                    <button
                      onClick={() => {
                        // navigate to category description page with id
                        const params = new URLSearchParams({ id: String(category.id) });
                        navigate(`/admin/category-description?${params.toString()}`);
                      }}
                      className="view-button"
                      title="View products"
                    >
                      View
                    </button>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="action-button edit-button"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, index)}
                      className="action-button delete-button"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
