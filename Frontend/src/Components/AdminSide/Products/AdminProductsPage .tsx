import { useState, Fragment, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery, useMutation } from "@apollo/client";
import {
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../../../GraphqlOprations/mutation";
import { GET_ALL_PRODUCTS } from "../../../GraphqlOprations/queries";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  availability: string;
  description?: string;
  shortDescription?: string;
  rating?: number;
  images: {
    thumbnail: string;
    detailImage?: string;
    gallery?: string[];
  };
  specifications?: {
    capacity?: string;
    material?: string;
    weight?: string;
    color?: string;
  };

}

interface ProductUpdateInput {
  name: string;
  category: string;
  price: number;
  availability: string;
  rating?: number | null;
  description?: string | null;
  shortDescription?: string | null;
  images?: {
    thumbnail?: string | null;
    detailImage?: string | null;
    gallery?: string[];
  };
  specifications?: {
    capacity?: string | null;
    material?: string | null;
    color?: string | null;
    weight?: string | null;
  };
}

const AdminProductsPage = () => {
  // Fetch products using GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS);

  // Update product mutation
  const [updateProduct, { loading: updateLoading }] = useMutation(
    UPDATE_PRODUCT,
    {
      onCompleted: () => {
        toast.success("Product updated successfully!");
        setIsEditModalOpen(false);
        setEditProduct(null);
        refetch();
      },
      onError: (error) => {
        console.error("Update error details:", error);
        console.error("GraphQL errors:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
        toast.error(`Failed to update product: ${error.message}`);
      },
    }
  );

  // Delete product mutation
  const [deleteProductMutation, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      onCompleted: () => {
        toast.success("Product deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedProductId(null);
        refetch();
      },
      onError: (error) => {
        console.error("Delete error details:", error);
        console.error("GraphQL errors:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
        toast.error(`Failed to delete product: ${error.message}`);
      },
    }
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Delete Product handlers
  const confirmDeleteProduct = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      await deleteProductMutation({
        variables: {
          productId: selectedProductId,
        },
      });
    } catch (error) {
      // Error is handled in onError callback
      console.error("Delete error:", error);
    }
  };

  // Edit Product handlers
  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editProduct) return;
    const { name, value } = e.target;

    // Handle availability
    if (name === "availability") {
      setEditProduct({ ...editProduct, availability: value });
      return;
    }

    // Handle price conversion
    if (name === "price") {
      setEditProduct({ ...editProduct, [name]: Number(value) });
      return;
    }

    // Handle rating conversion
    if (name === "rating") {
      setEditProduct({
        ...editProduct,
        [name]: value === "" ? undefined : Number(value),
      });
      return;
    }

    setEditProduct({ ...editProduct, [name]: value });
  };

  const submitEditProduct = async (e: FormEvent) => {
  e.preventDefault();
  if (!editProduct) return;

  console.log("🚨 DEBUG - Submitting edit for product ID:", editProduct._id);
  console.log("🚨 DEBUG - Edit product data:", editProduct);

  try {
    // Prepare update payload matching your GraphQL schema
    const productUpdate: ProductUpdateInput = {  
      name: editProduct.name.trim(),
      category: editProduct.category.trim(),
      price: editProduct.price,
      availability: editProduct.availability || "In Stock",
    };

    // Add optional fields only if they exist
    if (editProduct.description !== undefined) {
      productUpdate.description = editProduct.description.trim() || null;
    }
    
    if (editProduct.shortDescription !== undefined) {
      productUpdate.shortDescription = editProduct.shortDescription.trim() || null;
    }
    
    if (editProduct.rating !== undefined) {
      productUpdate.rating = editProduct.rating;
    }
    
    // Handle images
    if (editProduct.images) {
      productUpdate.images = {
        thumbnail: editProduct.images.thumbnail?.trim() || null,
        detailImage: editProduct.images.detailImage?.trim() || null,
        gallery: editProduct.images.gallery || [],
      };
    }
    
    // Handle specifications
    if (editProduct.specifications) {
      productUpdate.specifications = {
        capacity: editProduct.specifications.capacity?.trim() || null,
        material: editProduct.specifications.material?.trim() || null,
        color: editProduct.specifications.color?.trim() || null,
        weight: editProduct.specifications.weight?.trim() || null,
      };
    }

    console.log("🚨 DEBUG - Final update payload:", JSON.stringify(productUpdate, null, 2));

    await updateProduct({
      variables: {
        productId: editProduct._id,
        productUpdate: productUpdate,
      },
    });
  } catch (error) {
    // Error is handled in onError callback
    console.error("🚨 DEBUG - Update error:", error);
  }
};

  // Handle image error - use local placeholder
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='%23e5e7eb'%3E%3Crect width='64' height='64' rx='8'/%3E%3Cpath d='M32 24L24 32L32 40L40 32L32 24Z' fill='%239ca3af'/%3E%3C/svg%3E";
  };

  // Handle query errors
  if (error) {
    console.error("Query error details:", error);
    console.error("GraphQL errors:", error.graphQLErrors);
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">
          Error loading products: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) return <p className="text-center p-5">Loading products...</p>;

  // Extract products from GraphQL response
  const products: Product[] = data?.products || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      {products.length === 0 ? (
        <p className="text-center p-5">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod._id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="p-2 flex items-center justify-center">
                    <img
                      src={prod.images?.thumbnail}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={handleImageError}
                    />
                  </td>

                  <td className="p-2 border font-medium">{prod.name}</td>
                  <td className="p-2 border">{prod.category}</td>
                  <td className="p-2 border">${prod.price.toFixed(2)}</td>

                  <td className="p-2 border">
                    {prod.availability === "In Stock" ? (
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="p-2 flex gap-2 items-center justify-center">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                      disabled={updateLoading || deleteLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteProduct(prod._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                      disabled={updateLoading || deleteLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Delete Product
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this product? This action
                      cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                      onClick={deleteProduct}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Edit Product
                  </Dialog.Title>

                  {editProduct && (
                    <form
                      onSubmit={submitEditProduct}
                      className="mt-4 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="name"
                          placeholder="Name *"
                          className="input"
                          value={editProduct.name}
                          onChange={handleEditChange}
                          required
                        />
                        <input
                          name="category"
                          placeholder="Category *"
                          className="input"
                          value={editProduct.category}
                          onChange={handleEditChange}
                          required
                        />
                        <input
                          name="price"
                          type="number"
                          placeholder="Price *"
                          className="input"
                          value={editProduct.price}
                          onChange={handleEditChange}
                          required
                          min="0"
                          step="0.01"
                        />
                        <input
                          name="rating"
                          type="number"
                          placeholder="Rating (0-5)"
                          className="input"
                          value={editProduct.rating || ""}
                          onChange={handleEditChange}
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>

                      <div className="flex gap-4 items-center p-2 border rounded">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="availability"
                            value="In Stock"
                            checked={editProduct.availability === "In Stock"}
                            onChange={handleEditChange}
                            className="w-4 h-4"
                          />
                          <span className="text-green-600">In Stock</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="availability"
                            value="Out of Stock"
                            checked={
                              editProduct.availability === "Out of Stock"
                            }
                            onChange={handleEditChange}
                            className="w-4 h-4"
                          />
                          <span className="text-red-600">Out of Stock</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
                          onClick={() => setIsEditModalOpen(false)}
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminProductsPage;
