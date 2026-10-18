import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

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

const Orders = () => {
  const [orders] = useState(() => getDisplayOrders(readOrders()));

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-6 font-default sm:px-6 sm:py-8 lg:px-8">
      {orders.length === 0 ? (
        <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <FiShoppingCart
            className="h-20 w-20 text-gray-300 sm:h-24 sm:w-24"
            aria-hidden="true"
          />

          <h1 className="mt-4 font-heading text-xl font-semibold text-gray-700 sm:text-2xl">
            No orders yet
          </h1>

          <p className="mt-2 max-w-sm text-sm text-gray-500 sm:text-base">
            Your completed orders will appear here.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Start shopping
          </Link>
        </section>
      ) : (
        <>
          <header className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"} in your
              history
            </p>
          </header>

          <div className="space-y-5">
            {orders.map((order) => (
              <section
                key={order.id}
                className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {order.isLegacy ? "Previous orders" : "Order details"}
                    </h2>

                    {order.createdAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {!order.isLegacy && (
                    <span className="break-all text-xs text-gray-500">
                      {order.id}
                    </span>
                  )}
                </header>

                <ul className="divide-y divide-gray-100 px-4 sm:px-5">
                  {order.items.map((item, index) => (
                    <li
                      key={`${order.id}-${item.id}-${index}`}
                      className="flex min-w-0 gap-3 py-4 sm:gap-5"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-24 sm:w-24">
                        <img
                          src={item.image}
                          alt={item.name || "Ordered product"}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="line-clamp-2 break-words font-medium text-gray-800">
                          {item.name || "Product"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {Number(item.quantity) || 0}
                        </p>

                        <p className="mt-auto pt-2 text-sm font-semibold text-gray-900">
                          ₹
                          {(
                            Number(item.base_cost || 0) *
                            Number(item.quantity || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-gray-100 px-4 py-4 sm:px-5">
                  {order.isLegacy ? (
                    <p className="text-sm text-gray-500">
                      Original order totals weren't stored for these older
                      records.
                    </p>
                  ) : (
                    <dl className="ml-auto max-w-xs space-y-2 text-sm">
                      <div className="flex justify-between gap-4 text-gray-600">
                        <dt>Subtotal</dt>
                        <dd>₹{Number(order.subtotal || 0).toFixed(2)}</dd>
                      </div>

                      <div className="flex justify-between gap-4 text-gray-600">
                        <dt>Delivery</dt>
                        <dd>₹{Number(order.deliveryCharge || 0).toFixed(2)}</dd>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-gray-100 pt-2 font-semibold text-gray-900">
                        <dt>Total</dt>
                        <dd>₹{Number(order.total || 0).toFixed(2)}</dd>
                      </div>
                    </dl>
                  )}
                </footer>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Orders;
