import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/base";
import { AuthContext } from "../context/AuthProvider";
import Footer from "./Footer";

const getStoredAccessToken = () => {
  const currentToken = localStorage.getItem("accessToken");
  if (currentToken) return currentToken;

  const legacyToken = localStorage.getItem("access_token");
  if (legacyToken) {
    localStorage.setItem("accessToken", legacyToken);
    localStorage.removeItem("access_token");
    return legacyToken;
  }

  return null;
};

const getUserIdFromToken = () => {
  const token = getStoredAccessToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded.user_id ?? null;
  } catch (error) {
    console.error("Unable to decode token:", error);
    return null;
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value || 0));

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      setError("Please sign in to view your cart.");
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const profileResponse = await axios.get(`${BASE_URL}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userId = profileResponse.data?.id ?? getUserIdFromToken();

        if (!userId) {
          throw new Error("Unable to resolve the current user.");
        }

        const response = await axios.get(`${BASE_URL}/api/cart/${userId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCartItems(response.data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching cart:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login", { replace: true });
          setError("Your session has expired. Please sign in again.");
          setCartItems([]);
          return;
        }

        const backendMessage =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message;

        if (typeof backendMessage === "string" && backendMessage) {
          setError(backendMessage);
        } else {
          setError("Unable to load your cart right now.");
        }
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.subtotal || item.price * item.qty),
    0,
  );

  const updateQuantity = async (cartId, nextQty) => {
    if (nextQty < 1) {
      return;
    }

    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/cart/update/${cartId}/`,
        {
          qty: nextQty,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setCartItems((current) =>
        current.map((item) =>
          item.cart_id === cartId
            ? {
                ...item,
                qty: nextQty,
                subtotal: Number(item.price) * nextQty,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
      setError("Unable to update this item.");
    }
  };

  const removeItem = async (cartId) => {
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${cartId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartItems((current) =>
        current.filter((item) => item.cart_id !== cartId),
      );
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError("Unable to remove this item.");
    }
  };

  const handleCheckout = () => {
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    navigate("/checkout");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#10275e]">
            Your cart is waiting
          </h2>
          <p className="mt-3 text-gray-600">
            Please sign in to view and manage your saved products.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-lg bg-[#10275e] px-6 py-3 font-medium text-white transition hover:bg-[#0c1d47]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white py-8">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="border border-gray-200 bg-white px-8 py-10 shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-black">
              Shopping Cart
            </h1>

            {loading ? (
              <p className="py-6 text-gray-500">Loading your cart...</p>
            ) : error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : cartItems.length === 0 ? (
              <div className="rounded-xl bg-gray-50 px-5 py-8 text-center">
                <p className="text-lg font-medium text-gray-600">
                  Your cart is empty.
                </p>
                <Link
                  to="/product"
                  className="mt-4 inline-block rounded-lg bg-[#10275e] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0c1d47]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.cart_id}
                    className="flex items-center justify-between border-b border-gray-300 py-5"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-24 items-center justify-center overflow-hidden rounded-md bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <h2 className="text-sm font-semibold text-black">
                          {item.product_name}
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span>Qty :</span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.cart_id, item.qty - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow"
                          >
                            -
                          </button>

                          <span className="font-medium">{item.qty}</span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.cart_id, item.qty + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 shadow"
                          >
                            +
                          </button>
                        </div>

                        <p className="mt-2 text-xs font-medium">
                          Price: {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm font-semibold text-[#10275e]">
                        {formatCurrency(item.subtotal || item.price * item.qty)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.cart_id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-black transition hover:bg-gray-100"
                        aria-label={`Remove ${item.product_name}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 border border-gray-100 bg-white px-8 py-8 shadow-md">
            <h2 className="mb-7 text-center text-2xl font-bold text-black">
              Order Summary
            </h2>

            <div className="flex items-center justify-between border-b border-gray-400 px-4 pb-6 text-sm font-semibold">
              <span>Sub Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-6 text-sm font-semibold">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="px-8">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full rounded-lg bg-[#10275e] py-3 text-sm font-medium text-white transition hover:bg-[#0c1d47] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
