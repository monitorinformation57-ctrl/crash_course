import { useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../api/base";

const PaymentSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const externalId = params.get("external_id") || "your order";
  const invoiceId = params.get("invoice_id") || params.get("id");
  const paymentStatus = params.get("status") || "PAID";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || (!invoiceId && !externalId)) {
      return;
    }

    axios
      .post(
        `${BASE_URL}/api/confirm-xendit-payment/`,
        {
          invoice_id: invoiceId,
          external_id: externalId,
          status: paymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .catch((error) => {
        console.error("Failed to confirm payment:", error);
      });
  }, [externalId, invoiceId, paymentStatus]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-green-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-[#10275e]">
          Payment Successful
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Your payment for {externalId} has been processed successfully.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          A confirmation email may arrive shortly, and your order is now being
          prepared.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/profile"
            className="rounded-lg bg-[#10275e] px-6 py-3 font-medium text-white transition hover:bg-[#0c1d47]"
          >
            View Orders
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

export default PaymentSuccess;
