import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    categoryId?: number;
}

interface WishlistContextType {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    isWishlistOpen: boolean;
    toggleWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const addToWishlist = (product: Product) => {
        setWishlistItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (!exists) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const removeFromWishlist = (productId: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const toggleWishlist = () => {
        setIsWishlistOpen(prev => !prev);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            isWishlistOpen,
            toggleWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
