import React from "react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import Category from "./Category/Category";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  addToCart,
  fetchCart,
} from "../../../Redux Toolkit/features/cart/cartSlice";
import { useAppDispatch } from "../../../Redux Toolkit/hooks";
import { useQuery } from "@apollo/client";
import { GET_ALL_PRODUCTS } from "../../../GraphqlOprations/queries";

interface Product {
  _id: string;
  id?:string;
  name: string;
  price: number;
  images: ProductImages;
  category: string;
  description?: string;
  shortDescription: string;
  specifications: iSpecifications;
  availability: string;
  rating: number;
}

interface ProductImages {
  thumbnail: string;
  gallery: string[];
  detailImage: string;
}

interface iSpecifications {
  color: string;
  material: string;
  weight: string;
  capacity?: string;
}

const ProductPage = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const dispatch = useAppDispatch();

  // Fetch products using Apollo useQuery
  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS);

  // Set products once data is loaded
  React.useEffect(() => {
    if (data?.products) {
      setFilteredProducts(data.products);
    }
    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    }
    dispatch(fetchCart());
  }, [data, error, dispatch]);

  // Category Filter
  const handleCategorySelect = (category: string) => {
    setCurrentPage(1);
    if (category === "All") {
      setFilteredProducts(data?.products || []);
    } else {
      setFilteredProducts(
        (data?.products || []).filter((p: Product) => p.category === category)
      );
    }
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const handleViewClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImage(product.images.detailImage);
    setQuantity(1);
    setOpenViewModal(true);
  };

  if (loading) return <p className="text-center mt-20">Loading products...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-100 mt-32">
      <Category onCategorySelect={handleCategorySelect} />

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
                    await dispatch(addToCart({ product, quantity: 1 }));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

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
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4 `pt-[450px]` md:pt-4">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative shadow-lg">
              <button
                onClick={() => setOpenViewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <figure className="mb-4">
                    <img
                      src={selectedImage || selectedProduct.images.detailImage}
                      alt={selectedProduct.name}
                      className="w-full h-76 object-cover rounded-lg shadow-md"
                    />
                  </figure>

                  <div className="flex gap-2">
                    {[
                      selectedProduct.images.detailImage,
                      ...selectedProduct.images.gallery,
                    ]
                      .filter(Boolean)
                      .map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedProduct.name}-${idx}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-900"
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
                </div>

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
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
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
                      await dispatch(
                        addToCart({ product: selectedProduct, quantity })
                      );
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
