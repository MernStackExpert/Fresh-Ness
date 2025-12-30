import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ProductCard from "../components/ProductCard";
import { 
  IoFilterOutline, IoSearchOutline, IoCloseCircleOutline, 
  IoChevronBack, IoChevronForward, IoPricetagOutline 
} from "react-icons/io5";

const AllGroceries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "");
  const [category, setCategory] = useState(queryParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(queryParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(queryParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(Number(queryParams.get("page")) || 1);
  const limit = 20;

  useEffect(() => {
    const currentSearch = new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(currentSearch);
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:3000/products?search=${searchQuery}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setProducts(data.products || []);
      setTotalProducts(data.totalProducts || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (category) params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("page", page);
      navigate(`?${params.toString()}`, { replace: true });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, category, minPrice, maxPrice, sortBy, order, page]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 py-6 md:py-10 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Grocery Market</h1>
            <p className="text-gray-500 font-medium mt-1">Found {totalProducts} fresh items</p>
          </div>

          <div className="relative w-full md:w-[450px]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-12 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none font-bold text-gray-700"
            />
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                <IoCloseCircleOutline size={22} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-10 self-start">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-2 mb-8 pb-3 border-b border-gray-50">
              <IoFilterOutline size={22} className="text-green-600" />
              <h2 className="font-black text-xl text-gray-800 uppercase tracking-tighter">Filters</h2>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <IoPricetagOutline className="text-green-600" />
                <h3 className="font-bold text-gray-700 text-sm uppercase">Your Budget ($)</h3>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input 
                  type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest">Category</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {["", "Vegetables", "Fruits", "Dairy", "Beverages"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${category === cat ? "bg-green-600 text-white shadow-xl shadow-green-100" : "bg-gray-50 text-gray-500 hover:bg-green-50"}`}
                  >
                    {cat === "" ? "All Groceries" : cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest">Sort Results</h3>
              <div className="grid grid-cols-1 gap-2 pb-2">
                {[
                  { label: "Newest Arrivals", val: "createdAt-desc" },
                  { label: "Price: Low to High", val: "price-asc" },
                  { label: "Price: High to Low", val: "price-desc" }
                ].map((opt) => (
                  <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${sortBy + "-" + order === opt.val ? "border-green-600 bg-green-50/50" : "border-gray-50 hover:bg-gray-50"}`}>
                    <input 
                      type="radio" name="sort" className="accent-green-600 w-4 h-4"
                      checked={sortBy + "-" + order === opt.val}
                      onChange={() => {
                        const [f, o] = opt.val.split("-");
                        setSortBy(f); setOrder(o);
                      }}
                    />
                    <span className="text-sm font-bold text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-200 h-80 rounded-[32px] animate-pulse"></div>)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {products.map((item) => <ProductCard key={item._id} product={item} />)}
              </div>

              <div className="mt-16 flex justify-center items-center gap-2 md:gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-green-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <IoChevronBack size={24} />
                </button>

                <div className="flex items-center gap-2 no-scrollbar">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-12 h-12 rounded-2xl font-black transition-all ${page === i + 1 ? "bg-green-600 text-white shadow-lg shadow-green-100 scale-110" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-green-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <IoChevronForward size={24} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <IoSearchOutline size={60} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-2xl font-black text-gray-800">No match for your filters</h2>
              <p className="text-gray-400 mt-2 font-medium">Try broadening your budget or search term.</p>
              <button onClick={() => {setSearchQuery(""); setMinPrice(""); setMaxPrice(""); setCategory("")}} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-100">Reset Filters</button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AllGroceries;