import React, { useEffect, useState } from "react";
import "./SearchResults.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import apiFetch from '../../utils/apiFetch';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

interface SearchResultsProps {
    searchTerm: string;
}

function SearchResults({ searchTerm }: SearchResultsProps) {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart: addProductToCart } = useCart();

    useEffect(() => {
        let cancelled = false;

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const categoriesData: any = await apiFetch('/api/categories');
                if (Array.isArray(categoriesData)) {
                    let allProducts: Product[] = [];
                    for (const category of categoriesData) {
                        try {
                            const productsData: any = await apiFetch(`/api/products/${category.id}`);
                            if (Array.isArray(productsData)) {
                                allProducts = [...allProducts, ...productsData];
                            }
                        } catch (err) {
                            console.warn(`Failed to load products for category ${category.id}`, err);
                        }
                    }

                    const filtered = allProducts.filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (!cancelled) setSearchResults(filtered);
                }
            } catch (error) {
                if (!cancelled) console.error(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSearchResults();

        return () => { cancelled = true; };
    }, [searchTerm]);

    return (
        <div className="search-results">
            {loading ? (
                <div>Loading...</div>
            ) : (
                searchResults.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.image_url} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <span>${product.price}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default SearchResults;
