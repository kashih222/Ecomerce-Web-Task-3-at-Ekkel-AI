import { useState } from "react";
import ProductData from "../../ProductsPage/ProductsData.json";

interface Product {
  category: string;
}

const Category = () => {
  const [products] = useState<Product[]>(ProductData);

  const uniqueCategories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const categories = ["All", ...uniqueCategories];

  return (
    <div className="w-full  text-black flex items-center justify-center ">
      <div className="container">
        <div className="py-6 text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest">
            Categories
          </h1>
        </div>

        <div className="overflow-x-auto py-4 ">
          <ul className="flex flex-wrap gap-4 px-4 md:px-8">
            {categories.map((category, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-black text-white rounded-full hover:scale-90  cursor-pointer transition"
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
