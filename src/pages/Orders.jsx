import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

const readStoredOrders = () => {
  try {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    return Array.isArray(storedOrders) ? storedOrders : [];
  } catch {
    return [];
  }
};

const Orders = () => {
  const [orders] = useState(readStoredOrders);

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
        </section>
      ) : (
        <>
          <header className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
              My Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? "item" : "items"} saved in
              your order history
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {orders.map((order, index) => (
              <li
                key={`${order.id}-${index}`}
                className="flex min-w-0 gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-32 sm:w-32">
                  <img
                    src={order.image}
                    alt={order.name || "Ordered product"}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="line-clamp-2 break-words font-medium text-gray-800">
                    {order.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Quantity: {order.quantity}
                  </p>

                  <p className="mt-auto pt-3 text-sm font-semibold text-gray-900">
                    ₹
                    {(
                      Number(order.base_cost || 0) * Number(order.quantity || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default Orders;
