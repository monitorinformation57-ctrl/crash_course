import React, { useEffect, useState } from "react";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/base";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const ProductData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    ProductData();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Title */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold uppercase text-[#18356B]">
            Product List
          </h2>
        </div>

        {/* Products */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="flex h-44 items-center justify-center overflow-hidden">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.product_name}
                    className="h-32 object-contain transition duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Details */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold uppercase text-gray-800">
                    {item.product_name}
                  </h3>

                  <span className="font-semibold text-[#18356B]">
                    ₱{item.product_price}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm uppercase text-gray-500">
                    {item.brand}
                  </p>

                  <Link
                    to={`/product/${item.id}`}
                    className="rounded-md bg-[#18356B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    VIEW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button className="rounded-lg bg-[#18356B] px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
