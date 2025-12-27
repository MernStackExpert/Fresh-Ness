import React from "react";
import ProductCard from "../ProductCard";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Organic Red Tomato",
      category: "Vegetables",
      price: 12.0,
      oldPrice: 15.0,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500",
      discount: "15%",
      isNew: true,
    },
    {
      id: 2,
      name: "Fresh Fuji Apple",
      category: "Fruits",
      price: 25.0,
      oldPrice: 30.0,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=500",
      discount: null,
      isNew: false,
    },
    {
      id: 3,
      name: "Farm Fresh Milk",
      category: "Dairy",
      price: 8.5,
      oldPrice: null,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&q=80&w=500",
      discount: "10%",
      isNew: true,
    },
    {
      id: 4,
      name: "Organic Green Broccoli",
      category: "Vegetables",
      price: 18.0,
      oldPrice: 22.0,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=500",
      discount: "20%",
      isNew: false,
    },
    {
      id: 5,
      name: "Natural Honey Jar",
      category: "Desserts",
      price: 45.0,
      oldPrice: 50.0,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500",
      discount: null,
      isNew: true,
    },
    {
      id: 6,
      name: "Fresh Strawberry",
      category: "Fruits",
      price: 35.0,
      oldPrice: 40.0,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=500",
      discount: "5%",
      isNew: false,
    },
    {
      id: 7,
      name: "Organic Carrot Pack",
      category: "Vegetables",
      price: 10.0,
      oldPrice: 12.0,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=500",
      discount: null,
      isNew: false,
    },
    {
      id: 8,
      name: "Fresh Orange Juice",
      category: "Beverages",
      price: 15.0,
      oldPrice: 18.0,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1624517534890-e4c67491b3b1?auto=format&fit=crop&q=80&w=500",
      discount: "12%",
      isNew: true,
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-gray-50/50">
      <div className="container mx-auto px-2 md:px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 px-2">
          <div>
            <span className="text-green-600 font-bold tracking-widest text-xs md:sm uppercase">
              Amader Collection
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mt-1 md:mt-2">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
            <button className="pb-2 px-2 border-b-2 border-green-600 text-green-600 font-bold text-sm md:text-base">
              All Products
            </button>
            <button className="pb-2 px-2 text-gray-400 hover:text-gray-800 transition-colors text-sm md:text-base">
              Vegetables
            </button>
            <button className="pb-2 px-2 text-gray-400 hover:text-gray-800 transition-colors text-sm md:text-base">
              Fruits
            </button>
            <button className="pb-2 px-2 text-gray-400 hover:text-gray-800 transition-colors text-sm md:text-base">
              Dairy
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 md:mt-16 text-center">
          <button className="bg-indigo-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-indigo-800 transition-all shadow-xl text-sm md:text-base active:scale-95">
            See All Products
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
