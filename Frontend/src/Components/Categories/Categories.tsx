import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/apiFetch';
import "./Categories.css";

interface Category {
  name: string;
  description: string;
  image: string;
  updatedAt?: string | Date;
}

function formatDate(value?: string | Date) {
  if (!value) return '';
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return '';
  }
}

function Categories() {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const cats: any = await apiFetch('/categories');
        if (Array.isArray(cats)) {
          // For each category, try to load its products and use the first product's image
          const transformedCategories: Category[] = await Promise.all(
            cats.map(async (item: any, index: number) => {
              let imageUrl = item.image_url || item.image || '';
              let date = '';
              try {
                // backend: GET /products/:id returns products for a category id
                const prods: any = await apiFetch(`/products/${item.id}`);
                if (Array.isArray(prods) && prods.length) {
                  const first = prods[0];
                  imageUrl = first.image_url || first.image || imageUrl;
                  date = first.updatedAt || first.updated_at || '';
                }
              } catch (e) {
                // ignore per-category product fetch errors and keep fallback image
              }

              return {
                name: item.name || item.category || `Category ${item.id}`,
                description: `Explore our ${(item.name || item.category || '').toLowerCase()} collection`,
                image: imageUrl || (`https://images.unsplash.com/photo-151${1000000 + index}7171634-5f897ff02aa9?w=400&h=300&fit=crop`),
                updatedAt: date || item.updatedAt || item.updated_at || undefined,
              } as Category;
            })
          );
          setCategoriesData(transformedCategories);
        } else {
          setCategoriesData([]);
        }
      } catch (error) {
        console.error("Error fetching categories data:", error);
        setCategoriesData([]);
      }
    };
    load();
  }, [categoriesData]);

  return (
    <div id="page5">
      <h1>Categories</h1>
      {categoriesData.map((category, index) => {
        const slug = category.name.toLowerCase().replace(/\s+/g, '-');
        return (
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/show-card/${encodeURIComponent(slug)}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/show-card/${encodeURIComponent(slug)}`); }}
            className="elem"
            key={index}
            style={{ cursor: 'pointer' }}
          >
            <img src={category.image} alt={"click to Explore"} />
            <h2>{category.name}</h2>
            <div className="elem-part2">
              <h3>{category.description}</h3>
              {
                (() => {
                  const formatted = formatDate(category.updatedAt);
                  return <h5>{formatted ? `${formatted}` : 'Written'}</h5>;
                })()
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Categories;
