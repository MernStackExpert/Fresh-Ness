import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaArrowLeft, FaBoxOpen, FaTags, FaListUl, FaImages, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imgTab, setImgTab] = useState("upload");
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const categories = ["Vegetables", "Fresh Fruits", "Desserts", "Drinks & Juice", "Fish & Meats", "Pets & Animals"];

  const { register, handleSubmit, control, reset, setValue, watch } = useForm();

  const { fields: featFields, append: addFeat, remove: remFeat } = useFieldArray({ control, name: "features" });
  const { fields: tagFields, append: addTag, remove: remTag } = useFieldArray({ control, name: "tags" });
  const { fields: varFields, append: addVar, remove: remVar } = useFieldArray({ control, name: "variants" });
  const { fields: imgFields, append: addImg, remove: remImg } = useFieldArray({ control, name: "images" });

  const watchedMain = watch("singleImg");
  const watchedThumb = watch("thumbnail");
  const watchedAddedByName = watch("addedBy.name");
  const watchedAddedByEmail = watch("addedBy.email");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const data = res.data;
        if (!data.addedBy) {
          data.addedBy = { name: "N/A", email: "N/A" };
        }
        reset(data);
        setFetching(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load product data!",
        });
        navigate("/dashboard/admin/manage-products");
      }
    };
    fetchProduct();
  }, [id, reset, navigate]);

  const uploadImg = async (file, fieldName) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    
    Swal.fire({
      title: 'Uploading...',
      didOpen: () => { Swal.showLoading() },
      allowOutsideClick: false
    });

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      setValue(fieldName, res.data.data.display_url);
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload image to ImgBB',
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const { _id, createdAt, ...updateData } = data;
    
    const finalData = {
      ...updateData,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice),
      stock: Number(data.stock),
      discountPercentage: Number(data.discountPercentage),
      rating: Number(data.rating),
      totalReviews: Number(data.totalReviews),
      updatedAt: new Date(),
    };

    try {
      const res = await axiosInstance.patch(`/products/${id}`, finalData);
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Product details saved successfully.',
          showConfirmButton: false,
          timer: 2000
        });
        navigate("/dashboard/admin/manage-products");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while updating.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-bold text-2xl animate-pulse">Loading Product...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">Update Product</h2>
            <p className="text-blue-200 mt-1 italic text-sm font-medium">System ID: {id}</p>
          </div>
          <button onClick={() => navigate(-1)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all cursor-pointer">
            <FaArrowLeft size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-12">
          
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaUserShield className="text-purple-600" /> Publisher Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Added By Name</label>
                <input 
                  {...register("addedBy.name")} 
                  disabled={watchedAddedByName !== "N/A" && !!watchedAddedByName}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed outline-none font-bold text-gray-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Contact Email</label>
                <input 
                  {...register("addedBy.email")} 
                  disabled={watchedAddedByEmail !== "N/A" && !!watchedAddedByEmail}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed outline-none font-bold text-gray-600" 
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaBoxOpen className="text-blue-600" /> Identity Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Product Title</label>
                <input {...register("name", { required: true })} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">SEO Slug</label>
                <input {...register("slug", { required: true })} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">SKU</label>
                <input {...register("sku", { required: true })} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Brand</label>
                <input {...register("brand")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Category</label>
                <select {...register("category", { required: true })} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white cursor-pointer outline-none">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Sub Category</label>
                <input {...register("subCategory")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" />
              </div>
            </div>
          </section>

          <section className="p-8 bg-blue-50 rounded-[2.5rem] border-2 border-blue-100">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { label: "Price", name: "price" },
                  { label: "Old Price", name: "oldPrice" },
                  { label: "Discount %", name: "discountPercentage" },
                  { label: "Stock", name: "stock" },
                  { label: "Rating", name: "rating" },
                  { label: "Reviews", name: "totalReviews" }
                ].map(item => (
                  <div key={item.name} className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-blue-600 ml-1">{item.label}</label>
                    <input type="number" step="0.01" {...register(item.name)} className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" />
                  </div>
                ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Currency</label>
                  <select {...register("currency")} className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none">
                    <option value="USD">USD</option>
                    <option value="BDT">BDT</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Disc. Type</label>
                  <select {...register("discountType")} className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none">
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Status</label>
                  <select {...register("stockStatus")} className="w-full p-4 rounded-xl bg-white border-none shadow-sm outline-none">
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
             </div>
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaImages className="text-indigo-500" /> Media & Images</h3>
               <div className="flex bg-gray-100 p-1 rounded-2xl">
                 <button type="button" onClick={() => setImgTab("upload")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${imgTab === "upload" ? "bg-white text-black shadow-md" : "text-gray-400 cursor-pointer"}`}>ImgBB</button>
                 <button type="button" onClick={() => setImgTab("url")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${imgTab === "url" ? "bg-white text-black shadow-md" : "text-gray-400 cursor-pointer"}`}>Direct URL</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">Primary Product View</label>
                <div className="relative h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400 shadow-inner">
                  {watchedMain && <img src={watchedMain} className="w-full h-full object-cover" />}
                  {imgTab === "upload" && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadImg(e.target.files[0], "singleImg")} />}
                </div>
                {imgTab === "url" && <input {...register("singleImg")} className="w-full p-4 border rounded-2xl outline-none mt-2" placeholder="Paste singleImg URL" />}
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">Thumbnail Preview</label>
                <div className="relative h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400 shadow-inner">
                  {watchedThumb && <img src={watchedThumb} className="w-full h-full object-cover" />}
                  {imgTab === "upload" && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadImg(e.target.files[0], "thumbnail")} />}
                </div>
                {imgTab === "url" && <input {...register("thumbnail")} className="w-full p-4 border rounded-2xl outline-none mt-2" placeholder="Paste thumbnail URL" />}
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <label className="text-xs font-black uppercase text-gray-500">Gallery Array (images)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imgFields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2 group bg-gray-50 p-2 rounded-2xl border shadow-sm">
                    <input {...register(`images.${i}`)} className="flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Extra Image Link" />
                    <button type="button" onClick={() => remImg(i)} className="text-red-400 p-2 hover:text-red-600 cursor-pointer"><FaTrash /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addImg("")} className="text-xs font-black text-indigo-600 cursor-pointer hover:underline mt-2">+ Add Image Field</button>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Dynamic Product Variants</h3>
            <div className="grid grid-cols-1 gap-4">
              {varFields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-1 sm:grid-cols-4 gap-6 bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100 relative group transition-all hover:bg-white hover:border-blue-200 shadow-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Unit/Size</label>
                    <input {...register(`variants.${i}.unit`)} className="w-full p-4 border rounded-xl outline-none bg-white" placeholder="e.g. 500g" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Price</label>
                    <input type="number" step="0.01" {...register(`variants.${i}.price`)} className="w-full p-4 border rounded-xl outline-none bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Stock</label>
                    <input type="number" {...register(`variants.${i}.stock`)} className="w-full p-4 border rounded-xl outline-none bg-white" />
                  </div>
                  <button type="button" onClick={() => remVar(i)} className="bg-red-50 text-red-500 h-14 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all flex items-center justify-center mt-auto shadow-sm"><FaTrash /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addVar({ unit: "", price: 0, stock: 0 })} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold cursor-pointer hover:bg-black transition-all shadow-lg">+ Add Variant</button>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaListUl className="text-orange-500" /> Features</label>
              {featFields.map((f, i) => (
                <div key={f.id} className="flex gap-2 group">
                  <input {...register(`features.${i}`)} className="flex-1 p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-orange-400 transition-all shadow-sm" />
                  <button type="button" onClick={() => remFeat(i)} className="text-red-400 p-2 cursor-pointer opacity-0 group-hover:opacity-100"><FaTrash /></button>
                </div>
              ))}
              <button type="button" onClick={() => addFeat("")} className="text-sm font-black text-orange-600 cursor-pointer">+ New Feature</button>
            </div>
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaTags className="text-teal-500" /> SEO Tags</label>
              <div className="flex flex-wrap gap-3 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                {tagFields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                    <input {...register(`tags.${i}`)} className="text-xs font-bold w-20 outline-none bg-transparent" />
                    <button type="button" onClick={() => remTag(i)} className="text-gray-300 hover:text-red-500 cursor-pointer"><FaTrash size={10} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addTag("")} className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md">+</button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">Short Summary</label>
                <input {...register("shortDescription")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-indigo-500 shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500 ml-1">Full Long Description</label>
                <textarea {...register("description")} className="w-full p-8 border-2 border-gray-100 rounded-[2rem] h-52 outline-none focus:border-indigo-500 resize-none shadow-inner" />
             </div>
          </section>

          <section className="flex flex-wrap gap-8 p-10 bg-gray-900 rounded-[2.5rem] shadow-xl">
             {["isNew", "isFeatured", "isActive"].map(item => (
               <label key={item} className="flex items-center gap-4 cursor-pointer group select-none">
                  <input type="checkbox" {...register(item)} className="w-6 h-6 accent-blue-500 cursor-pointer" />
                  <span className="font-bold text-gray-300 capitalize group-hover:text-blue-400">{item.replace("is", "")}</span>
               </label>
             ))}
          </section>

          <footer className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t-2 border-gray-50">
            <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 rounded-2xl border-2 border-gray-200 font-black text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 cursor-pointer transition-all active:scale-95">
              Discard Changes
            </button>
            <button type="submit" disabled={loading} className="px-16 py-5 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50">
              <FaSave /> {loading ? "Saving..." : "Update Product"}
            </button>
          </footer>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProduct;