import React from "react";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";
import GuideShop from "../components/GuideShop.jsx";
import ProductList from "../components/ProductList.jsx";
import Footer from "../components/Footer.jsx";

function Product() {
  return (
    <div>
      <GuideShop />
      <ProductList />
      <Footer />
    </div>
  );
}

export default Product;
