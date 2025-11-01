// Make this file a module so TypeScript's --isolatedModules accepts it
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/apiFetch';
import { showSuccess, showError, showConfirm } from '../../utils/alert';
import { Edit, Trash2 } from 'lucide-react';
import './CategoryDescription.css';
import '../AddCategory/AddCategory.css';

interface Product {
	id: number;
	name: string;
	description?: string;
	price: number;
	stock: number;
	categoryId?: number;
}

const useQuery = () => new URLSearchParams(useLocation().search);

export default function CategoryDescription() {
	const query = useQuery();
	const navigate = useNavigate();
	const idParam = query.get('id');
	const categoryId = idParam ? parseInt(idParam, 10) : null;

	const [categoryName, setCategoryName] = useState<string>('');
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [adding, setAdding] = useState<boolean>(false);
	const [newProduct, setNewProduct] = useState<{ name: string; description: string; price: string; stock: string }>({ name: '', description: '', price: '', stock: '' });
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editValues, setEditValues] = useState<{ name: string; description: string; price: string; stock: string }>({ name: '', description: '', price: '', stock: '' });

	useEffect(() => {
		if (!categoryId) return;
		const fetchData = async () => {
			setLoading(true);
			try {
				// load category name (backend doesn't provide single category endpoint)
				const cats: any = await apiFetch('/api/categories');
				const found = Array.isArray(cats) ? cats.find((c: any) => c.id === categoryId) : null;
				setCategoryName(found ? found.name : `Category ${categoryId}`);

				const res: any = await apiFetch(`/api/products/${categoryId}`);
				setProducts(Array.isArray(res) ? res : []);
			} catch (err: any) {
				console.error('Failed to load products', err);
				try { await showError('Load failed', err?.message || 'Failed to load products'); } catch (e) {}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [categoryId]);

	const handleStartAdd = () => {
		setAdding(true);
		setNewProduct({ name: '', description: '', price: '', stock: '' });
	};

	const handleCancelAdd = () => {
		setAdding(false);
		setEditingId(null);
		setNewProduct({ name: '', description: '', price: '', stock: '' });
	};

	const handleEditProduct = (product: Product) => {
		// Open the add/edit form prefilled (same UX as AddCategory)
		setEditingId(product.id);
		setNewProduct({
			name: product.name || '',
			description: product.description || '',
			price: String(product.price || 0),
			stock: String(product.stock || 0),
		});
		setAdding(true);
	};

	const handleDeleteProduct = (productId: number) => {
		handleDelete(productId);
	};

	const handleCreateProduct = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!newProduct.name.trim()) {
			try { await showError('Validation', 'Product name is required'); } catch (e) {}
			return;
		}
		setLoading(true);
		try {
			const body = { name: newProduct.name, description: newProduct.description, price: parseFloat(newProduct.price || '0') || 0, stock: parseInt(newProduct.stock || '0', 10) || 0, categoryId };
			if (editingId) {
				// update existing product
				await apiFetch(`/api/products/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
				setProducts((p) => p.map(item => item.id === editingId ? { ...item, ...body } as Product : item));
				try { await showSuccess('Product updated', 'Product was updated successfully'); } catch (e) {}
				setEditingId(null);
			} else {
				const created: any = await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(body) });
				setProducts((p) => [created, ...p]);
				try { await showSuccess('Product added', 'Product was created successfully'); } catch (e) {}
			}
			setAdding(false);
			setNewProduct({ name: '', description: '', price: '', stock: '' });
		} catch (err: any) {
			console.error('Create/Update failed', err);
			try { await showError('Operation failed', err?.body?.error || err?.message || 'Failed to save product'); } catch (e) {}
		} finally {
			setLoading(false);
		}
	};

	const startEdit = (p: Product) => {
		setEditingId(p.id);
		setEditValues({ name: p.name || '', description: p.description || '', price: String(p.price || ''), stock: String(p.stock || '') });
	};

	const cancelEdit = () => {
		setEditingId(null);
	};

	const saveEdit = async (productId: number) => {
		try {
			const body = { name: editValues.name, description: editValues.description, price: parseFloat(editValues.price || '0') || 0, stock: parseInt(editValues.stock || '0', 10) || 0 };
			const updated: any = await apiFetch(`/api/products/${productId}`, { method: 'PUT', body: JSON.stringify(body) });
			setProducts((p) => p.map(item => item.id === productId ? { ...item, ...body } as Product : item));
			try { await showSuccess('Product updated', 'Product details updated'); } catch (e) {}
			setEditingId(null);
		} catch (err: any) {
			console.error('Update failed', err);
			try { await showError('Update failed', err?.body?.error || err?.message || 'Failed to update product'); } catch (e) {}
		}
	};

	const handleDelete = async (productId: number) => {
		const res = await showConfirm({ title: 'Delete product', text: 'Are you sure you want to delete this product?', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' });
		if (!res || !res.isConfirmed) return;
		try {
			await apiFetch(`/api/products/${productId}`, { method: 'DELETE' });
			setProducts((p) => p.filter(item => item.id !== productId));
			try { await showSuccess('Product deleted', 'Product removed'); } catch (e) {}
		} catch (err: any) {
			console.error('Delete failed', err);
			try { await showError('Delete failed', err?.body?.error || err?.message || 'Failed to delete product'); } catch (e) {}
		}
	};

	return (
		<div className="category-desc-page">
			<div className="category-desc-header">
				<h2>Category: {categoryName}</h2>
				<div className="category-meta">ID: {categoryId}</div>
			</div>

			<div className="category-actions-row">
				<button className="btn-primary" onClick={handleStartAdd}>Add New Product</button>
				<button className="btn-secondary" onClick={() => navigate('/admin/categories')}>Back to Categories</button>
			</div>

			{adding && (
				<form onSubmit={handleCreateProduct} className="product-form">
					<h2 className="form-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

					<div className="form-group">
						<label className="form-label">Product Name</label>
						<input
							type="text"
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							className="form-input"
							placeholder="Enter product name"
							disabled={loading}
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Description</label>
						<textarea
							value={newProduct.description}
							onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
							className="form-input form-textarea"
							placeholder="Enter product description"
							rows={3}
							disabled={loading}
						/>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label className="form-label">Price</label>
							<input
								type="number"
								step="0.01"
								value={newProduct.price}
								onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
								className="form-input"
								placeholder="0.00"
								disabled={loading}
							/>
						</div>

						<div className="form-group">
							<label className="form-label">Stock</label>
							<input
								type="number"
								value={newProduct.stock}
								onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
								className="form-input"
								placeholder="0"
								disabled={loading}
							/>
						</div>
					</div>

					<div className="form-group">
						<label className="form-label">Image URL (optional)</label>
						<input
							type="text"
							value={(newProduct as any).image_url || ''}
							onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value } as any)}
							className="form-input"
							placeholder="https://example.com/image.jpg"
							disabled={loading}
						/>
					</div>

					<div className="form-actions">
						<button
							type="button"
							className="cancel-button"
							onClick={handleCancelAdd}
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
									<span>{editingId ? 'Updating...' : 'Adding...'}</span>
								</>
							) : (
								<>
									<span>{editingId ? 'Update Product' : 'Add Product'}</span>
								</>
							)}
						</button>
					</div>
				</form>
			)}

			{loading ? (
				<p>Loading products...</p>
			) : (
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
			)}
		</div>
	);
}


