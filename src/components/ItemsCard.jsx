import { Link } from "react-router-dom";
import AddToCartBtn from "./AddToCartBtn";
import TotalOff from "./TotalOff";

const ItemsCard = ({ productData }) => {
  const {
    id,
    name,
    image,
    base_cost,
    original_cost,
    discountPercentage = 0,
    base_qty,
    rating,
  } = productData;

  const hasDiscount =
    original_cost !== null &&
    original_cost !== undefined &&
    Number(original_cost) > Number(base_cost);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-2 font-default transition-shadow duration-200 hover:shadow-md sm:p-3">
      <Link to={`/product/${id}`} className="flex min-w-0 flex-1 flex-col">
        <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gray-50 sm:h-44 md:h-48">
          <img
            className="h-full w-full object-contain p-2"
            src={image}
            alt={name}
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute right-1 top-1 sm:right-2 sm:top-2">
              <TotalOff base_cost={base_cost} original_cost={original_cost} />
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-3">
          <h3 className="line-clamp-2 break-words text-sm font-medium capitalize leading-5 tracking-tight text-gray-800 sm:text-base">
            {name}
          </h3>

          {base_qty && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{base_qty}</p>
          )}

          {rating > 0 && (
            <p className="mt-2 flex items-center gap-1 text-xs text-gray-600">
              <span className="text-amber-500">★</span>
              {Number(rating).toFixed(1)}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-base font-bold text-slate-900 sm:text-lg">
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

export default ItemsCard;
