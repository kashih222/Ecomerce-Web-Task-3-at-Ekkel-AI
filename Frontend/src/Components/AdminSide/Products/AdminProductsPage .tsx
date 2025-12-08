import {
  useEffect,
  useState,
  Fragment,
  type ChangeEvent,
  type FormEvent,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  availability: string;
  images: {
    thumbnail: string;
    detailImage?: string;
    gallery?: string[];
  };
  specifications?: {
    material?: string;
    height?: string;
    width?: string;
    weight?: string;
    color?: string;
  };
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/product/all-products"
      );
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const confirmDeleteProduct = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/product/del-product/${selectedProductId}`
      );
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProductId(null);
    }
  };

  // Edit Product
  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editProduct) return;
    const { name, value } = e.target;

    // Handle numbers
    if (name === "price" || name === "rating") {
      setEditProduct({
        ...editProduct,
        [name]: value === "" ? 0 : Number(value),
      });
      return;
    }

    // Handle availability
    if (name === "availability") {
      setEditProduct({ ...editProduct, availability: value });
      return;
    }

    setEditProduct({ ...editProduct, [name]: value });
  };

  const submitEditProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    try {
      await axios.put(
        `http://localhost:5000/api/update/update-product/${editProduct._id}`,
        editProduct
      );

      toast.success("Product updated successfully!");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    } finally {
      setIsEditModalOpen(false);
      setEditProduct(null);
    }
  };

  if (loading) return <p className="text-center p-5">Loading products...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Rating</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((prod) => (
              <tr key={prod._id} className="text-center border-b">
                <td className="p-2 flex items-center justify-center">
                  <img
                    src={prod.images.thumbnail}
                    alt={prod.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-2 border font-medium">{prod.name}</td>
                <td className="p-2 border">{prod.category}</td>
                <td className="p-2 border">${prod.price}</td>
                <td className="p-2 border">{prod.rating} ⭐</td>

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

                <td className="p-2 flex gap-2 items-center justify-center ">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(prod._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <div className="fixed inset-0 backdrop-blur-sm " />
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
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={deleteProduct}
                    >
                      Delete
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
            <div className="fixed inset-0 backdrop-blur-sm " />
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
                          placeholder="Name"
                          className="input"
                          value={editProduct.name}
                          onChange={handleEditChange}
                          required
                        />
                        <input
                          name="category"
                          placeholder="Category"
                          className="input"
                          value={editProduct.category}
                          onChange={handleEditChange}
                          required
                        />
                        <input
                          name="price"
                          type="number"
                          placeholder="Price"
                          className="input"
                          value={editProduct.price}
                          onChange={handleEditChange}
                          required
                        />
                        <input
                          name="rating"
                          type="number"
                          placeholder="Rating"
                          className="input"
                          value={editProduct.rating}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="input flex gap-4 items-center">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="availability"
      value="In Stock"
      checked={editProduct.availability === "In Stock"}
      onChange={handleEditChange}
    />
    In Stock
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="availability"
      value="Out of Stock"
      checked={editProduct.availability === "Out of Stock"}
      onChange={handleEditChange}
    />
    Out of Stock
  </label>
</div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setIsEditModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save Changes
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
