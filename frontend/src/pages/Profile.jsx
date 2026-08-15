import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/base";
import Footer from "../components/Footer";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const ProductImage = ({ image }) => {
  if (!image) {
    return (
      <div className="flex h-[32px] w-[40px] items-center justify-center overflow-hidden rounded-[2px] border border-gray-400 bg-gray-200 text-[10px] font-bold text-gray-500">
        IMG
      </div>
    );
  }

  return (
    <img
      src={image}
      alt="Product"
      className="h-[52px] w-[64px] rounded-[4px] object-cover"
    />
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          axios.get(`${BASE_URL}api/profile/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${BASE_URL}api/profile/orders/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setProfile({
          username: profileResponse.data.username || "",
          email: profileResponse.data.email || "",
        });
        setPurchases(ordersResponse.data || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login", { replace: true });
          return;
        }

        setError("Unable to load your profile right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleRemovePurchase = async (purchaseId) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      await axios.delete(`${BASE_URL}api/profile/orders/${purchaseId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setPurchases((current) =>
        current.filter((purchase) => purchase.id !== purchaseId),
      );
    } catch (err) {
      console.error("Error removing purchase:", err);
      setError("Unable to remove this item.");
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#fdfdfd] px-4 py-7 font-sans text-black">
        <div className="mx-auto w-full max-w-[900px]">
          <section className="min-h-[180px] border border-gray-200 bg-white px-6 py-6 shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-[38px] font-bold leading-tight">
                My Profile
              </h1>
            </div>

            <div className="mt-[18px] space-y-[10px] text-[18px]">
              <div className="flex items-center">
                <span className="w-[140px] font-semibold">Username:</span>
                <span>{profile.username || "-"}</span>
              </div>

              <div className="flex items-center">
                <span className="w-[140px] font-semibold">Email:</span>
                <span>{profile.email || "-"}</span>
              </div>
            </div>
          </section>

          <section className="mt-[28px] min-h-[420px] border border-gray-100 bg-white px-6 py-6 shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            <h2 className="text-[38px] font-bold leading-tight">
              Purchase History
            </h2>

            <div className="mt-[20px] w-full">
              {loading ? (
                <p className="mt-8 text-base text-gray-500">
                  Loading your purchases...
                </p>
              ) : error ? (
                <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                  {error}
                </p>
              ) : purchases.length === 0 ? (
                <p className="mt-8 text-base text-gray-500">
                  No purchases yet.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-[1.15fr_1.2fr_1.1fr_0.7fr_0.8fr_0.8fr] items-center gap-4 text-[15px] font-medium">
                    <div>Product Image</div>
                    <div>Product Name</div>
                    <div>Purchase Date</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Amount</div>
                    <div className="text-center">Action</div>
                  </div>

                  <div className="mt-[20px] space-y-[22px]">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="grid grid-cols-[1.15fr_1.2fr_1.1fr_0.7fr_0.8fr_0.8fr] items-center gap-4 text-[15px]"
                      >
                        <div className="pl-[3px]">
                          <ProductImage image={purchase.image} />
                        </div>

                        <div>{purchase.productName}</div>

                        <div>{formatDate(purchase.purchaseDate)}</div>

                        <div className="text-center">{purchase.quantity}</div>

                        <div className="text-right">
                          {formatCurrency(purchase.amount)}
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePurchase(purchase.id)}
                            className="rounded-md border border-red-500 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
