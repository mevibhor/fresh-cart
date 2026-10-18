import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";

import { readOrders } from "../utils/orders";

function getDisplayOrders(storedOrders) {
  const validOrders = storedOrders.filter(
    (order) => order && typeof order === "object",
  );

  const groupedOrders = validOrders.filter((order) =>
    Array.isArray(order.items),
  );

  const legacyItems = validOrders.filter(
    (order) => !Array.isArray(order.items) && order.id != null,
  );

  const legacyOrder =
    legacyItems.length > 0
      ? [
          {
            id: "legacy-orders",
            createdAt: null,
            items: legacyItems,
            subtotal: legacyItems.reduce(
              (sum, item) =>
                sum + Number(item.base_cost || 0) * Number(item.quantity || 0),
              0,
            ),
            deliveryCharge: null,
            total: null,
            isLegacy: true,
          },
        ]
      : [];

  return [...groupedOrders, ...legacyOrder];
}

function formatPrice(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function formatOrderDate(date) {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const Orders = () => {
  const [orders] = useState(() => getDisplayOrders(readOrders()));

  const totalItems = orders.reduce(
    (total, order) =>
      total +
      order.items.reduce(
        (itemTotal, item) => itemTotal + (Number(item.quantity) || 0),
        0,
      ),
    0,
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      {orders.length === 0 ? (
        <section className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 sm:h-28 sm:w-28">
            <FiShoppingBag
              className="h-11 w-11 text-blue-500 sm:h-12 sm:w-12"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-6 font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
            No orders yet
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
            Your order history will appear here once you complete your first
            purchase. Find something you love and get started!
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Start shopping
            <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <>
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiShoppingBag size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your purchases and order details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiPackage size={17} aria-hidden="true" />
                  <span className="text-xs sm:text-sm">Total orders</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {orders.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiShoppingCart size={17} aria-hidden="true" />
                  <span className="text-xs sm:text-sm">Items purchased</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {totalItems}
                </p>
              </div>
            </div>
          </header>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold text-gray-900 sm:text-xl">
              Order history
            </h2>

            <Link
              to="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              Continue shopping
              <FiArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-5">
            {orders.map((order) => {
              const orderDate = formatOrderDate(order.createdAt);
              const orderItemCount = order.items.reduce(
                (total, item) => total + (Number(item.quantity) || 0),
                0,
              );

              return (
                <section
                  key={order.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <header className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-gray-100">
                        <FiPackage size={19} aria-hidden="true" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {order.isLegacy ? "Previous orders" : "Order details"}
                        </h3>

                        {orderDate && (
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
                            <FiCalendar size={13} aria-hidden="true" />
                            Placed on {orderDate}
                          </p>
                        )}

                        {!order.isLegacy && (
                          <p className="mt-1 break-all text-xs text-gray-500">
                            Order ID: {order.id}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:self-center">
                      <FiCheckCircle size={14} aria-hidden="true" />
                      Order placed
                    </div>
                  </header>

                  <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        Items in this order
                      </p>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {orderItemCount}{" "}
                        {orderItemCount === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <ul className="divide-y divide-gray-100">
                      {order.items.map((item, index) => {
                        const quantity = Number(item.quantity) || 0;
                        const unitPrice = Number(item.base_cost) || 0;

                        return (
                          <li
                            key={`${order.id}-${item.id}-${index}`}
                            className="flex min-w-0 gap-3 py-4 sm:gap-5"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name || "Ordered product"}
                                  className="h-full w-full object-contain p-2"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                  <FiShoppingBag size={25} aria-hidden="true" />
                                </div>
                              )}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <h4 className="line-clamp-2 break-words text-sm font-medium leading-5 text-gray-900 sm:text-base">
                                {item.name || "Product"}
                              </h4>

                              {item.category && (
                                <p className="mt-1 text-xs capitalize text-gray-500">
                                  {String(item.category).replaceAll("-", " ")}
                                </p>
                              )}

                              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                                {formatPrice(unitPrice)} × {quantity}
                              </p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end justify-center">
                              <span className="text-sm font-semibold text-gray-900 sm:text-base">
                                {formatPrice(unitPrice * quantity)}
                              </span>
                              <span className="mt-1 text-xs text-gray-400">
                                Item total
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <footer className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:px-6 sm:py-5">
                    {order.isLegacy ? (
                      <p className="text-sm leading-6 text-gray-500">
                        Original delivery charges and order totals were not
                        saved for these older records.
                      </p>
                    ) : (
                      <div className="ml-auto w-full space-y-3 sm:max-w-sm">
                        <dl className="space-y-2.5 text-sm">
                          <div className="flex justify-between gap-4 text-gray-600">
                            <dt>Subtotal</dt>
                            <dd className="tabular-nums">
                              {formatPrice(order.subtotal)}
                            </dd>
                          </div>

                          <div className="flex justify-between gap-4 text-gray-600">
                            <dt className="flex items-center gap-2">
                              <FiTruck size={15} aria-hidden="true" />
                              Delivery
                            </dt>
                            <dd className="tabular-nums">
                              {formatPrice(order.deliveryCharge)}
                            </dd>
                          </div>
                        </dl>

                        <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                          <span className="font-semibold text-gray-900">
                            Total paid
                          </span>
                          <span className="text-xl font-bold text-gray-900 tabular-nums">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    )}
                  </footer>
                </section>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-center sm:flex-row sm:px-5 sm:text-left">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Want to find something else?
              </p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                Browse the store and discover your next favourite product.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Shop now
              <FiArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default Orders;
