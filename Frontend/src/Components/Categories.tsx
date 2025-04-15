import { useEffect, useState } from "react";


interface Category {
    id: number;
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
            .then((data) => {
                setCategoriesData(data);
            })
            .catch((error) => {
                console.error("Error fetching categories data:", error);
            });
    }, []);



    return (
        <div id="page5">
            <h1>Categories</h1>
            {categoriesData.map((category) => (
                <div className="elem" key={category.id}>
                    <img src={category.image} alt={category.name}></img>
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