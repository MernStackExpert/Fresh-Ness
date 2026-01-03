import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Vegetables", "Fruits", "Dairy", "Bakery"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: search,
        category: category,
      };

      const res = await axiosInstance.get("/products", { params });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, category, search]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            fetchProducts(); // ডেটা রিফ্রেশ করা
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header & Search/Filter Section */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Manage Products
              </h2>
              <p className="text-gray-500 text-sm">
                Total Products Found: {products.length}
              </p>
            </div>
            <Link to="/dashboard/admin-manger/add-products" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md active:scale-95">
              <FaPlus /> Add New Product
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // সার্চ করলে ১ নম্বর পেজে নিয়ে যাবে
                }}
              />
            </div>
            {/* Category Filter */}
            <select
              className="w-full md:w-48 p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Name & SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 font-medium">
                    Loading...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover border"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/dashboard/admin/product-details/${product._id}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </Link>
                        <Link to={`/dashboard/admin/update-product/${product._id}`} className="text-amber-500 hover:text-amber-700">
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
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

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === index + 1
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
