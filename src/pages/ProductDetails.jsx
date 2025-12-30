import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoStar, IoCartOutline, IoHeartOutline, IoSyncOutline, 
  IoCheckmarkCircle, IoShieldCheckmarkOutline, IoLeafOutline,
  IoChevronBack, IoChevronForward
} from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

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
        const res = await fetch(`http://localhost:3000/products/${id}`);
        const data = await res.json();
        
        setProduct(data);
        setMainImage(data.singleImg);
        
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        const relatedRes = await fetch(`http://localhost:3000/products?category=${data.category}&limit=5`);
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData.products.filter(p => p._id !== id));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

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
    
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '12px',
        background: '#1f2937',
        color: '#fff',
        fontWeight: 'bold'
      },
      position: "top-center"
    });
    
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-gray-200 border-t-green-600 rounded-full"
        />
      </div>
    );
  }

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-20"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-4">
            <motion.div 
              layoutId={`img-${product._id}`}
              className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              {product.discountPercentage > 0 && (
                <span className="absolute top-6 left-6 bg-pink-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm uppercase">
                  -{product.discountPercentage}%
                </span>
              )}
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[product.singleImg, ...product.images].map((img, idx) => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    mainImage === img ? "border-green-600 scale-95 shadow-md" : "border-gray-100 opacity-70"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="gallery" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                  ({product.totalReviews} Reviews)
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-baseline gap-4 my-8"
            >
              <span className="text-4xl font-black text-indigo-900">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </motion.div>

            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 leading-relaxed mb-8 text-lg"
            >
              {product.description}
            </motion.p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {product.features.map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  key={i} className="flex items-center gap-2 text-gray-700 font-semibold text-sm"
                >
                  <IoCheckmarkCircle className="text-green-500" size={20} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {product.variants.length > 0 && (
              <div className="mb-10">
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, i) => (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      key={i} 
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${
                        selectedVariant?.unit === v.unit 
                        ? "border-green-600 bg-green-50 text-green-700 shadow-sm" 
                        : "border-gray-100 text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {v.unit} - ${v.price.toFixed(2)}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

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
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:bg-green-700 transition-all uppercase tracking-widest"
              >
                <IoCartOutline size={24} /> Add to Cart
              </motion.button>

              <div className="flex gap-2">
                <motion.button whileHover={{ y: -2 }} className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-all">
                  <IoHeartOutline size={24} />
                </motion.button>
                <motion.button whileHover={{ y: -2 }} className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all">
                  <IoSyncOutline size={24} />
                </motion.button>
              </div>
            </div>

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

        <div className="mt-24">
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Related Groceries</h2>
              <p className="text-gray-400 text-sm font-medium">Picked specifically for you</p>
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
              <p className="col-span-full text-center text-gray-400 py-10 font-medium">Searching for similar picks...</p>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default ProductDetails;