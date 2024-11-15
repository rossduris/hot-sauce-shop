"use client";
import { useCart } from "../context/CartContext";

export default function ProductList({ products }: { products: Product[] }) {
  const { state, dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.prices[0].unitAmount, // Assuming the first price variant
        quantity: 1,
        image: product.images[0], // Assuming the first image
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          No products available at the moment.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded-lg shadow-sm overflow-hidden bg-white flex flex-col"
            >
              {/* Render each image URL from the JSON field */}
              <div className="overflow-hidden">
                {product.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ))}
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {product.description}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Category:{" "}
                  <span className="font-medium">
                    {product.category || "Uncategorized"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Stock: <span className="font-medium">{product.stock}</span>
                </p>
                <div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Add to Cart
                  </button>
                </div>
                {/* Display prices */}
                {product.prices.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {product.prices.map((price) => (
                      <li key={price.id} className="text-sm text-gray-700">
                        Price:{" "}
                        <span className="font-semibold">
                          ${(price.unitAmount / 100).toFixed(2)}{" "}
                          {price.currency.toUpperCase()}
                        </span>
                        {price.isActive ? (
                          <span className="text-green-600 ml-2">(Active)</span>
                        ) : (
                          <span className="text-red-600 ml-2">(Inactive)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mt-4">
                    No prices available for this product.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
