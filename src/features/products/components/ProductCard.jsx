import { Link } from "react-router-dom";
import AddToCartBtn from "../../../features/cart/components/AddToCartButton";
import DiscountBadge from "../../products/components/DiscountBadge";

const ProductCard = ({ productData }) => {
  const { id, name, image, base_cost, original_cost, base_qty, rating } =
    productData;

  const hasDiscount =
    original_cost !== null &&
    original_cost !== undefined &&
    Number(original_cost) > Number(base_cost);

  return (
    <article className="flex flex-col h-full min-w-0 p-2 overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 rounded-xl font-default hover:shadow-md sm:p-3">
      <Link to={`/product/${id}`} className="flex flex-col flex-1 min-w-0">
        <div className="relative w-full overflow-hidden rounded-lg h-36 bg-gray-50 sm:h-44 md:h-48">
          <img
            className="object-contain w-full h-full p-2"
            src={image}
            alt={name}
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute right-1 top-1 sm:right-2 sm:top-2">
              <DiscountBadge
                base_cost={base_cost}
                original_cost={original_cost}
              />
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 pt-3">
          <h3 className="text-sm font-medium leading-5 tracking-tight text-gray-800 capitalize break-words line-clamp-2 sm:text-base">
            {name}
          </h3>

          {base_qty && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{base_qty}</p>
          )}

          {rating > 0 && (
            <p className="flex items-center gap-1 mt-2 text-xs text-gray-600">
              <span className="text-amber-500">★</span>
              {Number(rating).toFixed(1)}
            </p>
          )}
        </div>
      </Link>

      <div className="flex items-center justify-between min-w-0 gap-2 pt-3 mt-3 border-t border-gray-100">
        <div className="flex flex-col min-w-0">
          <span className="text-base font-bold truncate text-slate-900 sm:text-lg">
            ₹{Number(base_cost).toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-xs text-gray-500 line-through sm:text-sm">
              ₹{Number(original_cost).toFixed(2)}
            </span>
          )}
        </div>

        <div className="shrink-0">
          <AddToCartBtn cartItemData={productData} />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
