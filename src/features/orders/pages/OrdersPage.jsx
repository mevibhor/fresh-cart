import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiPackage,
  FiShoppingBag,
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

const OrdersPage = () => {
  const [orders] = useState(() => getDisplayOrders(readOrders()));
  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((currentOrders) =>
      currentOrders.includes(orderId)
        ? currentOrders.filter((id) => id !== orderId)
        : [...currentOrders, orderId],
    );
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      {orders.length === 0 ? (
        <section className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 sm:h-28 sm:w-28">
            <FiShoppingBag
              className="text-blue-500 h-11 w-11 sm:h-12 sm:w-12"
              aria-hidden="true"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900 font-heading sm:text-3xl">
            No orders yet
          </h1>

          <p className="max-w-sm mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            Your order history will appear here once you complete your first
            purchase. Find something you love and get started!
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-6 text-sm font-semibold text-white transition bg-blue-600 rounded-lg min-h-11 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Start shopping
            <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-4 mb-7 sm:mb-8">
            <div className="flex items-center min-w-0 gap-3">
              <div className="flex items-center justify-center text-blue-600 h-11 w-11 shrink-0 rounded-xl bg-blue-50">
                <FiShoppingBag size={22} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 font-heading sm:text-3xl">
                  My Orders
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your purchases and order details.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shrink-0">
              <FiPackage
                size={17}
                className="text-blue-600"
                aria-hidden="true"
              />
              <span className="text-sm text-gray-600">Total orders</span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-sm font-semibold tabular-nums text-blue-700">
                {orders.length}
              </span>
            </div>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-lg font-semibold text-gray-900 font-heading sm:text-xl">
              Order history
            </h2>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-200 rounded-lg min-h-10 hover:border-blue-200 hover:text-blue-600"
            >
              Continue shopping
              <FiArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const orderDate = formatOrderDate(order.createdAt);
              const orderItemCount = order.items.reduce(
                (total, item) => total + (Number(item.quantity) || 0),
                0,
              );

              const isExpanded = expandedOrders.includes(order.id);
              const detailsId = `order-details-${order.id}`;

              return (
                <section
                  key={order.id}
                  className={`min-w-0 overflow-hidden rounded-xl border bg-white transition-colors ${
                    isExpanded ? "border-blue-200 shadow-sm" : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleOrder(order.id)}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                    className="flex items-center w-full min-w-0 gap-3 px-4 py-4 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:gap-4 sm:px-5"
                  >
                    <div className="flex items-center justify-center w-10 h-10 text-blue-600 rounded-lg shrink-0 bg-blue-50">
                      <FiPackage size={19} aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                          {order.isLegacy ? "Previous orders" : "Order details"}
                        </h3>

                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {orderItemCount}{" "}
                          {orderItemCount === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center mt-1 text-xs text-gray-500 gap-x-3 gap-y-1 sm:text-sm">
                        {orderDate && (
                          <span className="flex items-center gap-1.5">
                            <FiCalendar size={13} aria-hidden="true" />
                            {orderDate}
                          </span>
                        )}

                        {!order.isLegacy && (
                          <span className="truncate">Order #{order.id}</span>
                        )}
                      </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
                      <FiCheckCircle size={13} aria-hidden="true" />
                      Placed
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold text-gray-900 sm:text-base">
                        {order.isLegacy
                          ? formatPrice(order.subtotal)
                          : formatPrice(order.total)}
                      </span>

                      <FiChevronDown
                        size={19}
                        aria-hidden="true"
                        className={`text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div id={detailsId} className="border-t border-gray-100">
                      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                        <h4 className="text-sm font-semibold text-gray-800">
                          Order items
                        </h4>

                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 sm:hidden">
                          <FiCheckCircle size={13} aria-hidden="true" />
                          Order placed
                        </span>
                      </div>

                      <ul className="px-4 divide-y divide-gray-100 sm:px-5">
                        {order.items.map((item, index) => {
                          const quantity = Number(item.quantity) || 0;
                          const unitPrice = Number(item.base_cost) || 0;

                          return (
                            <li
                              key={`${order.id}-${item.id}-${index}`}
                              className="flex min-w-0 gap-3 py-4 sm:gap-4"
                            >
                              <div className="w-16 h-16 overflow-hidden border border-gray-100 rounded-lg shrink-0 bg-gray-50 sm:h-20 sm:w-20">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name || "Ordered product"}
                                    className="object-contain w-full h-full p-2"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full text-gray-300">
                                    <FiShoppingBag
                                      size={23}
                                      aria-hidden="true"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col justify-center flex-1 min-w-0">
                                <h5 className="text-sm font-medium leading-5 text-gray-900 break-words line-clamp-2 sm:text-base">
                                  {item.name || "Product"}
                                </h5>

                                {item.category && (
                                  <p className="mt-1 text-xs text-gray-500 capitalize">
                                    {String(item.category).replaceAll("-", " ")}
                                  </p>
                                )}

                                <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                                  {formatPrice(unitPrice)} × {quantity}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-center shrink-0">
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

                      <footer className="px-4 py-4 border-t border-gray-100 bg-gray-50/70 sm:px-5 sm:py-5">
                        {order.isLegacy ? (
                          <p className="text-sm leading-6 text-gray-500">
                            Delivery charges and the original order total were
                            not saved for these older records.
                          </p>
                        ) : (
                          <div className="w-full space-y-3 sm:ml-auto sm:max-w-sm">
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

                            <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200">
                              <span className="font-semibold text-gray-900">
                                Total paid
                              </span>
                              <span className="text-lg font-bold text-gray-900 tabular-nums sm:text-xl">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        )}
                      </footer>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};

export default OrdersPage;
