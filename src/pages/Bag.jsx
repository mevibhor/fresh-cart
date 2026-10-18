import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

import { CartContext, DELIVERY_CHARGE } from "../context/Cart";
import { saveOrder } from "../utils/orders";
import emptybag from "../assets/empty bag.svg";

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

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    const saved = saveOrder({
      items: cartItems,
      subtotal: getCartSubTotal(),
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

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      {cartItems.length === 0 ? (
        <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <img src={emptybag} alt="" className="mb-4 w-40 max-w-full sm:w-56" />

          <h1 className="font-heading text-xl font-semibold text-gray-800 sm:text-2xl">
            Your bag is currently empty.
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse the catalogue and add something you like.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-orange-600 px-5 py-2 font-medium text-orange-700 transition hover:bg-orange-50"
          >
            Continue shopping
          </Link>
        </section>
      ) : (
        <>
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
                Your Bag
              </h1>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-blue-600 px-2 text-sm font-medium text-white">
                {cartItems.length}
              </span>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
            >
              <span>Clear bag</span>
              <MdDeleteForever size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section aria-label="Items in your bag" className="min-w-0">
              <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-3 sm:px-5">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 gap-3 py-4 sm:gap-5"
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-32 sm:w-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <Link
                        to={`/product/${item.id}`}
                        className="line-clamp-2 break-words font-medium text-gray-800 hover:text-blue-700"
                      >
                        {item.name}
                      </Link>

                      {item.base_qty && (
                        <span className="mt-1 text-xs text-gray-500 sm:text-sm">
                          {item.base_qty}
                        </span>
                      )}

                      <p className="mt-2 font-semibold text-gray-900">
                        ₹{Number(item.base_cost).toFixed(2)}
                      </p>

                      <div className="mt-3 inline-flex h-9 items-center overflow-hidden rounded-lg border border-blue-600 text-blue-700">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="h-full w-9 text-xl transition hover:bg-blue-50"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={
                            item.stock != null &&
                            item.quantity >= Number(item.stock)
                          }
                          className="h-full w-9 text-xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="shrink-0 self-start text-sm font-semibold text-gray-800">
                      ₹{(Number(item.base_cost) * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:sticky lg:top-20">
              <h2 className="font-heading text-xl font-semibold text-gray-900">
                Order summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between gap-4">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">
                    ₹{Number(getCartSubTotal()).toFixed(2)}
                  </dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt>Delivery charges</dt>
                  <dd className="font-medium text-gray-900">
                    ₹{DELIVERY_CHARGE.toFixed(2)}
                  </dd>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd>₹{Number(getCartTotal()).toFixed(2)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="mt-6 min-h-12 w-full rounded-lg bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Place order
              </button>
            </aside>
          </div>
        </>
      )}
    </main>
  );
};

export default Bag;
