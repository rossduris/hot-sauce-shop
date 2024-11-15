"use client";
import { useEffect, useState } from "react";
import { getProducts } from "../server/actions";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const productData = (await getProducts()) as Product[];
      setProducts(productData);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.length === 0 ? (
        <div>No products available at the moment.</div>
      ) : (
        <ul className="flex">
          {products.map((product) => (
            <li key={product.id} className=" border flex flex-col">
              {/* Render each image URL from the JSON field */}
              {product.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={product.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ))}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Category: {product.category || "Uncategorized"}</p>
              <p>Stock: {product.stock}</p>

              {/* Display prices */}
              {product.prices.length > 0 ? (
                <ul>
                  {product.prices.map((price) => (
                    <li key={price.id}>
                      <p>
                        Price: {(price.unitAmount / 100).toFixed(2)}{" "}
                        {price.currency.toUpperCase()}
                        {price.isActive ? " (Active)" : " (Inactive)"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No prices available for this product.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
