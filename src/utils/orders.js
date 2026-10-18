const ORDERS_STORAGE_KEY = "orders";

export function readOrders() {
  try {
    const storedValue = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function saveOrder({ items, subtotal, deliveryCharge }) {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  const safeItems = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    base_cost: Number(item.base_cost),
  }));

  if (
    safeItems.some(
      (item) =>
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0 ||
        !Number.isFinite(item.base_cost) ||
        item.base_cost < 0,
    )
  ) {
    return false;
  }

  const safeSubtotal = Number(subtotal);
  const safeDeliveryCharge = Number(deliveryCharge);

  if (
    !Number.isFinite(safeSubtotal) ||
    safeSubtotal < 0 ||
    !Number.isFinite(safeDeliveryCharge) ||
    safeDeliveryCharge < 0
  ) {
    return false;
  }

  try {
    const existingOrders = readOrders();

    const order = {
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: safeItems,
      subtotal: safeSubtotal,
      deliveryCharge: safeDeliveryCharge,
      total: safeSubtotal + safeDeliveryCharge,
    };

    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...existingOrders]),
    );

    return true;
  } catch {
    return false;
  }
}
