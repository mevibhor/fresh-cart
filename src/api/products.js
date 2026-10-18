const API_URL = "https://dummyjson.com/products";

async function fetchJSON(url, signal, errorMessage) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

function formatProduct(product) {
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPercentage) || 0;
  const hasDiscount = discount > 0 && discount < 100;

  const originalPrice = hasDiscount ? price / (1 - discount / 100) : null;

  return {
    id: product.id,
    name: product.title,
    description: product.description || "",
    image: product.thumbnail || product.images?.[0] || "",
    images: product.images || [],
    base_cost: price,
    original_cost: hasDiscount ? Math.round(originalPrice * 100) / 100 : null,
    discountPercentage: hasDiscount ? discount : 0,
    category: product.category || "other",
    brand: product.brand || "",
    rating: product.rating || 0,
    reviews: product.reviews || [],
    stock: product.stock ?? 0,
    availabilityStatus: product.availabilityStatus || "",
  };
}

export async function getProducts(signal) {
  const data = await fetchJSON(
    `${API_URL}?limit=0`,
    signal,
    "Could not load products.",
  );

  return data.products.map(formatProduct);
}

export async function getCategories(signal) {
  return fetchJSON(
    `${API_URL}/categories`,
    signal,
    "Could not load categories.",
  );
}

export async function getProductsByCategory(categorySlug, signal) {
  const data = await fetchJSON(
    `${API_URL}/category/${encodeURIComponent(categorySlug)}?limit=0`,
    signal,
    "Could not load products for this category.",
  );

  return data.products.map(formatProduct);
}
