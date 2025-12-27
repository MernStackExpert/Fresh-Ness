import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // প্যাকেজটি অবশ্যই ইনস্টল থাকতে হবে: npm install framer-motion
import { 
  IoSearchOutline, IoPersonOutline, IoHeartOutline, 
  IoCartOutline, IoSyncOutline, IoMenuOutline, 
  IoCallOutline, IoChevronDownOutline, IoCloseOutline 
} from "react-icons/io5";
import { RiPercentLine } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navLinks = [
    { name: "Home", dropdown: ["Fresh Fruits", "Fresh Vegetables", "Organic Food"] },
    { name: "Pages", dropdown: ["About Us", "Contact Us", "FAQ", "Terms & Conditions"] },
    { name: "Shop", dropdown: ["Shop Grid", "Shop Left Sidebar", "Product Details"] },
    { name: "Vendor", dropdown: ["Vendor List", "Vendor Store"] },
    { name: "Elements", dropdown: ["Buttons", "Banners", "Grid System"] },
    { name: "Blog", dropdown: ["Blog Grid", "Blog Detail"] },
    { name: "Contact", dropdown: null },
  ];

  const categories = ["Vegetables", "Fruits", "Dairy & Eggs", "Beverages", "Snacks"];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      {/* --- Main Header --- */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Mobile Menu Icon (Left) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="lg:hidden text-gray-800 p-2" 
          onClick={() => setIsMenuOpen(true)}
        >
          <IoMenuOutline size={30} />
        </motion.button>

        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-800 italic shrink-0" 
          style={{ fontFamily: 'cursive' }}
        >
          FreshNess
        </motion.div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-xl items-center border-2 border-gray-100 rounded-full focus-within:border-amber-400 transition-all ml-4">
          <div className="relative group/cat shrink-0">
            <button className="px-5 py-2 flex items-center gap-2 text-gray-700 font-medium border-r border-gray-100">
              Categories <IoChevronDownOutline />
            </button>
            {/* Category Dropdown Animation */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-lg py-2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible group-hover/cat:translate-y-0 translate-y-2 transition-all duration-300 z-50">
              {categories.map((cat) => (
                <a key={cat} href="#" className="block px-4 py-2 hover:bg-green-50 hover:text-green-600 text-gray-700">{cat}</a>
              ))}
            </div>
          </div>
          <input type="text" placeholder="Search for products..." className="flex-1 px-4 py-2 outline-none text-gray-600" />
          <button className="bg-amber-400 p-3 h-full rounded-r-full hover:bg-amber-500 transition-colors">
            <IoSearchOutline size={22} />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
            <IoPersonOutline size={22} />
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {[ 
              { icon: <IoSyncOutline size={24} />, count: 0, hideOnMobile: true },
              { icon: <IoHeartOutline size={24} />, count: 0, hideOnMobile: false },
              { icon: <IoCartOutline size={24} />, count: 0, hideOnMobile: false }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -3 }}
                className={`relative cursor-pointer hover:text-green-600 transition-colors ${item.hideOnMobile ? 'hidden md:block' : 'block'}`}
              >
                {item.icon}
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-amber-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white"
                >
                  {item.count}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Desktop Bottom Nav --- */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center gap-8 font-semibold text-gray-700">
            {navLinks.map((link, idx) => (
              <li key={idx} className="relative group py-4">
                <div className="flex items-center gap-1 cursor-pointer group-hover:text-green-600 transition-colors">
                  {link.name} {link.dropdown && <IoChevronDownOutline className="text-sm group-hover:rotate-180 transition-transform duration-300" />}
                </div>
                {link.dropdown && (
                  <div className="absolute top-full left-0 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-50 p-2">
                    {link.dropdown.map((sub, sIdx) => (
                      <motion.a 
                        whileHover={{ x: 5 }}
                        key={sIdx} href="#" className="block py-2 px-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md"
                      >
                        {sub}
                      </motion.a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2 text-gray-800 font-bold"
            >
              <RiPercentLine className="text-green-600" size={20} />
              <span>Weekly Discount!</span>
            </motion.div>
            <div className="relative bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-3">
               <div className="absolute -top-2 left-4 w-4 h-4 bg-indigo-600 rotate-45"></div>
               <IoCallOutline size={22} />
               <div className="leading-tight">
                  <p className="text-[10px] opacity-80 uppercase">Hotline</p>
                  <p className="font-bold">+9888-256-666</p>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar Animation --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[200] lg:hidden"
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-full bg-white z-[210] shadow-2xl lg:hidden overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-indigo-800 text-white">
                <span className="text-xl font-bold italic">FreshNess</span>
                <button onClick={() => setIsMenuOpen(false)}><IoCloseOutline size={28} /></button>
              </div>

              <div className="overflow-y-auto h-[calc(100%-80px)] p-4">
                <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <input type="text" placeholder="Search..." className="flex-1 px-3 py-2 outline-none text-sm" />
                  <button className="bg-amber-400 px-3"><IoSearchOutline /></button>
                </div>

                <ul className="space-y-2">
                  {navLinks.map((link, idx) => (
                    <li key={idx} className="border-b border-gray-50 last:border-0 pb-2">
                      <div 
                        className="flex items-center justify-between py-2 text-gray-800 font-semibold cursor-pointer"
                        onClick={() => toggleDropdown(idx)}
                      >
                        {link.name}
                        {link.dropdown && (
                          <IoChevronDownOutline className={`transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                      
                      {/* Mobile Accordion Animation */}
                      <AnimatePresence>
                        {link.dropdown && activeDropdown === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-2 py-2 bg-gray-50 rounded-lg">
                              {link.dropdown.map((sub, sIdx) => (
                                <a key={sIdx} href="#" className="block text-sm text-gray-600 py-1 hover:text-green-600">{sub}</a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-4">
                   <div className="flex items-center gap-2 text-gray-800 font-bold">
                      <RiPercentLine className="text-green-600" size={20} />
                      <span>Weekly Discount!</span>
                   </div>
                   <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-indigo-600 text-white p-4 rounded-xl flex items-center gap-4"
                   >
                      <IoCallOutline size={24} />
                      <div>
                        <p className="text-xs opacity-70">Hotline Number</p>
                        <p className="font-bold">+9888-256-666</p>
                      </div>
                   </motion.div>
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