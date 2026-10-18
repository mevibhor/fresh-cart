import { useContext } from "react";
import { CartContext } from "../context/Cart";

const AddToCartButton = ({ cartItemData }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const alreadyAdded = cartItems.find((item) => item.id === cartItemData.id);

  const stock =
    cartItemData.stock == null
      ? Infinity
      : Math.max(0, Number(cartItemData.stock) || 0);

  const isOutOfStock = stock <= 0;
  const isAtStockLimit = alreadyAdded && alreadyAdded.quantity >= stock;

  return (
    <div className="flex h-9 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-blue-700 text-center text-sm font-medium text-blue-700 sm:w-24">
      {!alreadyAdded ? (
        <button
          type="button"
          onClick={() => addToCart(cartItemData)}
          disabled={isOutOfStock}
          className="h-full w-full transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          aria-label={`Add ${cartItemData.name} to bag`}
        >
          {isOutOfStock ? "Sold out" : "Add +"}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => removeFromCart(cartItemData)}
            className="h-full w-1/3 text-xl transition hover:bg-blue-50"
            aria-label={`Decrease quantity of ${cartItemData.name}`}
          >
            −
          </button>

          <span
            className="w-1/3 text-sm font-semibold"
            aria-live="polite"
            aria-label={`Quantity: ${alreadyAdded.quantity}`}
          >
            {alreadyAdded.quantity}
          </span>

          <button
            type="button"
            onClick={() => addToCart(cartItemData)}
            disabled={isAtStockLimit}
            className="h-full w-1/3 text-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
            aria-label={`Increase quantity of ${cartItemData.name}`}
          >
            +
          </button>
        </>
      )}
    </div>
  );
};

export default AddToCartButton;
