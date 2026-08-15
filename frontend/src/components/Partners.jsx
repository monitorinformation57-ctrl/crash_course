import jollibeat from "../assets/partners/jollibeat.png";
import kisko from "../assets/partners/kisko.png";
import malasme from "../assets/partners/malasme.png";
import mangsinakal from "../assets/partners/mangsinakal.png";
import nyek from "../assets/partners/nyek.png";
import puregreen from "../assets/partners/puregreen.png";

const partners = [jollibeat, kisko, malasme, mangsinakal, nyek, puregreen];

export default function Partner() {
  return (
    <section className="bg-[#112B63] py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Our Partners</h2>

          <p className="mt-2 text-gray-300">
            Trusted technology partners and industry-leading brands.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-scroll gap-8">
            {[...partners, ...partners].map((logo, index) => (
              <div
                key={index}
                className="flex h-28 w-56 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg transition duration-300 hover:scale-105"
              >
                <img
                  src={logo}
                  alt="Partner Logo"
                  className="h-14 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
