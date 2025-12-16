import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import Category from "./Category/Category";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { addToCart, fetchCart } from "../../../Redux Toolkit/features/cart/cartSlice";
import { useAppDispatch } from "../../../Redux Toolkit/hooks";

const FETCH_PRODUCTS = "http://localhost:5000/api/fetch/all-products";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: ProductImages;
  rating: number;
  category: string;
  description?: string;
  shortDescription: string;
  reviews: iReview[];
  specifications: iSpecifications;
  availability: string;
}

interface ProductImages {
  thumbnail: string;
  gallery: string[];
  detailImages: string;
}

interface iReview {
  user: string;
  comment: string;
  rating: number;
}

interface iSpecifications {
  color: string;
  height: string;
  weight: string;
  material: string;
  width: string;
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  //  Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const dispatch = useAppDispatch();

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(FETCH_PRODUCTS);

        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        toast.error("Failed to load products from server");
        console.error(error);
      }
    };

    loadProducts();
    dispatch(fetchCart());
  }, [dispatch]);

  // Category Filter
  const handleCategorySelect = (category: string) => {
    setCurrentPage(1);

    if (category === "All") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter((p) => p.category === category));
    }
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Page Change Handler
  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  // View Modal Handler
  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImage(product.images.detailImages);
    setQuantity(1);
    setOpenViewModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 mt-20">
      {/* Category Component */}
      <Category onCategorySelect={handleCategorySelect} />

      {/* Product List */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
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
              {product.rating && <StarRating rating={product.rating} />}

              <div className="flex gap-2 mt-auto">
                <button
                  className="w-full py-2 outline-1 text-black rounded-lg hover:scale-90 transition"
                  onClick={() => handleViewClick(product)}
                >
                  View
                </button>
                <button
                  className="w-full py-2 bg-gray-900 text-white rounded-lg hover:scale-90 hover:bg-gray-700 transition"
                  onClick={async () => {
                    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
                    console.log("add to cart button clicked ");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination UI */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center py-10">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                color="primary"
              />
            </Stack>
          </div>
        )}

        {/* View Modal */}
        {openViewModal && selectedProduct && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4 pt-[450px] md:pt-4 ">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative shadow-lg">
              <button
                onClick={() => setOpenViewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div>
                  <figure className="mb-4">
                    <img
                      src={selectedImage || selectedProduct.images.detailImages}
                      alt={selectedProduct.name}
                      className="w-full h-76 object-cover rounded-lg shadow-md"
                    />
                  </figure>

                  <div className="flex gap-2">
                    {[
                      selectedProduct.images.detailImages,
                      ...selectedProduct.images.gallery,
                    ]
                      .filter((img): img is string => !!img)
                      .map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${selectedProduct.name}-${index}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-900"
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-gray-600">{selectedProduct.category}</p>
                  <p className="text-xl font-semibold">
                    ${selectedProduct.price}
                  </p>

                  <p
                    className={`font-medium ${
                      selectedProduct.availability.toLowerCase() === "in stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedProduct.availability}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold">{quantity}</span>
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                    
                  <button
                    className="mt-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
                    onClick={async () => {
                      if (!selectedProduct) return;
                      await dispatch(addToCart({ productId: selectedProduct._id, quantity }));
                      setOpenViewModal(false);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
