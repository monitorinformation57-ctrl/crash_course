import {
  Search,
  ShoppingCart,
  CreditCard,
  Wallet,
  PackageCheck,
} from "lucide-react";

const steps = [
  {
    title: "Browse",
    icon: Search,
  },
  {
    title: "Add to Cart",
    icon: ShoppingCart,
  },
  {
    title: "Checkout",
    icon: CreditCard,
  },
  {
    title: "Payment",
    icon: Wallet,
  },
  {
    title: "Then Wait",
    icon: PackageCheck,
  },
];

export default function GuideShop() {
  return (
    <section className="bg-[#112B63] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold uppercase text-white">
            One Stop One Shop
          </h2>

          <p className="mt-5 text-gray-300 leading-7">
            Shop everything you need in just a few simple steps. Browse
            thousands of products, add your favorites to the cart, complete your
            checkout, make a secure payment, and relax while we deliver your
            order to your doorstep.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:bg-blue-600"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 transition group-hover:bg-white">
                  <Icon
                    size={32}
                    className="text-blue-700 transition group-hover:text-blue-600"
                  />
                </div>

                <h3 className="mt-6 text-lg font-bold uppercase text-gray-800 transition group-hover:text-white">
                  {step.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
