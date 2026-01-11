import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import axiosInstance from "../../utils/axiosInstance";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchProducts = async (category = "") => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products", {
        params: {
          limit: 8,
          category: category || undefined,
        },
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filter);
  }, [filter]);

  return (
    <section className="py-10 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 px-2">
          <div>
            <span className="text-green-600 font-bold tracking-widest text-xs md:sm uppercase">
              Our Collection
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mt-1 md:mt-2">
              Featured Products
            </h2>
          </div>

          <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
            {["", "Vegetables", "Fresh Fruits", "Desserts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`pb-2 px-2 font-bold text-sm md:text-base transition-colors ${
                  filter === cat
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-400 hover:text-gray-800"
                }`}
              >
                {cat === "" ? "All Products" : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="loading loading-ring loading-xl"></span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 md:mt-16 text-center">
          <button className="bg-indigo-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-indigo-800 transition-all shadow-xl text-sm md:text-base active:scale-95">
            See All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;