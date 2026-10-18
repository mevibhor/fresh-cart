import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 font-default sm:px-6">
      <section className="w-full max-w-xl text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mx-auto h-20 w-20 text-[#3A7BC8] sm:h-24 sm:w-24"
          role="img"
          aria-label="Order successful"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>

        <h1 className="mt-5 font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
          Your order is successful!
        </h1>
        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Thank you for shopping with us.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="min-h-12 w-full rounded-lg border-2 border-[#3A7BC8] px-5 py-3 font-medium text-[#3A7BC8] transition hover:bg-blue-50 sm:w-auto sm:min-w-48"
          >
            See all orders
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="min-h-12 w-full rounded-lg bg-[#3A7BC8] px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto sm:min-w-48"
          >
            Continue shopping
          </button>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
