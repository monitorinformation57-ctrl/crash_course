import { Link } from "react-router-dom";

const PaymentFail = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          !
        </div>

        <h1 className="text-3xl font-bold text-[#10275e]">Payment Failed</h1>
        <p className="mt-4 text-base text-gray-600">
          Your payment could not be completed. Please try again or review your
          cart.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/cart"
            className="rounded-lg bg-[#10275e] px-6 py-3 font-medium text-white transition hover:bg-[#0c1d47]"
          >
            Back to Cart
          </Link>
          <Link
            to="/product"
            className="rounded-lg border border-[#10275e] px-6 py-3 font-medium text-[#10275e] transition hover:bg-blue-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
