import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { 
  IoStar, IoCartOutline, IoHeartOutline, IoSyncOutline, 
  IoCheckmarkCircle, IoShieldCheckmarkOutline, IoLeafOutline,
  IoChevronBack, IoChevronForward
} from "react-icons/io5";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Fetch Single Product Details
        const res = await fetch(`http://localhost:3000/products/${id}`);
        const data = await res.json();
        
        setProduct(data);
        setMainImage(data.singleImg);
        
        // Set default variant if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        // Fetch Related Products from the same category
        const relatedRes = await fetch(`http://localhost:3000/products?category=${data.category}&limit=5`);
        const relatedData = await relatedRes.json();
        
        // Filter out current product from related list
        setRelatedProducts(relatedData.products.filter(p => p._id !== id));
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // Handle Add to Cart with Local Storage
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const cartItem = {
      cartId: `${product._id}-${selectedVariant?.unit || 'default'}`,
      productId: product._id,
      name: product.name,
      image: product.singleImg,
      price: selectedVariant ? selectedVariant.price : product.price,
      unit: selectedVariant ? selectedVariant.unit : "Standard",
      quantity: quantity,
      category: product.category
    };

    const existingItemIndex = existingCart.findIndex(item => item.cartId === cartItem.cartId);

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`${product.name} has been added to your cart!`);
    
    // Optional: Trigger a custom event to update Navbar count immediately
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <span className="ml-4 font-bold text-gray-700">Loading Product Details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found!</h2>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- Left Column: Image Gallery --- */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm"
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-6 left-6 bg-pink-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[product.singleImg, ...product.images].map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    mainImage === img ? "border-green-600 scale-95 shadow-md" : "border-gray-100 opacity-70"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* --- Right Column: Product Details --- */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-green-600 font-bold uppercase tracking-widest text-xs">
                {product.brand} • {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <IoStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-gray-400 font-bold text-sm">
                  ({product.totalReviews} Customer Reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-indigo-900">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700 font-semibold text-sm md:text-base">
                  <IoCheckmarkCircle className="text-green-500" size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Variant Selection */}
            {product.variants.length > 0 && (
              <div className="mb-10">
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${
                        selectedVariant?.unit === v.unit 
                        ? "border-green-600 bg-green-50 text-green-700 shadow-sm" 
                        : "border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {v.unit} - ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA Actions */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 px-4 h-14 border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-2xl font-bold px-2 text-gray-600 hover:text-green-600"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center bg-transparent font-black text-xl text-gray-800" 
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-2xl font-bold px-2 text-gray-600 hover:text-green-600"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:bg-green-700 transition-all uppercase tracking-widest"
              >
                <IoCartOutline size={24} /> Add to Cart
              </button>

              <div className="flex gap-2">
                <button className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-100 transition-all">
                  <IoHeartOutline size={24} />
                </button>
                <button className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-100 transition-all">
                  <IoSyncOutline size={24} />
                </button>
              </div>
            </div>

            {/* Trust and Certification Badges */}
            <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <IoLeafOutline size={26} className="mx-auto text-green-600" />
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">100% Organic</p>
              </div>
              <div className="text-center space-y-2">
                <IoShieldCheckmarkOutline size={26} className="mx-auto text-blue-600" />
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Quality Tested</p>
              </div>
              <div className="text-center space-y-2">
                <IoCheckmarkCircle size={26} className="mx-auto text-amber-600" />
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Farm to Table</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Related Products Section --- */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Related Groceries</h2>
              <p className="text-gray-400 text-sm font-medium">You might also like these fresh picks</p>
            </div>
            <div className="flex gap-2">
               <button className="p-3 bg-gray-50 rounded-full text-gray-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                 <IoChevronBack size={20} />
               </button>
               <button className="p-3 bg-gray-50 rounded-full text-gray-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                 <IoChevronForward size={20} />
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.length > 0 ? (
              relatedProducts.map(item => (
                <ProductCard key={item._id} product={item} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10 font-medium">No related products found in this category.</p>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProductDetails;