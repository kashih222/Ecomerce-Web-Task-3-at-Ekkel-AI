import { useEffect, useState } from "react";
import axios from "axios";

const PRODUCT_CATAGORY = "http://localhost:5000/api/product-catagory/categories";

interface CategoryProps {
  onCategorySelect: (category: string) => void;
}

const Category = ({ onCategorySelect }: CategoryProps) => {
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get(PRODUCT_CATAGORY);
      const data = res.data.categories;

      setCategories(["All", ...data]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center py-6">
        <h2 className="text-xl font-semibold">Loading categories...</h2>
      </div>
    );
  }

  return (
    <div className="w-full text-black flex items-center justify-center">
      <div className="container">
        <div className="py-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest">
            Categories
          </h1>
        </div>

        <div className="overflow-x-auto py-4">
          <ul className="flex flex-wrap gap-4 px-4 md:px-8">
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedCategory(category);
                  onCategorySelect(category);
                }}
                className={`px-4 py-2 rounded-full cursor-pointer transition
                  ${
                    selectedCategory === category
                      ? "bg-black text-white scale-95"
                      : "bg-gray-200 text-black hover:scale-90"
                  }`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Category;
