import { useEffect, useState } from "react";
import "./Categories.css";

interface CategoryData {
  category: string;
  products: any[];
}

interface Category {
  name: string;
  description: string;
  image: string;
}

function Categories() {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/data/categories.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: CategoryData[]) => {
        const transformedCategories: Category[] = data.map((item, index) => ({
          name: item.category,
          description: `Explore our ${item.category.toLowerCase()} collection with ${item.products.length} amazing products`,
          image:
            item.products[0]?.image_url ||
            `https://images.unsplash.com/photo-151${1000000 + index}7171634-5f897ff02aa9?w=400&h=300&fit=crop`,
        }));
        setCategoriesData(transformedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories data:", error);
      });
  }, []);

  return (
    <div id="page5">
      <h1>Categories</h1>
      {categoriesData.map((category, index) => (
        <div className="elem" key={index}>
          <img src={category.image} alt={category.name} />
          <h2>{category.name}</h2>
          <div className="elem-part2">
            <h3>{category.description}</h3>
            <h5>25th March 2020</h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;
