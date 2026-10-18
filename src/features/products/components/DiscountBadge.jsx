const DiscountBadge = ({ base_cost, original_cost }) => {
  const discount = Math.floor(
    ((original_cost - base_cost) / original_cost) * 100,
  );

  return (
    <>
      {discount !== 0 ? (
        <span className="m-2 bg-orange-500 p-1 text-center text-sm font-medium text-white rounded-md">
          {discount}% Off
        </span>
      ) : (
        ""
      )}
    </>
  );
};

export default DiscountBadge;
