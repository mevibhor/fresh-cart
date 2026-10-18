import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import data from "../data";
import { CartContext } from "../context/Cart";
import TotalOff from "../components/TotalOff";

const ItemPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const numericProductId = Number(productId);

  const categoryWithProduct = data.top_products.find((category) =>
    category.products.some((product) => product.id === numericProductId),
  );

  const productDetails = categoryWithProduct?.products.find(
    (product) => product.id === numericProductId,
  );

  const alreadyAdded = productDetails
    ? cartItems.find((cartItem) => cartItem.id === productDetails.id)
    : undefined;

  if (!productDetails) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-4 py-10 text-center font-default">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          This product could not be found in the current catalogue.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 min-h-11 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Back to shopping
        </button>
      </main>
    );
  }

  const hasDiscount =
    productDetails.original_cost != null &&
    Number(productDetails.original_cost) > Number(productDetails.base_cost);

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
          {categoryWithProduct?.category_name || "Product details"}
        </h1>
      </header>

      <section className="grid min-w-0 grid-cols-1 items-start gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
        <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-white p-4 sm:min-h-80 sm:p-6">
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="max-h-[420px] w-full object-contain"
          />
        </div>

        <div className="min-w-0 py-2">
          <h2 className="break-words font-heading text-2xl font-semibold text-gray-900 sm:text-3xl">
            {productDetails.name}
          </h2>

          {productDetails.base_qty && (
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              {productDetails.base_qty}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ₹{Number(productDetails.base_cost).toFixed(2)}
            </span>

            {hasDiscount && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{Number(productDetails.original_cost).toFixed(2)}
                </span>
                <TotalOff
                  base_cost={productDetails.base_cost}
                  original_cost={productDetails.original_cost}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex h-12 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-[#3A7BC8] text-[#3A7BC8]">
            {!alreadyAdded ? (
              <button
                type="button"
                onClick={() => addToCart(productDetails)}
                className="h-full w-full font-medium transition hover:bg-blue-50"
              >
                Add to bag
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => removeFromCart(productDetails)}
                  aria-label="Decrease quantity"
                  className="h-full w-1/3 text-2xl transition hover:bg-blue-50"
                >
                  −
                </button>

                <span className="w-1/3 text-center font-medium">
                  {alreadyAdded.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => addToCart(productDetails)}
                  aria-label="Increase quantity"
                  className="h-full w-1/3 text-2xl transition hover:bg-blue-50"
                >
                  +
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ItemPage;
