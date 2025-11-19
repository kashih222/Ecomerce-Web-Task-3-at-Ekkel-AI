import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductsData from "../ProductsPage/ProductsData.json";
// import StarRating from "../ProductsPage/ProductsPage";

const FeatureProductCarousel = () => {
  // Select products with good rating
  const featuredProducts = ProductsData.filter((p) => p.rating >= 4.5).slice(
    0,
    10
  );

  return (
    <div className="w-full h-screen py-16 bg-gray-100 major-mono">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold tracking-widest mb-10">
          FEATURED PRODUCTS
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
        //   navigation
        //   pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="py-10"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300
                  flex flex-col h-[450px]"
              >
                <figure className="w-full h-52 overflow-hidden rounded-lg shrink-0">
                  <img
                    src={product.images.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                  />
                </figure>

                <div className="flex flex-col grow mt-4">
                  <h2 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                    {product.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.category && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    )}

                    {product.availability && (
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.availability.toLowerCase() === "in stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.availability}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <p className="text-gray-800 font-bold mt-3">
                    Price : {product.price}$
                  </p>

                  {/* BUTTONS AT BOTTOM */}
                  <div className="mt-auto flex gap-2 pt-">
                    <button className="w-full py-2 border text-black rounded-lg hover:scale-95 transition">
                      View
                    </button>
                    <button className="w-full py-2 bg-black text-white rounded-lg hover:scale-95 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeatureProductCarousel;
