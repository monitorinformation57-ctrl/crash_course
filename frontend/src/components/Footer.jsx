export default function Footer() {
  return (
    <footer className="bg-[#10285F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Newsletter */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold">
              Fullstack
              <span className="text-sky-400"> BokJoe</span>
            </h1>

            <div className="mt-6 flex gap-6 text-sm">
              <a href="#" className="hover:text-sky-400">
                Facebook
              </a>
              <a href="#" className="hover:text-sky-400">
                Instagram
              </a>
              <a href="#" className="hover:text-sky-400">
                LinkedIn
              </a>
              <a href="#" className="hover:text-sky-400">
                Pinterest
              </a>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>

              <div className="flex border-b border-gray-400">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent py-2 outline-none placeholder:text-gray-300"
                />

                <button className="px-3 text-xl">→</button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-5 font-bold">Quick Links</h2>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="mb-5 font-bold">Company</h2>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">Career</a>
              </li>
              <li>
                <a href="#">Partners</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="mb-5 font-bold">Support</h2>

            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-300 md:flex-row">
            <p>© 2026 Fullstack BokJoe. All Rights Reserved.</p>

            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
