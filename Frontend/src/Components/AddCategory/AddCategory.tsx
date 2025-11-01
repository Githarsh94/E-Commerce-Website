import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import apiFetch from '../../utils/apiFetch';
import { Plus, Sparkles, Edit, Trash2, Package } from 'lucide-react';
import './AddCategory.css';
import { showSuccess, showError, showConfirm } from '../../utils/alert';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  categoryId: number;
}

export default function AddCategory() {
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryExists, setCategoryExists] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(containerRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.add-category-header', {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3');

    const formGroups = formRef.current ? Array.from(formRef.current.querySelectorAll('.form-group')) as HTMLElement[] : [];
    if (formGroups.length > 0) {
      tl.from(formGroups, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      }, '-=0.2');
    }

    if (buttonRef.current) {
      tl.from(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        clearProps: 'all',
        onComplete: () => {
          try {
            if (buttonRef.current) {
              buttonRef.current.style.opacity = '1';
              buttonRef.current.style.visibility = 'visible';
              buttonRef.current.style.transform = 'none';
            }
          } catch (e) {}
        }
      }, '-=0.15');
    }
  }, [categoryExists]);

  const checkCategory = async () => {
    if (!categoryInput.trim()) {
      try {
        await showError('Input required', 'Please enter a category name or ID');
      } catch (e) {}
      gsap.to(inputRef.current, { x: 10, duration: 0.4, ease: 'power2.inOut' });
      return;
    }

    setLoading(true);

    try {
      const isNumeric = /^\d+$/.test(categoryInput.trim());
      let category;

      if (isNumeric) {
        category = await apiFetch(`/api/categories/${categoryInput}`);
      } else {
        const categories = await apiFetch('/api/categories');
        category = categories.find((cat: any) =>
          cat.name.toLowerCase() === categoryInput.trim().toLowerCase()
        );
      }

      if (category) {
        setCategoryExists(true);
        setCurrentCategory(category);
        await loadProducts(category.id);
        try {
          await showSuccess('Category found', `Managing products for "${category.name}"`);
        } catch (e) {}
      } else {
        await createNewCategory();
      }
    } catch (error: any) {
      const msg = error?.body?.error || error?.message || 'Failed to check category';
      try {
        await showError('Error', msg);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const createNewCategory = async () => {
    try {
      const newCategory = await apiFetch('/api/categories/add', {
        method: 'POST',
        body: JSON.stringify({ name: categoryInput }),
      });

      try {
        await showSuccess('Category created', 'The category was created successfully');
      } catch (e) {}

      setCategoryExists(true);
      setCurrentCategory(newCategory);
      setProducts([]);
    } catch (error: any) {
      const msg = error?.body?.error || error?.message || 'Failed to create category';
      try {
        await showError('Create category failed', msg);
      } catch (e) {}
      throw error;
    }
  };

  const loadProducts = async (categoryId: number) => {
    try {
      const allProducts = await apiFetch('/api/products');
      const categoryProducts = allProducts.filter((p: Product) => p.categoryId === categoryId);
      setProducts(categoryProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name || !productForm.description || !productForm.price || !productForm.stock) {
      try {
        await showError('Validation error', 'All fields are required');
      } catch (e) {}
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        categoryId: currentCategory.id,
        image_url: productForm.image_url || undefined,
      };

      if (editingProduct) {
        await apiFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
        try {
          await showSuccess('Product updated', 'The product was updated successfully');
        } catch (e) {}
      } else {
        await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        try {
          await showSuccess('Product added', 'The product was added successfully');
        } catch (e) {}
      }

      await loadProducts(currentCategory.id);
      resetProductForm();
    } catch (error: any) {
      const msg = error?.body?.error || error?.message || 'Failed to save product';
      try {
        await showError('Operation failed', msg);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const result = await showConfirm({
        title: 'Delete product',
        text: 'Are you sure you want to delete this product?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });
      if (!result.isConfirmed) return;
    } catch (e) {
      // fallback to native confirm if Swal fails
      if (!window.confirm('Are you sure you want to delete this product?')) return;
    }

    setLoading(true);

    try {
      await apiFetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      try {
        await showSuccess('Product deleted', 'The product was removed successfully');
      } catch (e) {}
      await loadProducts(currentCategory.id);
    } catch (error: any) {
      const msg = error?.body?.error || error?.message || 'Failed to delete product';
      try {
        await showError('Delete failed', msg);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleInputFocus = () => {
    gsap.to(inputRef.current, { scale: 1.01, duration: 0.2, ease: 'power2.out' });
  };

  const handleInputBlur = () => {
    gsap.to(inputRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  if (categoryExists && currentCategory) {
    return (
      <div className="add-category-page">
        <div className="add-category-container" ref={containerRef}>
          <div className="decorative-blob blob-1"></div>
          <div className="decorative-blob blob-2"></div>

          <div className="add-category-header">
            <div className="header-icon">
              <Package size={32} />
            </div>
            <h1 className="add-category-title">Manage Products</h1>
            <p className="add-category-subtitle">Category: {currentCategory.name}</p>
            <button
              className="back-button"
              onClick={() => {
                setCategoryExists(false);
                setCurrentCategory(null);
                setCategoryInput('');
                setProducts([]);
              }}
            >
              ← Back to Categories
            </button>
          </div>

          {!showProductForm && (
            <div className="products-section">
              <button
                className="add-product-button"
                onClick={() => setShowProductForm(true)}
              >
                <Plus size={20} />
                Add New Product
              </button>

              <div className="products-list">
                {products.length === 0 ? (
                  <p className="no-products">No products yet. Add your first product!</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="product-details">
                          <span className="price">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(product.price))}</span>
                          <span className="stock">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <div className="product-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="product-form">
              <h2 className="form-title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter product name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Enter product description"
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="form-input"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="form-input"
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetProductForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>{editingProduct ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="add-category-page">
      <div className="add-category-container" ref={containerRef}>
        <div className="decorative-blob blob-1"></div>
        <div className="decorative-blob blob-2"></div>

        <div className="add-category-header">
          <div className="header-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="add-category-title">Category & Products</h1>
          <p className="add-category-subtitle">Enter category name/ID to manage products or create new</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); checkCategory(); }} className="add-category-form" ref={formRef}>
          <div className="form-group">
            <label htmlFor="categoryInput" className="form-label">
              Category Name or ID
            </label>
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                id="categoryInput"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="e.g., Electronics or 1"
                className="form-input"
                disabled={loading}
              />
              <div className="input-underline"></div>
            </div>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Plus size={22} strokeWidth={2.5} />
                <span>Continue</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
