import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ProductForm {
  name: string;
  category: string;
  price: number | "";
  rating: number | "";
  description: string;
  shortDescription: string;
  images: {
    thumbnail: string;
    detailImage: string;
    gallery: string[];
  };
  specifications: {
    material: string;
    height: string;
    width: string;
    weight: string;
    color: string;
  };
  availability: string;
}

const AddProductPage = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    price: "",
    rating: "",
    description: "",
    shortDescription: "",
    images: {
      thumbnail: "",
      detailImage: "",
      gallery: [""],
    },
    specifications: {
      material: "",
      height: "",
      width: "",
      weight: "",
      color: "",
    },
    availability: "In Stock",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "price" || name === "rating") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === "thumbnail" || name === "detailImage") {
      setFormData({
        ...formData,
        images: { ...formData.images, [name]: value },
      });
    } else if (name === "gallery" && index !== undefined) {
      const updatedGallery = [...formData.images.gallery];
      updatedGallery[index] = value;

      setFormData({
        ...formData,
        images: { ...formData.images, gallery: updatedGallery },
      });
    }
  };

  const addGalleryField = () => {
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        gallery: [...formData.images.gallery, ""],
      },
    });
  };

  const handleSpecChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [name]: value },
    });
  };

  // Submit Data
 const submitProduct = async (e: FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,
      rating: formData.rating === "" ? 0 : formData.rating,
    };

    const res = await axios.post(
      "http://localhost:5000/api/product/addproduct",
      payload
    );

    toast.success("Product added successfully!");
    console.log(res.data);

    // RESET FORM HERE
    setFormData({
      name: "",
      category: "",
      price: "",
      rating: "",
      description: "",
      shortDescription: "",
      images: {
        thumbnail: "",
        detailImage: "",
        gallery: [""],
      },
      specifications: {
        material: "",
        height: "",
        width: "",
        weight: "",
        color: "",
      },
      availability: "In Stock",
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to add product");
  }
};

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={submitProduct} className="space-y-4">
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Product Name" className="input" onChange={handleChange} required />
          <input name="category" placeholder="Category" className="input" onChange={handleChange} required />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="rating"
            type="number"
            placeholder="Rating"
            className="input"
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Full Description"
          className="input"
          rows={3}
          onChange={handleChange}
          required
        />

        <textarea
          name="shortDescription"
          placeholder="Short Description"
          className="input"
          rows={2}
          onChange={handleChange}
          required
        />

        {/* IMAGES SECTION */}
        <h3 className="font-semibold text-lg mt-4">Images</h3>

        <input
          name="thumbnail"
          placeholder="Thumbnail URL"
          className="input"
          onChange={(e) => handleImageChange(e)}
          required
        />

        <input
          name="detailImage"
          placeholder="Detail Image URL"
          className="input"
          onChange={(e) => handleImageChange(e)}
        />

        <h4 className="font-medium mt-2">Gallery</h4>

        {formData.images.gallery.map((item, index) => (
          <input
            key={index}
            name="gallery"
            placeholder={`Gallery Image ${index + 1}`}
            className="input"
            value={item}
            onChange={(e) => handleImageChange(e, index)}
          />
        ))}

        <button type="button" className="px-3 py-2 bg-gray-300 rounded" onClick={addGalleryField}>
          + Add More
        </button>

        {/* SPECIFICATIONS */}
        <h3 className="font-semibold text-lg mt-4">Specifications</h3>

        <div className="grid grid-cols-2 gap-4">
          <input name="material" placeholder="Material" className="input" onChange={handleSpecChange} />
          <input name="height" placeholder="Height" className="input" onChange={handleSpecChange} />
          <input name="width" placeholder="Width" className="input" onChange={handleSpecChange} />
          <input name="weight" placeholder="Weight" className="input" onChange={handleSpecChange} />
          <input name="color" placeholder="Color" className="input" onChange={handleSpecChange} />
        </div>

        <select name="availability" className="input" onChange={handleChange}>
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
