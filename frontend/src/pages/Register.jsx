import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-[#112B63] p-14 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={40} />
            <h1 className="text-4xl font-black">Fullstack BokJoe</h1>
          </div>

          <h2 className="mt-16 text-5xl font-bold leading-tight">
            Create Your Account
          </h2>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            Join thousands of customers shopping for premium networking
            equipment and technology products.
          </p>

          <div className="mt-12 rounded-2xl bg-white/10 p-6">
            <h3 className="text-xl font-semibold">Benefits</h3>

            <ul className="mt-5 space-y-3 text-blue-100">
              <li>✔ Exclusive Member Discounts</li>
              <li>✔ Order Tracking</li>
              <li>✔ Secure Checkout</li>
              <li>✔ Wishlist & Favorites</li>
            </ul>
          </div>
        </div>

        {/* Right Side */}

        <div className="p-10 lg:p-16">
          <h2 className="text-4xl font-bold text-slate-800">Register</h2>

          <p className="mt-2 text-gray-500">Create your new account</p>

          <form className="mt-8 space-y-5">
            {/* Full Name */}

            <div>
              <label className="mb-2 block font-medium">Full Name</label>

              <div className="flex items-center rounded-xl border px-4">
                <User size={20} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block font-medium">Email Address</label>

              <div className="flex items-center rounded-xl border px-4">
                <Mail size={20} className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block font-medium">Password</label>

              <div className="flex items-center rounded-xl border px-4">
                <Lock size={20} className="text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500" />
                  ) : (
                    <Eye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block font-medium">Confirm Password</label>

              <div className="flex items-center rounded-xl border px-4">
                <Lock size={20} className="text-gray-400" />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="text-gray-500" />
                  ) : (
                    <Eye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />I agree to the Terms & Conditions
            </label>

            {/* Register Button */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#112B63] py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
