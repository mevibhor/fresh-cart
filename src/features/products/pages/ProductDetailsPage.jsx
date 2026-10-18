import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiPackage, FiShield, FiTruck } from "react-icons/fi";
import { getProductById } from "../api/products";
import { CartContext } from "../../cart/context/Cart";
import useApi from "../../../hooks/useApi";
import ContentState from "../../../components/shared/ContentState";
import DiscountBadge from "../components/DiscountBadge";

const formatPrice = (price) => `₹${Number(price || 0).toFixed(2)}`;

const formatDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RatingStars = ({ rating = 0, size = "text-sm" }) => {
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${size}`}
      aria-label={`${normalizedRating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(normalizedRating)
              ? "text-amber-500"
              : "text-gray-200"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const [selectedImage, setSelectedImage] = useState("");

  const loadProduct = useCallback(
    (signal) => getProductById(productId, signal),
    [productId],
  );

  const { data: product, isLoading, error, refetch } = useApi(loadProduct);

  useEffect(() => {
    setSelectedImage(product?.image || "");
  }, [product?.id, product?.image]);

  const alreadyAdded = product
    ? cartItems.find((item) => item.id === product.id)
    : undefined;

  const hasDiscount =
    product?.original_cost != null &&
    Number(product.original_cost) > Number(product.base_cost);

  const stock = product?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtStockLimit = alreadyAdded && alreadyAdded.quantity >= stock;

  const images = product
    ? [...new Set([product.image, ...(product.images || [])].filter(Boolean))]
    : [];

  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];

  const averageReviewRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + (Number(review.rating) || 0),
          0,
        ) / reviews.length
      : Number(product?.rating) || 0;

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-5 font-default sm:px-6 sm:py-8 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-2 mb-5 text-sm font-medium text-gray-600 transition rounded-lg min-h-10 hover:bg-gray-100 hover:text-gray-900"
      >
        <IoMdArrowRoundBack size={21} aria-hidden="true" />
        Back
      </button>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && !product}
        emptyMessage="This product could not be found."
        onRetry={refetch}
      >
        {product && (
          <>
            {/* Product overview */}
            <section className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
              {/* Image gallery */}
              <div className="min-w-0">
                <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 sm:min-h-[400px] sm:p-8 lg:min-h-[460px]">
                  {selectedImage ? (
                    <img
                      key={selectedImage}
                      src={selectedImage}
                      alt={product.name}
                      className="max-h-[420px] w-full object-contain transition-opacity duration-200"
                    />
                  ) : (
                    <div className="text-sm text-gray-400">
                      Image unavailable
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="absolute left-4 top-4">
                      <DiscountBadge
                        base_cost={product.base_cost}
                        original_cost={product.original_cost}
                      />
                    </div>
                  )}

                  <span className="absolute bottom-4 right-4 rounded-full border border-gray-100 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                    Product details
                  </span>
                </div>

                {images.length > 1 && (
                  <div
                    className="flex gap-3 pb-2 mt-3 overflow-x-auto no-scrollbar"
                    aria-label="Product images"
                  >
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        aria-label={`View product image ${index + 1}`}
                        aria-pressed={selectedImage === image}
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-2 transition sm:h-24 sm:w-24 ${
                          selectedImage === image
                            ? "border-blue-600 shadow-sm"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="object-contain w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product information */}
              <div className="flex flex-col min-w-0 py-1 sm:py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/details/${product.category}`}
                    className="px-3 py-1 text-xs font-semibold text-blue-700 capitalize transition rounded-full bg-blue-50 hover:bg-blue-100"
                  >
                    {product.category.replaceAll("-", " ")}
                  </Link>

                  {product.brand && (
                    <span className="text-sm text-gray-500">
                      {product.brand}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 break-words font-heading sm:text-4xl">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center mt-4 gap-x-3 gap-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5">
                    <span className="font-semibold text-gray-900">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                    <RatingStars rating={product.rating} />
                  </div>

                  <a
                    href="#customer-reviews"
                    className="text-sm text-gray-500 underline transition decoration-gray-300 underline-offset-4 hover:text-blue-700"
                  >
                    {reviews.length > 0
                      ? `${reviews.length} ${
                          reviews.length === 1 ? "review" : "reviews"
                        }`
                      : "Customer reviews"}
                  </a>
                </div>

                <p className="mt-5 text-sm leading-7 text-gray-600 break-words sm:text-base">
                  {product.description ||
                    "Discover more details about this product."}
                </p>

                {/* Price */}
                <div className="p-4 mt-6 border border-gray-100 rounded-xl bg-gray-50/80 sm:p-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                      {formatPrice(product.base_cost)}
                    </span>

                    {hasDiscount && (
                      <span className="text-base text-gray-400 line-through">
                        {formatPrice(product.original_cost)}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <p className="mt-1 text-sm font-medium text-green-700">
                      You save{" "}
                      {formatPrice(
                        Number(product.original_cost) -
                          Number(product.base_cost),
                      )}
                    </p>
                  )}

                  <p
                    className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                      isOutOfStock ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {isOutOfStock ? (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    ) : (
                      <IoMdCheckmarkCircleOutline
                        size={18}
                        aria-hidden="true"
                      />
                    )}

                    {isOutOfStock
                      ? "Currently out of stock"
                      : product.availabilityStatus ||
                        `${stock} available in stock`}
                  </p>
                </div>

                {/* Add to bag */}
                <div className="mt-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {!alreadyAdded ? (
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product)}
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <span>
                          {isOutOfStock ? "Out of stock" : "Add to bag"}
                        </span>
                        {!isOutOfStock && <span aria-hidden="true">+</span>}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between flex-1 overflow-hidden border border-blue-200 min-h-12 rounded-xl bg-blue-50/60">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="h-12 text-2xl text-blue-700 transition w-14 hover:bg-blue-100"
                        >
                          −
                        </button>

                        <span
                          className="text-base font-semibold text-gray-900"
                          aria-live="polite"
                        >
                          {alreadyAdded.quantity} in bag
                        </span>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          disabled={isAtStockLimit}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="h-12 text-2xl text-blue-700 transition w-14 hover:bg-blue-100 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-center text-gray-500">
                    Your bag updates automatically as you change quantities.
                  </p>
                </div>

                {/* Service information */}
                <div className="grid grid-cols-1 gap-3 pt-5 mt-6 border-t border-gray-100 sm:grid-cols-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg sm:flex-col sm:items-start sm:gap-2">
                    <FiTruck
                      size={20}
                      className="text-blue-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs leading-5 text-gray-600">
                      Convenient delivery
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg sm:flex-col sm:items-start sm:gap-2">
                    <FiPackage
                      size={20}
                      className="text-blue-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs leading-5 text-gray-600">
                      Carefully packed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg sm:flex-col sm:items-start sm:gap-2">
                    <FiShield
                      size={20}
                      className="text-blue-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-xs leading-5 text-gray-600">
                      Secure checkout
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer reviews */}
            <section
              id="customer-reviews"
              className="pt-8 mt-12 border-t border-gray-100 scroll-mt-20 sm:mt-16 sm:pt-10"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    Customer feedback
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900 font-heading sm:text-3xl">
                    Customer reviews
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    See what customers have shared about this product.
                  </p>
                </div>

                {reviews.length > 0 && (
                  <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl sm:min-w-52">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {averageReviewRating.toFixed(1)}
                        <span className="text-base font-medium text-gray-400">
                          /5
                        </span>
                      </p>

                      <RatingStars
                        rating={averageReviewRating}
                        size="text-base"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Based on {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="px-5 py-10 mt-6 text-center border border-gray-200 border-dashed rounded-2xl bg-gray-50 sm:py-12">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto text-2xl bg-white rounded-full shadow-sm">
                    <span className="text-amber-500" aria-hidden="true">
                      ★
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900 font-heading">
                    No written reviews yet
                  </h3>

                  <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-gray-500">
                    There arent any customer comments available for this product
                    yet. Check back later for more feedback.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
                  {reviews.map((review, index) => {
                    const reviewerName = review.reviewerName || "Customer";

                    const reviewDate = formatDate(review.date);

                    return (
                      <article
                        key={`${reviewerName}-${review.date || index}-${index}`}
                        className="min-w-0 p-5 transition duration-200 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm sm:p-6"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center text-sm font-bold text-blue-700 rounded-full h-11 w-11 shrink-0 bg-blue-50">
                            {reviewerName.trim().charAt(0).toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 break-words">
                              {reviewerName}
                            </h3>

                            {reviewDate && (
                              <p className="mt-1 text-xs text-gray-400">
                                {reviewDate}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0">
                            <RatingStars rating={review.rating} />
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-gray-600 break-words">
                          {review.comment ||
                            "This customer did not leave a written comment."}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </ContentState>
    </main>
  );
};

export default ProductDetailsPage;
