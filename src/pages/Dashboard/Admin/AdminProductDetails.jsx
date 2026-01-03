import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FaArrowLeft, FaEdit, FaChartLine } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";

import ImageGallery from "../../../components/Admin-Manger/ImageGallery";

import ProductInfo from "../../../components/Admin-Manger/ProductInfo";

import PriceStockChart from "../../../components/Admin-Manger/PriceStockChart";

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details", error);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center font-bold">Loading Details...</div>;
  if (!product)
    return (
      <div className="p-10 text-center text-red-500">Product not found!</div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
        >
          <FaArrowLeft /> Back to Manage Products
        </button>
        <div className="flex gap-3">
          <Link to={`/dashboard/admin/update-product/${product._id}`} className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
            <FaEdit /> Edit Product
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ImageGallery mainImg={product.singleImg} allImgs={product.images} />
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4">
              <FaChartLine className="text-blue-500" /> Price vs Stock Analysis
            </h3>
            <PriceStockChart
              price={product.price}
              stock={product.stock}
              variants={product.variants}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProductInfo product={product} />
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
              Full Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;
