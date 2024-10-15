import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        console.log("Adding to cart:", product);
        const existingItem = cart.find(item => 
            item.productID === product.productID && 
            item.selectedAttribute === product.selectedAttribute &&
            item.variation === product.variation
        );

        if (existingItem) {
            console.log("Item exists in cart. Increasing quantity.");
            setCart(prev => 
                prev.map(item => 
                    item.productID === product.productID && item.selectedAttribute === product.selectedAttribute && item.variation === product.variation
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            console.log("Item does not exist in cart. Adding new item.");
            setCart(prev => [...prev, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productID, selectedAttribute, variation) => {
        console.log(`Removing item from cart: ID=${productID}, Attribute=${selectedAttribute}, Variation=${variation}`);
        setCart((prev) => 
            prev.filter(item => 
                !(item.productID === productID && item.selectedAttribute === selectedAttribute && item.variation === variation)
            )
        );
    };

    const clearCart = () => {
        console.log("Clearing the cart.");
        setCart([]);
    };
    

    const decrementQuantity = async (productID, selectedAttribute, variation) => {
        const Inventoryid = productID;
        try {
            // Fetch current quantity from the database for the specific variation
            const response = await fetch(`/api/inventory/fetch/${Inventoryid}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product quantity");
            }
    
            const productData = await response.json();
            const variationData = productData.variations.find(v => v.variantName === variation);
    
            if (!variationData) {
                throw new Error("Variation not found");
            }
    
            const availableQuantity = variationData.quantity;
    
            // Update cart state based on the available quantity
            setCart(prev => {
                const product = prev.find(item => 
                    item.productID === productID && 
                    item.selectedAttribute === selectedAttribute && 
                    item.variation === variation
                );
    
                if (product) {
                    if (product.quantity > 1 && availableQuantity > 0) {
                        console.log("Quantity Decreased");
                        return prev.map(item =>
                            item.productID === productID && item.selectedAttribute === selectedAttribute && item.variation === variation
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        );
                    } else if (product.quantity === 1) {
                        return prev.filter(item => item.productID !== productID || item.selectedAttribute !== selectedAttribute || item.variation !== variation);
                    }
                }
                console.log(availableQuantity);
                return prev; // No changes if the product isn't found
            });
        } catch (error) {
            console.error("Error fetching product quantity:", error);
        }
    };
    
    
    

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, decrementQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
