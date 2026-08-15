import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import GuideShop from "../components/GuideShop.jsx";
import ProductList from "../components/ProductList.jsx";
import HeroImage from "../assets/hero_name.png";
import Partners from "../components/Partners.jsx";
import Footer from "../components/Footer.jsx";

function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Background Blur */}
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"></div>

        <div className="mx-auto flex min-h-screen max-w-7xl flex-col-reverse items-center justify-between gap-16 px-6 py-20 lg:flex-row">
          {/* Left Content */}
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              🔥 New Summer Collection 2026
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-gray-900 lg:text-7xl">
              Discover Your
              <span className="block text-blue-600">Perfect Style</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Explore premium fashion, electronics, accessories, and everything
              you love—all in one place with fast delivery and unbeatable
              prices.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700">
                Shop Now
                <ArrowRight size={20} />
              </button>

              <button className="rounded-xl border border-gray-300 px-8 py-4 font-semibold transition hover:bg-gray-100">
                Explore Collection
              </button>
            </div>

            {/* Stats */}

            <div className="mt-12 flex gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">25K+</h3>
                <p className="text-gray-500">Happy Customers</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">12K+</h3>
                <p className="text-gray-500">Products</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">4.9★</h3>
                <p className="text-gray-500">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content */}

          <div className="relative">
            {/* Product Image */}

            <div className="relative h-[520px] w-[420px]">
              <div className="absolute inset-0 rounded-full bg-blue-100 blur-2xl"></div>

              <img
                src={HeroImage}
                alt="Hero Product"
                className="relative z-10 h-full w-full rounded-3xl object-cover shadow-2xl"
              />

              {/* Discount Card */}

              <div className="absolute -left-10 top-14 z-20 rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-sm text-gray-500">Limited Offer</p>

                <h2 className="text-3xl font-bold text-red-500">50% OFF</h2>
              </div>

              {/* Rating */}

              <div className="absolute -right-8 bottom-20 z-20 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star size={22} className="fill-yellow-400 text-yellow-400" />
                </div>

                <div>
                  <h3 className="font-bold">4.9 Rating</h3>

                  <p className="text-sm text-gray-500">12,000+ Reviews</p>
                </div>
              </div>

              {/* Floating Cart */}

              <div className="absolute left-20 bottom-0 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
                <ShoppingBag className="text-blue-600" />

                <div>
                  <h4 className="font-semibold">Free Shipping</h4>

                  <p className="text-sm text-gray-500">Orders over $99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuideShop />
      <ProductList />
      <Partners />
      <Footer />
    </>
  );
}

export default Hero;
