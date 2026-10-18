import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiShoppingBag,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

import { readOrders } from "../utils/orders";

const formatPrice = (price) => `₹${Number(price || 0).toFixed(2)}`;

const Checkout = () => {
  const navigate = useNavigate();

  // Orders are stored newest-first, so the latest one is shown here.
  const latestOrder = useMemo(() => {
    const orders = readOrders();
    return orders.find(
      (order) => order && Array.isArray(order.items) && order.items.length > 0,
    );
  }, []);

  if (!latestOrder) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 font-default sm:px-6">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <FiShoppingBag size={28} aria-hidden="true" />
          </div>

          <h1 className="mt-5 font-heading text-2xl font-bold text-gray-900">
            No recent order found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            It looks like there isn't an order to confirm here. Visit your
            orders or continue shopping to place an order.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="min-h-12 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View my orders
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="min-h-12 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue shopping
            </button>
          </div>
        </section>
      </main>
    );
  }

  const itemCount = latestOrder.items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-4xl px-4 py-8 font-default sm:px-6 sm:py-12">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Success header */}
        <div className="bg-blue-50/70 px-5 py-8 text-center sm:px-10 sm:py-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 ring-8 ring-white/70">
            <FiCheck size={32} strokeWidth={2.5} aria-hidden="true" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-green-700">
            Order confirmed
          </p>

          <h1 className="mt-2 font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
            Your order has been saved successfully. Here's a summary of what
            you've ordered.
          </p>

          <div className="mx-auto mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="break-all font-semibold text-gray-900">
              {latestOrder.id}
            </span>
          </div>

          {latestOrder.createdAt && (
            <p className="mt-3 text-xs text-gray-500">
              Placed on{" "}
              {new Date(latestOrder.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        {/* Order summary */}
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-xl font-bold text-gray-900">
              Order summary
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <ul className="mt-5 divide-y divide-gray-100">
            {latestOrder.items.map((item, index) => (
              <li
                key={`${latestOrder.id}-${item.id}-${index}`}
                className="flex min-w-0 gap-3 py-4 sm:gap-5"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Ordered product"}
                      loading="lazy"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <FiPackage size={24} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <h3 className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                    {item.name || "Product"}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Quantity: {Number(item.quantity) || 0}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatPrice(
                      Number(item.base_cost) * Number(item.quantity),
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 rounded-xl bg-gray-50 p-4 sm:p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-gray-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-gray-900">
                  {formatPrice(latestOrder.subtotal)}
                </dd>
              </div>

              <div className="flex justify-between gap-4 text-gray-600">
                <dt>Delivery charges</dt>
                <dd className="font-medium text-gray-900">
                  {formatPrice(latestOrder.deliveryCharge)}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd>{formatPrice(latestOrder.total)}</dd>
              </div>
            </dl>
          </div>

          {/* Navigation */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/orders"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <FiPackage size={18} aria-hidden="true" />
              View all orders
            </Link>

            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue shopping
              <FiArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
