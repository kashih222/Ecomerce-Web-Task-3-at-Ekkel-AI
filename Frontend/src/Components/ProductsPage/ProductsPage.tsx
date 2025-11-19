import { useState } from "react";
import ProductsData from "./ProductsData.json";
import Category from "./Category/Category";

interface Product {
  id: string;
  name: string;
  price: number;
  images: ProductImages;
  rating?: number;
  category?: string;
  description?: string;
  shortDescription: string;
  reviews?: { user: string; comment: string; rating: number }[];
  specifications?: {
    color: string;
    height: string;
    weight: string;
    material: string;
    width: string;
  };
  availability?: string;
}

interface ProductImages {
  thumbnail: string;
  gallery: string[];
  detailImages?: string;
}

const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({
  rating,
  maxRating = 5,
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center mt-2">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400 text-lg">
          ★
        </span>
      ))}
      {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300 text-lg">
          ★
        </span>
      ))}
      <span className="ml-2 text-gray-600 text-sm">({rating})</span>
    </div>
  );
};

const ProductPage = () => {
  const [products] = useState<Product[] | null>(ProductsData as Product[]);

  return (
    <div className="w-full min-h-screen bg-gray-100 mt-20">
      {/* HEADER SECTION */}

      <div>
        <Category />
      </div>

      {/* PRODUCT GRID */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <figure className="w-full h-64 overflow-hidden rounded-lg">
                <img
                  src={product.images.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                />
              </figure>

              <h2 className="mt-4 font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-700 mt-2">{product.shortDescription}</p>

              {/* Category and Availability */}
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

              <p className="text-gray-700 font-bold mt-2">{product.price}$</p>

              {/* Star Rating */}
              {product.rating && <StarRating rating={product.rating} />}

              <div className="flex gap-2 mt-4">
                <button className="w-full py-2 outline-1 text-black rounded-lg hover:scale-90 transition">
                  View
                </button>
                <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:scale-90 hover:bg-gray-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
