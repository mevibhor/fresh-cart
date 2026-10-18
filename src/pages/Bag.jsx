import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiShield,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";

import { CartContext, DELIVERY_CHARGE } from "../context/Cart";
import { saveOrder } from "../utils/orders";

const formatPrice = (price) => `₹${Number(price || 0).toFixed(2)}`;

const Bag = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartSubTotal,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const itemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const subtotal = getCartSubTotal();
  const total = getCartTotal();

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const saved = saveOrder({
      items: cartItems,
      subtotal,
      deliveryCharge: DELIVERY_CHARGE,
    });

    if (!saved) {
      window.alert(
        "Your order could not be saved. Please check your browser storage and try again.",
      );
      return;
    }

    clearCart();
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 font-default sm:px-6 lg:px-8">
        <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FiShoppingBag size={36} strokeWidth={1.5} aria-hidden="true" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Your shopping bag
          </p>

          <h1 className="mt-2 font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
            Your bag is waiting for you
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
            Looks like you haven't added anything yet. Explore our products and
            find something you'll love.
          </p>

          <div className="mt-7 flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Start shopping
              <FiArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-700"
            >
              Browse all categories
              <FiArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      {/* Page heading */}
      <header className="mb-7">
        <Link
          to="/categories"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-700"
        >
          <FiArrowLeft size={17} aria-hidden="true" />
          Continue browsing
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Almost yours
            </p>

            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your bag
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your items before placing your order.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
            <FiShoppingBag
              size={19}
              className="text-blue-600"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-gray-900">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </header>

      {/* Cart and order summary */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-8">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold text-gray-900">
              Bag items
            </h2>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to remove all items from your bag?",
                  )
                ) {
                  clearCart();
                }
              }}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 sm:text-sm"
            >
              <FiTrash2 size={15} aria-hidden="true" />
              Clear bag
            </button>
          </div>

          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {cartItems.map((item) => {
              const stock =
                item.stock == null
                  ? Infinity
                  : Math.max(0, Number(item.stock) || 0);

              const isAtStockLimit = item.quantity >= stock;

              return (
                <li
                  key={item.id}
                  className="flex min-w-0 gap-3 p-3 sm:gap-5 sm:p-5"
                >
                  <Link
                    to={`/product/${item.id}`}
                    aria-label={`View ${item.name}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-32 sm:w-32"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name || "Product"}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 sm:p-3"
                      />
                    ) : (
                      <FiShoppingBag
                        size={26}
                        className="text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <div className="min-w-0">
                        {item.category && (
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600 sm:text-xs">
                            {item.category.replaceAll("-", " ")}
                          </p>
                        )}

                        <Link
                          to={`/product/${item.id}`}
                          className="line-clamp-2 break-words text-sm font-semibold leading-5 text-gray-900 transition hover:text-blue-700 sm:text-base sm:leading-6"
                        >
                          {item.name}
                        </Link>

                        {item.brand && (
                          <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
                            {item.brand}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-right text-sm font-bold text-gray-900 sm:text-base">
                        {formatPrice(
                          Number(item.base_cost) * Number(item.quantity),
                        )}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                      <div>
                        <p className="mb-1.5 text-[10px] text-gray-400 sm:text-xs">
                          Unit price: {formatPrice(item.base_cost)}
                        </p>

                        <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-10">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:w-10"
                          >
                            <FiMinus size={14} aria-hidden="true" />
                          </button>

                          <span
                            className="min-w-8 text-center text-sm font-semibold text-gray-900"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            disabled={isAtStockLimit}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-full w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300 sm:w-10"
                          >
                            <FiPlus size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          for (
                            let count = 0;
                            count < item.quantity;
                            count += 1
                          ) {
                            removeFromCart(item);
                          }
                        }}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <FiTrash2 size={14} aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Reassurance strip */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiTruck size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Delivery details
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Delivery charge shown at checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                <FiShield size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Review before ordering
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Check quantities and total below
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order summary */}
        <aside className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-20">
          <h2 className="font-heading text-xl font-bold text-gray-900">
            Order summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">Your order at a glance</p>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">Items ({itemCount})</dt>
              <dd className="text-right font-medium text-gray-900">
                {formatPrice(subtotal)}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">Delivery charges</dt>
              <dd className="text-right font-medium text-gray-900">
                {formatPrice(DELIVERY_CHARGE)}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-dashed border-gray-200 pt-4">
              <dt className="font-semibold text-gray-900">Total amount</dt>
              <dd className="text-right text-xl font-bold tracking-tight text-gray-900">
                {formatPrice(total)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3">
            <FiCheckCircle
              size={17}
              className="mt-0.5 shrink-0 text-green-700"
              aria-hidden="true"
            />
            <p className="text-xs leading-5 text-green-800">
              Your order total includes the delivery charge shown above.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
          >
            Place order
            <FiArrowRight size={18} aria-hidden="true" />
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-gray-400">
            Review your items and quantities before confirming.
          </p>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <Link
              to="/orders"
              className="flex min-h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-blue-700"
            >
              <FiPackageFallback />
              View previous orders
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
};

function FiPackageFallback() {
  return <FiShoppingBag size={16} aria-hidden="true" />;
}

export default Bag;
