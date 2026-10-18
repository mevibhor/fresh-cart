import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiShoppingBag,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

import { readOrders } from "../../orders/utils/orders";

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
        <section className="w-full max-w-md p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl sm:p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto text-gray-500 bg-gray-100 rounded-full">
            <FiShoppingBag size={28} aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900 font-heading">
            No recent order found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            It looks like there isnt an order to confirm here. Visit your orders
            or continue shopping to place an order.
          </p>

          <div className="flex flex-col gap-3 mt-7">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="px-5 py-3 text-sm font-semibold text-gray-700 transition border border-gray-300 min-h-12 rounded-xl hover:bg-gray-50"
            >
              View my orders
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-3 text-sm font-semibold text-white transition bg-blue-600 min-h-12 rounded-xl hover:bg-blue-700"
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
      <section className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
        {/* Success header */}
        <div className="px-5 py-8 text-center bg-blue-50/70 sm:px-10 sm:py-10">
          <div className="flex items-center justify-center w-16 h-16 mx-auto text-green-700 bg-green-100 rounded-full ring-8 ring-white/70">
            <FiCheck size={32} strokeWidth={2.5} aria-hidden="true" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-green-700">
            Order confirmed
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 font-heading sm:text-3xl">
            Thank you for your order!
          </h1>

          <p className="max-w-md mx-auto mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            Your order has been saved successfully. Here is a summary of what
            you have ordered.
          </p>

          <div className="mx-auto mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-semibold text-gray-900 break-all">
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
            <h2 className="text-xl font-bold text-gray-900 font-heading">
              Order summary
            </h2>

            <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <ul className="mt-5 divide-y divide-gray-100">
            {latestOrder.items.map((item, index) => (
              <li
                key={`${latestOrder.id}-${item.id}-${index}`}
                className="flex min-w-0 gap-3 py-4 sm:gap-5"
              >
                <div className="w-20 h-20 overflow-hidden border border-gray-100 shrink-0 rounded-xl bg-gray-50 sm:h-24 sm:w-24">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Ordered product"}
                      loading="lazy"
                      className="object-contain w-full h-full p-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FiPackage size={24} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 break-words sm:text-base">
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

          <div className="p-4 mt-3 rounded-xl bg-gray-50 sm:p-5">
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

              <div className="flex justify-between gap-4 pt-3 text-base font-bold text-gray-900 border-t border-gray-200">
                <dt>Total</dt>
                <dd>{formatPrice(latestOrder.total)}</dd>
              </div>
            </dl>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 gap-3 mt-7 sm:grid-cols-2">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 transition border border-gray-300 min-h-12 rounded-xl hover:bg-gray-50"
            >
              <FiPackage size={18} aria-hidden="true" />
              View all orders
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white transition bg-blue-600 min-h-12 rounded-xl hover:bg-blue-700"
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
