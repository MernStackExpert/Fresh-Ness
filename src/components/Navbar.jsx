import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoCartOutline,
  IoMenuOutline,
  IoCallOutline,
  IoChevronDownOutline,
  IoCloseOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoAddCircleSharp,
  IoPause,
} from "react-icons/io5";
import { RiPercentLine } from "react-icons/ri";
import { AuthContext } from "../Provider/AuthContext";

const getCartCountFromStorage = () => {
  if (typeof window === "undefined") return 0;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [cartCount, setCartCount] = useState(() => getCartCountFromStorage());

  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setCartCount(getCartCountFromStorage());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-grocerice?search=${searchTerm}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/", dropdown: null },
    { name: "All Groceries", path: "/all-grocerice", dropdown: null },
    {
      name: "Category",
      path: null,
      dropdown: [
        { name: "All Grocerice", path: "/all-grocerice" },
        { name: "Vegetables", path: "/all-grocerice?category=Vegetables" },
        { name: "Fruits", path: "/all-grocerice?category=Fruits" },
        { name: "Dairy", path: "/all-grocerice?category=Dairy" },
        { name: "Beverages", path: "/all-grocerice?category=Beverages" },
      ],
    },
    { name: "About", path: "/about", dropdown: null },
    { name: "Services", path: "/services", dropdown: null },
    { name: "Contact", path: "/contact", dropdown: null },
    // { name: "Dashboard", path: "/dashboard", dropdown: null },
  ];

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-[100] shadow-sm"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-gray-800 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <IoMenuOutline size={30} />
          </motion.button>

          <Link
            to="/"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-800 italic shrink-0"
            style={{ fontFamily: "cursive" }}
          >
            FreshNess
          </Link>

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
            <button
              type="submit"
              className="bg-amber-400 p-3 px-6 hover:bg-amber-500 transition-colors"
            >
              <IoSearchOutline size={22} />
            </button>
          </form>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              {/* Profile / Login logic starts here */}
              <div className="relative">
                {user ? (
                  <>
                    <div
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer overflow-hidden active:scale-95 transition-all"
                    >
                      <img
                        src={
                          user?.photoURL || "https://i.ibb.co/vBR74KV/user.png"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[110]"
                        >
                          <div className="px-4 py-2 border-b border-gray-50 mb-1">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {user?.displayName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>

                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                          >
                            <IoPersonOutline size={18} />
                            <span className="font-medium text-sm">
                              View Profile
                            </span>
                          </Link>

                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                          >
                            <IoSettingsOutline size={18} />

                            <span className="font-medium text-sm">
                              Dashboard
                            </span>
                          </Link>

                          <button
                            onClick={() => {
                              logOut();
                              setProfileDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-all"
                          >
                            <IoLogOutOutline size={18} />
                            <span className="font-medium text-sm">Log Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to="/login">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                      <IoPersonOutline size={22} />
                    </div>
                  </Link>
                )}

                {/* Backdrop to close dropdown */}
                {profileDropdown && (
                  <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setProfileDropdown(false)}
                  ></div>
                )}
              </div>
              {/* Profile / Login logic ends here */}

              <Link to="/current-work" className="relative cursor-pointer hover:text-red-600 transition-colors">
                <IoHeartOutline size={26} />
                <span className="absolute -top-2 -right-2 bg-red-400 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border text-white border-white">
                  0
                </span>
              </Link>
              <Link
                to="/cart"
                className="relative cursor-pointer hover:text-green-600 transition-colors"
              >
                <IoCartOutline size={26} />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <ul className="flex items-center gap-8 font-semibold text-gray-700">
              {navLinks.map((link, idx) => (
                <li key={idx} className="relative group py-5">
                  {link.path ? (
                    <Link
                      to={link.path}
                      className={`flex items-center gap-1 transition-colors ${
                        location.pathname === link.path
                          ? "text-green-600"
                          : "hover:text-green-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer">
                      {link.name}{" "}
                      {link.dropdown && (
                        <IoChevronDownOutline className="text-sm group-hover:rotate-180 transition-transform duration-300" />
                      )}
                    </span>
                  )}

                  {link.dropdown && (
                    <div className="absolute top-full left-0 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-50 p-2">
                      {link.dropdown.map((sub, sIdx) => (
                        <motion.div key={sIdx} whileHover={{ x: 5 }}>
                          <Link
                            to={sub.path}
                            className={`block py-2 px-3 text-sm rounded-md ${
                              location.pathname === sub.path
                                ? "text-green-600 bg-green-50"
                                : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
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
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 text-gray-800 font-bold"
              >
                <RiPercentLine className="text-green-600" size={20} />
                <span>Weekly Discount!</span>
              </motion.div>
              <div className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-3 relative">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-indigo-600 rotate-45"></div>
                <IoCallOutline size={22} />
                <div className="leading-tight">
                  <p className="text-[10px] opacity-80 uppercase font-medium">
                    Hotline
                  </p>
                  <p className="font-bold">+880 1908716502</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      <div className="h-20 lg:h-[145px]"></div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[200] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 w-80 h-screen bg-white z-[210] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between bg-indigo-800 text-white font-bold shrink-0">
                <span className="text-xl italic">FreshNess</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <IoCloseOutline size={30} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col">
                <form
                  onSubmit={handleSearch}
                  className="flex border border-gray-200 rounded-lg overflow-hidden mb-6 shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-amber-400 px-3">
                    <IoSearchOutline />
                  </button>
                </form>

                <ul className="space-y-1 mb-6">
                  {navLinks.map((link, idx) => (
                    <li key={idx} className="border-b border-gray-50 pb-2">
                      <div
                        className="flex items-center justify-between py-3 text-gray-800 font-semibold cursor-pointer"
                        onClick={() =>
                          link.dropdown
                            ? setActiveDropdown(
                                activeDropdown === idx ? null : idx
                              )
                            : setIsMenuOpen(false)
                        }
                      >
                        {link.path ? (
                          <Link
                            to={link.path}
                            className={`w-full ${
                              location.pathname === link.path
                                ? "text-green-600"
                                : ""
                            }`}
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <span>{link.name}</span>
                        )}
                        {link.dropdown && (
                          <IoChevronDownOutline
                            className={`transition-transform duration-300 ${
                              activeDropdown === idx ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>

                      <AnimatePresence>
                        {link.dropdown && activeDropdown === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-lg"
                          >
                            {link.dropdown.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-3 px-4 text-sm text-gray-600 hover:text-green-600 font-semibold"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-gray-100 space-y-5 pb-4">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-3 text-gray-800 font-bold"
                  >
                    <div className="bg-green-100 p-2 rounded-full">
                      <RiPercentLine className="text-green-600" size={20} />
                    </div>
                    <span>Weekly Discount!</span>
                  </motion.div>

                  <div className="bg-indigo-600 text-white px-5 py-4 rounded-xl flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute -top-2 left-4 w-4 h-4 bg-indigo-600 rotate-45"></div>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <IoCallOutline size={24} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] opacity-80 uppercase font-medium tracking-wider">
                        Hotline 24/7
                      </p>
                      <p className="font-bold text-lg">+880 1908716502</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
