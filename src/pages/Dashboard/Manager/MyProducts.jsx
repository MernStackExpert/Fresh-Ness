import React, { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMyProducts = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 100,
        search: search
      };

      const res = await axiosInstance.get("/products", { params });

      if (res.data.products) {
        const filteredProducts = res.data.products.filter(
          (item) => item.addedBy?.email === user.email
        );
        setProducts(filteredProducts);
        setTotalPages(res.data.totalPages || 1);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [currentPage, search, user?.email]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Product will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/products/${id}`);
          if (res.data.result.deletedCount > 0) {
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
            fetchMyProducts();
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                My Products
              </h2>
              <p className="text-gray-500 text-sm italic">
                Logged in as: {user?.email}
              </p>
            </div>
            <Link
              to="/dashboard/admin-manger/add-products"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <FaPlus /> Add New Product
            </Link>
          </div>

          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">Loading your collection...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">No products found for this email.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img className="h-10 w-10 rounded-lg object-cover border shadow-sm" src={product.thumbnail} alt={product.name} />
                        <div>
                          <div className="text-sm font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">${product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td> 
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <Link to={`/dashboard/admin/product-details/${product._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <FaEye size={18} />
                        </Link>
                        <Link to={`/dashboard/admin/update-product/${product._id}`} className="text-amber-500 hover:text-amber-700">
                          <FaEdit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <p className="text-xs text-gray-500">Showing {products.length} products added by you</p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer text-sm"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;