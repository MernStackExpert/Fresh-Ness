import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaRedo,
  FaListUl,
  FaTags,
  FaBoxOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imgTab, setImgTab] = useState("upload");
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const isRestrictedAdmin = user?.email === "admin@freshness.com";

  const categories = [
    "Vegetables",
    "Fresh Fruits",
    "Desserts",
    "Drinks & Juice",
    "Fish & Meats",
    "Pets & Animals",
  ];

  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      currency: "USD",
      stockStatus: "in-stock",
      discountType: "percentage",
      rating: 5,
      totalReviews: 0,
      features: [""],
      tags: [""],
      variants: [{ unit: "", price: 0, stock: 0 }],
      images: [""],
      isNew: true,
      isFeatured: false,
      isActive: true,
    },
  });

  const {
    fields: featFields,
    append: addFeat,
    remove: remFeat,
  } = useFieldArray({ control, name: "features" });
  const {
    fields: tagFields,
    append: addTag,
    remove: remTag,
  } = useFieldArray({ control, name: "tags" });
  const {
    fields: varFields,
    append: addVar,
    remove: remVar,
  } = useFieldArray({ control, name: "variants" });
  const {
    fields: imgFields,
    append: addImg,
    remove: remImg,
  } = useFieldArray({ control, name: "images" });

  const watchedMain = watch("singleImg");
  const watchedThumb = watch("thumbnail");

  const uploadImg = async (file, fieldName) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      setValue(fieldName, res.data.data.display_url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed!", { id: toastId });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const productData = {
      ...data,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice),
      stock: Number(data.stock),
      discountPercentage: Number(data.discountPercentage),
      rating: Number(data.rating),
      totalReviews: Number(data.totalReviews),
      addedBy: { name: user?.displayName, email: user?.email },
    };

    try {
      const res = await axiosInstance.post("/products", productData);
      if (res.status === 201) {
        toast.success("Product successfully added to shop! 🛒", {
          duration: 4000,
          position: "top-center",
        });
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 md:p-8 bg-gray-50 min-h-screen ${
        isRestrictedAdmin ? "pointer-events-none select-none" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
          <h2 className="text-4xl font-black tracking-tighter">
            Publish New Item
          </h2>
          <p className="text-gray-400 mt-2 font-medium italic">
            Creating as: {user?.displayName}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-12 space-y-12"
        >
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaBoxOpen className="text-green-600" /> General Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  Product Title
                </label>
                <input
                  {...register("name", { required: true })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all hover:bg-gray-50 focus:bg-white"
                  placeholder="Organic Broccoli Florets"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  URL Slug
                </label>
                <input
                  {...register("slug", { required: true })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 outline-none transition-all hover:bg-gray-50"
                  placeholder="organic-broccoli-florets"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  SKU Identification
                </label>
                <input
                  {...register("sku", { required: true })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-green-500"
                  placeholder="VEG-BRO-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  Brand Name
                </label>
                <input
                  {...register("brand")}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-green-500"
                  placeholder="Green Harvest"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  Category
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white cursor-pointer outline-none focus:border-green-500"
                >
                  <option value="">Choose...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">
                  Sub Category
                </label>
                <input
                  {...register("subCategory")}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-green-500"
                  placeholder="Fresh Vegetables"
                />
              </div>
            </div>
          </section>

          <section className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100 shadow-inner">
            <h3 className="text-sm font-black text-green-700 uppercase tracking-widest mb-6">
              Pricing & Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { label: "Price", name: "price" },
                { label: "Old Price", name: "oldPrice" },
                { label: "Discount %", name: "discountPercentage" },
                { label: "Stock Qty", name: "stock" },
                { label: "Rating", name: "rating" },
                { label: "Reviews", name: "totalReviews" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-green-600 ml-1">
                    {item.label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(item.name)}
                    className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-green-600">
                  Stock Status
                </label>
                <select
                  {...register("stockStatus")}
                  className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-green-600">
                  Currency
                </label>
                <select
                  {...register("currency")}
                  className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BDT">BDT (৳)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-green-600">
                  Discount Type
                </label>
                <select
                  {...register("discountType")}
                  className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCloudUploadAlt className="text-blue-500" /> Media & Assets
              </h3>
              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setImgTab("upload")}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    imgTab === "upload"
                      ? "bg-white text-black shadow-md"
                      : "text-gray-400 cursor-pointer"
                  }`}
                >
                  ImgBB Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImgTab("url")}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    imgTab === "url"
                      ? "bg-white text-black shadow-md"
                      : "text-gray-400 cursor-pointer"
                  }`}
                >
                  External URL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">
                  Main Display Image (singleImg)
                </label>
                <div className="relative group h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                  {watchedMain ? (
                    <img
                      src={watchedMain}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FaCloudUploadAlt className="text-5xl text-gray-200 mx-auto" />
                      <p className="text-gray-400 text-xs mt-2">
                        No Image Selected
                      </p>
                    </div>
                  )}
                  {imgTab === "upload" && (
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) =>
                        uploadImg(e.target.files[0], "singleImg")
                      }
                    />
                  )}
                </div>
                {imgTab === "url" && (
                  <input
                    {...register("singleImg")}
                    className="w-full p-4 border rounded-2xl outline-none"
                    placeholder="https://unsplash.com/photo-..."
                  />
                )}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">
                  Thumbnail Preview
                </label>
                <div className="relative h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                  {watchedThumb ? (
                    <img
                      src={watchedThumb}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCloudUploadAlt className="text-5xl text-gray-200 mx-auto" />
                  )}
                  {imgTab === "upload" && (
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) =>
                        uploadImg(e.target.files[0], "thumbnail")
                      }
                    />
                  )}
                </div>
                {imgTab === "url" && (
                  <input
                    {...register("thumbnail")}
                    className="w-full p-4 border rounded-2xl outline-none"
                    placeholder="Thumbnail link..."
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black uppercase text-gray-500">
                Additional Gallery (Array)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imgFields.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 group p-2 bg-gray-50 rounded-2xl border transition-all hover:shadow-md"
                  >
                    <input
                      {...register(`images.${i}`)}
                      className="flex-1 bg-transparent p-2 text-sm outline-none"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={() => remImg(i)}
                      className="text-red-400 p-2 cursor-pointer hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addImg("")}
                className="text-xs font-black text-blue-600 cursor-pointer hover:underline"
              >
                + Add More Image Field
              </button>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaPlus className="text-purple-600" /> Dynamic Variants
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {varFields.map((f, i) => (
                <div
                  key={f.id}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100 relative group animate-in zoom-in-95 duration-300"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Unit/Weight
                    </label>
                    <input
                      {...register(`variants.${i}.unit`)}
                      className="w-full p-4 border rounded-xl outline-none bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="250g"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${i}.price`)}
                      className="w-full p-4 border rounded-xl outline-none bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Unit Stock
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${i}.stock`)}
                      className="w-full p-4 border rounded-xl outline-none bg-white focus:ring-2 focus:ring-purple-200"
                      placeholder="40"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remVar(i)}
                    className="bg-red-50 text-red-500 h-14 mt-auto rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addVar({ unit: "", price: 0, stock: 0 })}
              className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold cursor-pointer hover:bg-black transition-all shadow-lg"
            >
              + Add New Variant
            </button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaListUl className="text-orange-500" /> Features
              </label>
              {featFields.map((f, i) => (
                <div key={f.id} className="flex gap-2">
                  <input
                    {...register(`features.${i}`)}
                    className="flex-1 p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-orange-400 transition-all"
                    placeholder="e.g. Chemical Free"
                  />
                  <button
                    type="button"
                    onClick={() => remFeat(i)}
                    className="text-red-400 p-2 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addFeat("")}
                className="text-sm font-black text-orange-600 cursor-pointer"
              >
                + Add New Feature
              </button>
            </div>
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaTags className="text-teal-500" /> Tags
              </label>
              <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                {tagFields.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm"
                  >
                    <input
                      {...register(`tags.${i}`)}
                      className="text-xs font-bold w-16 outline-none bg-transparent"
                      placeholder="Tag..."
                    />
                    <button
                      type="button"
                      onClick={() => remTag(i)}
                      className="text-gray-300 hover:text-red-500 cursor-pointer"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTag("")}
                  className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-teal-700"
                >
                  +
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 ml-1">
                Short Description
              </label>
              <input
                {...register("shortDescription")}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-green-500"
                placeholder="Crisp and fresh organic broccoli florets."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 ml-1">
                Full Description
              </label>
              <textarea
                {...register("description")}
                className="w-full p-8 border-2 border-gray-100 rounded-[2rem] h-52 outline-none focus:border-green-500 resize-none"
                placeholder="Write full details about the harvest..."
              />
            </div>
          </section>

          <section className="flex flex-wrap gap-8 p-10 bg-gray-900 rounded-[2.5rem] shadow-xl">
            {["isNew", "isFeatured", "isActive"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register(item)}
                    className="peer hidden"
                  />
                  <div className="w-6 h-6 border-2 border-gray-600 rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 transition-all" />
                </div>
                <span className="font-bold text-gray-300 capitalize group-hover:text-green-400">
                  {item.replace("is", "")}
                </span>
              </label>
            ))}
          </section>

          <footer className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t-2 border-gray-50">
            <button
              type="button"
              onClick={() => {
                reset();
                toast.error("Form cleared!");
              }}
              className="px-10 py-5 rounded-2xl border-2 border-gray-200 font-black text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              <FaRedo /> Reset Form
            </button>

            {isRestrictedAdmin ? (
              <button disabled className="px-16 py-5 rounded-2xl bg-green-600 text-white font-black shadow-2xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all cursor-p flex items-center gap-2 active:scale-95 disabled:opacity-50">
                Publish Disabled
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-16 py-5 rounded-2xl bg-green-600 text-white font-black shadow-2xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <FaSave /> {loading ? "Publishing..." : "Publish Product"}
              </button>
            )}
          </footer>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct;
