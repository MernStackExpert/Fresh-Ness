import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // useNavigate ইমপোর্ট করা হয়েছে
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearchOutline, IoPersonOutline, IoHeartOutline,
  IoCartOutline, IoSyncOutline, IoMenuOutline,
  IoCallOutline, IoChevronDownOutline, IoCloseOutline
} from "react-icons/io5";
import { RiPercentLine } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // সার্চ স্টেট
  const navigate = useNavigate(); // নেভিগেট করার জন্য

  // সার্চ হ্যান্ডলার ফাংশন
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // ইউজারকে All Groceries পেজে পাঠানো হচ্ছে এবং কুয়েরি প্যারামিটারে সার্চ টেক্সট দেওয়া হচ্ছে
      navigate(`/all-grocerice?search=${searchTerm}`);
      setSearchTerm(""); // সার্চ শেষে ইনপুট খালি করা
      setIsMenuOpen(false); // মোবাইল মেনু বন্ধ করা
    }
  };

  const navLinks = [
    { name: "Home", path: "/", dropdown: null },
    { name: "All Groceries", path: "/all-grocerice", dropdown: null },
    {
      name: "Pages",
      path: null,
      dropdown: [
        { name: "About Us", path: "/about" },
        { name: "FAQ", path: "/faq" },
        { name: "Terms & Conditions", path: "/terms" }
      ]
    },
    {
      name: "Shop",
      path: null,
      dropdown: [
        { name: "Shop Grid", path: "/shop-grid" },
        { name: "Product Details", path: "/product-details" }
      ]
    },
    {
      name: "Vendor",
      path: null,
      dropdown: [
        { name: "Vendor List", path: "/vendor-list" },
        { name: "Vendor Store", path: "/vendor-store" }
      ]
    },
    {
        name: "Elements",
        path: null,
        dropdown: [
          { name: "Buttons", path: "/buttons" },
          { name: "Banners", path: "/banners" }
        ]
      },
      {
        name: "Blog",
        path: null,
        dropdown: [
          { name: "Blog Grid", path: "/blog-grid" },
          { name: "Blog Detail", path: "/blog-detail" }
        ]
      },
    { name: "Contact", path: "/contact", dropdown: null },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      {/* --- Main Header --- */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

        <motion.button 
          whileTap={{ scale: 0.9 }} 
          className="lg:hidden text-gray-800 cursor-pointer" 
          onClick={() => setIsMenuOpen(true)}
        >
          <IoMenuOutline size={30} />
        </motion.button>

        <Link to="/" className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-800 italic shrink-0" style={{ fontFamily: 'cursive' }}>
          FreshNess
        </Link>

        {/* Search Bar (Desktop) - Form ব্যবহার করা হয়েছে যাতে Enter চাপলে সার্চ হয় */}
        <form 
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-xl items-center border-2 border-gray-100 rounded-full focus-within:border-amber-400 transition-all ml-4 overflow-hidden"
        >
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="flex-1 px-5 py-2 outline-none text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-amber-400 p-3 px-6 hover:bg-amber-500 transition-colors">
            <IoSearchOutline size={22} />
          </button>
        </form>

        {/* Action Icons */} 
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
            <IoPersonOutline size={22} />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer"><IoSyncOutline size={26} /><span className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">0</span></div>
            <div className="relative cursor-pointer"><IoHeartOutline size={26} /><span className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">0</span></div>
            <div className="relative cursor-pointer"><IoCartOutline size={26} /><span className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">0</span></div>
          </div>
        </div>
      </div>

      {/* --- Desktop Bottom Navigation --- */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center gap-8 font-semibold text-gray-700">
            {navLinks.map((link, idx) => (
              <li key={idx} className="relative group py-5">
                {link.path ? (
                  <Link to={link.path} className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer">
                    {link.name}
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer">
                    {link.name} {link.dropdown && <IoChevronDownOutline className="text-sm group-hover:rotate-180 transition-transform duration-300" />}
                  </span>
                )}
                {link.dropdown && (
                  <div className="absolute top-full left-0 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-50 p-2">
                    {link.dropdown.map((sub, sIdx) => (
                      <motion.div key={sIdx} whileHover={{ x: 5 }}>
                        <Link to={sub.path} className="block py-2 px-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md ">
                          {sub.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex items-center gap-2 text-gray-800 font-bold">
              <RiPercentLine className="text-green-600" size={20} />
              <span>Weekly Discount!</span>
            </motion.div>
            <div className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-3 relative">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-indigo-600 rotate-45"></div>
                <IoCallOutline size={22} />
                <div className="leading-tight">
                   <p className="text-[10px] opacity-80 uppercase font-medium">Hotline</p>
                   <p className="font-bold">+9888-256-666</p>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 z-[200] lg:hidden" />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 h-screen bg-white z-[210] shadow-2xl lg:hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Header */}
              <div className="p-5 flex items-center justify-between bg-indigo-800 text-white font-bold shrink-0">
                <span className="text-xl italic">FreshNess</span>
                <button onClick={() => setIsMenuOpen(false)}><IoCloseOutline size={30} /></button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {/* Mobile Search Form */}
                <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-amber-400 px-3"><IoSearchOutline /></button>
                </form>

                <ul className="space-y-1 mb-10">
                  {navLinks.map((link, idx) => (
                    <li key={idx} className="border-b border-gray-50 pb-2">
                      <div
                        className="flex items-center justify-between py-3 text-gray-800 font-semibold cursor-pointer"
                        onClick={() => link.dropdown ? setActiveDropdown(activeDropdown === idx ? null : idx) : (setIsMenuOpen(false))}
                      >
                        {link.path ? <Link to={link.path} className="w-full">{link.name}</Link> : <span>{link.name}</span>}
                        {link.dropdown && <IoChevronDownOutline className={`transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180' : ''}`} />}
                      </div>

                      <AnimatePresence>
                        {link.dropdown && activeDropdown === idx && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-gray-50 rounded-lg">
                            {link.dropdown.map((sub, sIdx) => (
                              <Link key={sIdx} to={sub.path} onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-sm text-gray-600 hover:text-green-600 border-l-2 border-transparent hover:border-green-600 transition-all font-semibold">
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar Bottom */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-4">
                 <div className="flex items-center gap-3 text-gray-800 font-bold px-2">
                    <RiPercentLine className="text-green-600" size={24} />
                    <span>Weekly Discount!</span>
                 </div>

                 <div className="bg-indigo-600 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-indigo-100">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <IoCallOutline size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider">Hotline Number</p>
                      <p className="font-bold text-lg">+9888-256-666</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;