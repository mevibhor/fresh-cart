import { useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import { getProductById } from "../api/products";
import { CartContext } from "../context/Cart";
import useApi from "../hooks/useApi";
import ContentState from "../components/ContentState";
import TotalOff from "../components/TotalOff";

const ItemPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const loadProduct = useCallback(
    (signal) => getProductById(productId, signal),
    [productId],
  );

  const { data: product, isLoading, error, refetch } = useApi(loadProduct);

  const alreadyAdded = product
    ? cartItems.find((cartItem) => cartItem.id === product.id)
    : undefined;

  const hasDiscount =
    product?.original_cost != null &&
    Number(product.original_cost) > Number(product.base_cost);

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-7xl px-4 py-5 font-default sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
        >
          <IoMdArrowRoundBack size={23} />
        </button>

        <h1 className="min-w-0 break-words font-heading text-lg font-semibold text-gray-800 sm:text-xl">
          Product details
        </h1>
      </header>

      <ContentState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && !product}
        emptyMessage="This product could not be found."
        onRetry={refetch}
      >
        {product && (
          <section className="grid min-w-0 grid-cols-1 items-start gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-4 sm:min-h-80 sm:p-6">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[420px] w-full object-contain"
              />
            </div>

            <div className="min-w-0 py-2">
              <p className="text-sm capitalize text-gray-500">
                {product.category.replaceAll("-", " ")}
                {product.brand ? ` · ${product.brand}` : ""}
              </p>

              <h2 className="mt-2 break-words font-heading text-2xl font-semibold text-gray-900 sm:text-3xl">
                {product.name}
              </h2>

              {product.rating > 0 && (
                <p className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                  <span className="text-amber-500" aria-hidden="true">
                    ★
                  </span>
                  {Number(product.rating).toFixed(1)} / 5
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  ₹{Number(product.base_cost).toFixed(2)}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Number(product.original_cost).toFixed(2)}
                    </span>

                    <TotalOff
                      base_cost={product.base_cost}
                      original_cost={product.original_cost}
                    />
                  </>
                )}
              </div>

              <p className="mt-5 break-words text-sm leading-6 text-gray-600 sm:text-base">
                {product.description || "No description is available."}
              </p>

              <p
                className={`mt-4 text-sm ${
                  product.stock > 0 ? "text-green-700" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? product.availabilityStatus || `${product.stock} in stock`
                  : "Currently out of stock"}
              </p>

              <div className="mt-8 flex h-12 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-[#3A7BC8] text-[#3A7BC8]">
                {!alreadyAdded ? (
                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                    className="h-full w-full font-medium transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {product.stock > 0 ? "Add to bag" : "Out of stock"}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="h-full w-1/3 text-2xl transition hover:bg-blue-50"
                    >
                      −
                    </button>

                    <span className="w-1/3 text-center font-medium">
                      {alreadyAdded.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={alreadyAdded.quantity >= product.stock}
                      onClick={() => addToCart(product)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="h-full w-1/3 text-2xl transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </ContentState>
    </main>
  );
};

export default ItemPage;
