import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CartContext = createContext(null);

export const DELIVERY_CHARGE = 30;

const CART_STORAGE_KEY = "cartItems";

function readStoredCart() {
  try {
    const storedValue = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .filter(
        (item) =>
          item &&
          item.id != null &&
          Number.isFinite(Number(item.base_cost)) &&
          Number(item.base_cost) >= 0 &&
          Number.isFinite(Number(item.quantity)) &&
          Number(item.quantity) > 0,
      )
      .map((item) => ({
        ...item,
        base_cost: Number(item.base_cost),
        quantity: Math.floor(Number(item.quantity)),
      }))
      .filter((item) => item.quantity > 0);
  } catch {
    return [];
  }
}

function getItemStock(item) {
  if (item.stock == null || !Number.isFinite(Number(item.stock))) {
    return Infinity;
  }

  return Math.max(0, Number(item.stock));
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keep the in-memory cart usable if browser storage is unavailable.
    }
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    if (!item || item.id == null) {
      return;
    }

    const stock = getItemStock(item);

    if (stock <= 0) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          return currentItems;
        }

        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                ...item,
                quantity: Math.min(cartItem.quantity + 1, stock),
              }
            : cartItem,
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((item) => {
    if (!item || item.id == null) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (!existingItem) {
        return currentItems;
      }

      if (existingItem.quantity <= 1) {
        return currentItems.filter((cartItem) => cartItem.id !== item.id);
      }

      return currentItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartSubTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.base_cost) * Number(item.quantity),
        0,
      ),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartSubTotal + (cartItems.length > 0 ? DELIVERY_CHARGE : 0),
    [cartSubTotal, cartItems.length],
  );

  const getCartSubTotal = useCallback(() => cartSubTotal, [cartSubTotal]);

  const getCartTotal = useCallback(() => cartTotal, [cartTotal]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartSubTotal,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartSubTotal,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
