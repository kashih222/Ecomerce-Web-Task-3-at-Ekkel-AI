import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { ApolloError, useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../../../GraphqlOprations/mutation";

// Define a type for GraphQL error
interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

// Define a type for network error
interface NetworkError {
  result?: {
    errors?: Array<{ message: string }>;
  };
  message?: string;
}

interface ProductForm {
  name: string;
  category: string;
  price: number | "";
  description: string;
  shortDescription: string;
  images: {
    thumbnail: string;
    detailImage: string;
    gallery: string[];
  };
  specifications: {
    material: string;
    capacity: string;
    weight: string;
    color: string;
  };
  availability: string;
}

const AddProductPage = () => {
  const [addProduct, { loading }] = useMutation(ADD_PRODUCT);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    category: "",
    price: "",
    description: "",
    shortDescription: "",
    images: {
      thumbnail: "",
      detailImage: "",
      gallery: [""],
    },
    specifications: {
      material: "",
      capacity: "",
      weight: "",
      color: "",
    },
    availability: "In Stock",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      setFormData({ ...formData, [name]: value === "" ? "" : Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => {
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
      images: { ...formData.images, gallery: [...formData.images.gallery, ""] },
    });
  };

  const handleSpecChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [name]: value },
    });
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Build payload
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        description: formData.description.trim() || null,
        shortDescription: formData.shortDescription.trim() || null,
        images: {
          thumbnail: formData.images.thumbnail.trim() || null,
          detailImage: formData.images.detailImage.trim() || null,
          gallery: formData.images.gallery
            .map(url => url.trim())
            .filter(Boolean),
        },
        specifications: {
          capacity: formData.specifications.capacity.trim() || null,
          material: formData.specifications.material.trim() || null,
          color: formData.specifications.color.trim() || null,
          weight: formData.specifications.weight.trim() || null,
        },
        availability: formData.availability || "In Stock",
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const res = await addProduct({ 
        variables: { 
          productNew: payload 
        } 
      });

      toast.success("Product added successfully!");
      console.log("Success response:", res.data);

      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        shortDescription: "",
        images: { thumbnail: "", detailImage: "", gallery: [""] },
        specifications: { material: "", capacity: "", weight: "", color: "" },
        availability: "In Stock",
      });
    } catch (err: unknown) {
      console.error("Full error object:", err);
      
      // Type-safe error handling
      if (err instanceof ApolloError) {
        // Handle Apollo errors
        const apolloError = err as ApolloError;
        
        // Log GraphQL errors if they exist
        if (apolloError.graphQLErrors && apolloError.graphQLErrors.length > 0) {
          console.error("GraphQL Errors:", apolloError.graphQLErrors);
          apolloError.graphQLErrors.forEach((err: GraphQLError) => {
            console.error("GraphQL Error details:", err.message, err.extensions);
          });
        }
        
        // Log network error details
        if (apolloError.networkError) {
          console.error("Network Error:", apolloError.networkError);
          const networkError = apolloError.networkError as NetworkError;
          if (networkError.result) {
            console.error("Network Error result:", networkError.result);
          }
        }
        
        toast.error(`Failed to add product: ${apolloError.message}`);
      } else if (err instanceof Error) {
        // Handle regular JavaScript errors
        console.error("Error:", err.message);
        toast.error(`Failed to add product: ${err.message}`);
      } else {
        // Handle unknown errors
        console.error("Unknown error type:", err);
        toast.error("Failed to add product: Unknown error occurred");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={submitProduct} className="space-y-4">
        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="name" 
            placeholder="Product Name" 
            className="input" 
            value={formData.name}
            onChange={handleChange} 
            required 
          />
          <input 
            name="category" 
            placeholder="Category" 
            className="input" 
            value={formData.category}
            onChange={handleChange} 
            required 
          />
          <input 
            name="price" 
            type="number" 
            placeholder="Price" 
            className="input" 
            value={formData.price}
            onChange={handleChange} 
            required 
          />
        </div>

        <textarea 
          name="description" 
          placeholder="Full Description" 
          className="input" 
          rows={3} 
          value={formData.description}
          onChange={handleChange} 
        />
        <textarea 
          name="shortDescription" 
          placeholder="Short Description" 
          className="input" 
          rows={2} 
          value={formData.shortDescription}
          onChange={handleChange} 
        />

        {/* IMAGES */}
        <h3 className="font-semibold text-lg mt-4">Images</h3>
        <input 
          name="thumbnail" 
          placeholder="Thumbnail URL" 
          className="input" 
          value={formData.images.thumbnail}
          onChange={(e) => handleImageChange(e)} 
          required 
        />
        <input 
          name="detailImage" 
          placeholder="Detail Image URL" 
          className="input" 
          value={formData.images.detailImage}
          onChange={(e) => handleImageChange(e)} 
        />
        <h4 className="font-medium mt-2">Gallery</h4>
        {formData.images.gallery.map((item, index) => (
          <input 
            key={index} 
            name="gallery" 
            placeholder={`Gallery Image ${index + 1}`} 
            className="input mb-2" 
            value={item}
            onChange={(e) => handleImageChange(e, index)} 
          />
        ))}
        <button 
          type="button" 
          className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400" 
          onClick={addGalleryField}
        >
          + Add More
        </button>

        {/* SPECIFICATIONS */}
        <h3 className="font-semibold text-lg mt-4">Specifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            name="material" 
            placeholder="Material" 
            className="input" 
            value={formData.specifications.material}
            onChange={handleSpecChange} 
          />
          <input 
            name="capacity" 
            placeholder="Capacity" 
            className="input" 
            value={formData.specifications.capacity}
            onChange={handleSpecChange} 
          />
          <input 
            name="weight" 
            placeholder="Weight" 
            className="input" 
            value={formData.specifications.weight}
            onChange={handleSpecChange} 
          />
          <input 
            name="color" 
            placeholder="Color" 
            className="input" 
            value={formData.specifications.color}
            onChange={handleSpecChange} 
          />
        </div>

        <select 
          name="availability" 
          className="input" 
          value={formData.availability}
          onChange={handleChange}
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;