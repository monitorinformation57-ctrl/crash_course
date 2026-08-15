import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";

export default function Header() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      to: "/",
    },
    {
      name: "Product",
      to: "/product",
    },
    {
      name: "Team",
      to: "#",
    },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold text-[#18356B]">
          Fullstack BokJoe
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="font-medium text-gray-700 transition hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link
                to="/cart"
                className="rounded-lg border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-50"
              >
                <FaShoppingCart className="text-xl" />
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="rounded-lg border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-50"
              >
                <FaUser className="text-xl" />
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-red-500 px-5 py-2 text-red-500 transition hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 transition hover:bg-blue-50"
              >
                Register
              </Link>

              {/* Sign In */}
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="flex flex-col gap-4 p-6">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-200" />

            {isAuthenticated ? (
              <>
                {/* Mobile Cart */}
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg border border-blue-600 px-4 py-3 text-blue-600"
                >
                  <FaShoppingCart />
                  Shopping Cart
                </Link>

                {/* Mobile Profile */}
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg border border-blue-600 px-4 py-3 text-blue-600"
                >
                  <FaUser />
                  Profile
                </Link>

                {/* Mobile Sign Out */}
                <button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="rounded-lg border border-red-500 px-4 py-3 text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Mobile Register */}
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-blue-600 py-3 text-center text-blue-600"
                >
                  Register
                </Link>

                {/* Mobile Sign In */}
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-blue-600 py-3 text-center text-white"
                >
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
