const ORDERS_STORAGE_KEY = "orders";

// Read previously saved orders.
export function readOrders() {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!savedOrders) {
      return [];
    }

    const orders = JSON.parse(savedOrders);

    // Make sure the saved data is an array.
    return Array.isArray(orders) ? orders : [];
  } catch {
    // Return an empty list if the saved data cannot be read.
    return [];
  }
}

// Save a new order after validating its data.
export function saveOrder({ items, subtotal, deliveryCharge }) {
  // An order must contain at least one item.
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  // Convert prices and quantities to numbers.
  const orderItems = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    base_cost: Number(item.base_cost),
  }));

  // Reject items with invalid quantities or prices.
  const hasInvalidItem = orderItems.some(
    (item) =>
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0 ||
      !Number.isFinite(item.base_cost) ||
      item.base_cost < 0,
  );

  if (hasInvalidItem) {
    return false;
  }

  // Convert the order amounts to numbers.
  const orderSubtotal = Number(subtotal);
  const orderDeliveryCharge = Number(deliveryCharge);

  // Reject invalid or negative order amounts.
  if (
    !Number.isFinite(orderSubtotal) ||
    orderSubtotal < 0 ||
    !Number.isFinite(orderDeliveryCharge) ||
    orderDeliveryCharge < 0
  ) {
    return false;
  }

  try {
    // Read the existing orders before adding the new one.
    const existingOrders = readOrders();

    const newOrder = {
      id: `OD${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: orderItems,
      subtotal: orderSubtotal,
      deliveryCharge: orderDeliveryCharge,
      total: orderSubtotal + orderDeliveryCharge,
    };

    // Keep the newest order at the beginning of the list.
    const updatedOrders = [newOrder, ...existingOrders];

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

    return true;
  } catch {
    // Report failure if the order cannot be saved.
    return false;
  }
}
