import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/base";

const Checkout = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Philippines",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove trailing slash from BASE_URL
  const API_URL = BASE_URL.replace(/\/$/, "");

  const authenticatedRequest = async (config) => {
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      throw new Error("Please login first.");
    }

    try {
      return await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      // Only handle expired/invalid access token
      if (err.response?.status !== 401) {
        throw err;
      }

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login");
        throw new Error("Your session has expired. Please login again.");
      }

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken = refreshResponse.data?.access;

        if (!newAccessToken) {
          throw new Error("No access token returned.");
        }

        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        return await axios({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login");

        throw new Error("Your session has expired. Please login again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.postalCode.trim() ||
      !formData.country.trim()
    ) {
      setError("Please complete all shipping information.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authenticatedRequest({
        method: "POST",
        url: `${API_URL}/api/create-xendit-payment/`,
        data: formData,
      });

      console.log("Checkout response:", response.data);

      const checkoutUrl = response.data?.checkout_url;

      if (!checkoutUrl) {
        throw new Error("Xendit checkout URL was not returned by the server.");
      }

      // Redirect to Xendit
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);

      const backendError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message;

      if (typeof backendError === "object") {
        setError(JSON.stringify(backendError));
      } else {
        setError(
          backendError ||
            err.message ||
            "Unable to create payment. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-4 text-sm text-gray-500 transition hover:text-black"
        >
          ← Back to cart
        </button>

        <h1 className="text-3xl font-bold text-black">Checkout</h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your shipping information to continue to payment.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border border-gray-100 bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-xl font-bold text-black">
          Shipping Information
        </h2>

        <div className="mb-5">
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Juan Dela Cruz"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#10275e]"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Address
          </label>

          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House number, street, barangay"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#10275e]"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              City
            </label>

            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Manila"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#10275e]"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Postal Code
            </label>

            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="1000"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#10275e]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Country
          </label>

          <input
            id="country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#10275e]"
          />
        </div>

        <div className="mt-8 rounded-md bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-800">
            Payment powered by Xendit
          </p>

          <p className="mt-1 text-xs text-gray-500">
            After continuing, you will be redirected to Xendit to complete your
            payment securely.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-lg bg-[#10275e] py-3 text-sm font-medium text-white transition hover:bg-[#0c1d47] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Creating Payment..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
