import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import { BASE_URL } from "../api/base";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthProvider";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("accessToken");

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

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userId = getUserIdFromToken();

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post(`${BASE_URL}/api/cart/add/`, {
        user: userId,
        product: product.id,
        qty,
      });
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userId = getUserIdFromToken();

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/cart/add/`, {
        user: userId,
        product: product.id,
        qty,
      });

      navigate("/checkout");
    } catch (error) {
      console.error("Error during buy now:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-3xl font-semibold text-blue-700 flex">
          {"Loading Product...".split("").map((char, index) => (
            <span
              key={index}
              className="wave"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gray-100 py-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <p className="mb-8 text-sm text-gray-500">
            Home / Products / {product.product_name}
          </p>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Product Image */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.product_name}
                className="mx-auto h-[450px] w-full object-contain"
              />
            </div>

            {/* Product Information */}
            <div>
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                {product.brand || "Cisco"}
              </span>

              <h1 className="mt-4 text-4xl font-bold text-[#112B63]">
                {product.product_name}
              </h1>

              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star
                    key={item}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

                <span className="ml-2 text-gray-500">(120 Reviews)</span>
              </div>

              <h2 className="mt-6 text-5xl font-bold text-blue-700">
                ₱{Number(product.product_price).toLocaleString()}
              </h2>

              <div className="mt-3">
                {product.countInStock > 0 ? (
                  <span className="font-semibold text-green-600">
                    ✔ In Stock ({product.countInStock})
                  </span>
                ) : (
                  <span className="font-semibold text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="mt-8 leading-8 text-gray-600">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mt-8 flex items-center gap-5">
                <div className="flex overflow-hidden rounded-lg border">
                  <button
                    onClick={() => qty > 1 && setQty(qty - 1)}
                    className="px-5 py-3 hover:bg-gray-100"
                  >
                    <Minus />
                  </button>

                  <span className="flex w-14 items-center justify-center border-x font-bold">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-5 py-3 hover:bg-gray-100"
                  >
                    <Plus />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex items-center gap-2 rounded-xl bg-[#112B63] px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ShoppingCart size={20} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button className="rounded-xl border border-red-500 p-4 text-red-500 hover:bg-red-50">
                  <Heart />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="mt-5 w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
              >
                Buy Now
              </button>

              {/* Service Cards */}
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow">
                  <Truck className="text-blue-700" />

                  <div>
                    <h4 className="font-semibold">Free Shipping</h4>

                    <p className="text-sm text-gray-500">Nationwide Delivery</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow">
                  <ShieldCheck className="text-green-600" />

                  <div>
                    <h4 className="font-semibold">Warranty</h4>

                    <p className="text-sm text-gray-500">
                      1 Year Manufacturer Warranty
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-[#112B63]">
              Product Description
            </h2>

            <p className="leading-8 text-gray-600">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mt-10 rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-[#112B63]">
              Product Specifications
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Spec title="Brand" value={product.brand || "Cisco"} />
              <Spec
                title="Price"
                value={`₱${Number(product.product_price).toLocaleString()}`}
              />
              <Spec title="Stock" value={product.countInStock} />
              <Spec title="SKU" value={product.id} />
              <Spec
                title="Status"
                value={product.countInStock > 0 ? "Available" : "Out of Stock"}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Spec({ title, value }) {
  return (
    <div className="flex justify-between rounded-lg border p-4">
      <span className="font-medium text-gray-500">{title}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
