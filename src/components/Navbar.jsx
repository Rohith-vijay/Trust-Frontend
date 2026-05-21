import { NavLink, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";
import { Drawer, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  // Public nav links available to everyone
  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/donation", label: "Donate" },
    { path: "/events", label: "Events" },
    { path: "/vision", label: "Vision" },
    { path: "/history", label: "History" },
    { path: "/contact", label: "Contact" },
    { path: "/volunteer", label: "Volunteer" },
  ];

  // Extra transparency/media pages grouped in Explore dropdown
  const exploreLinks = [
    { path: "/reports", label: "Impact Reports" },
    { path: "/gallery", label: "Media Gallery" },
    { path: "/faq", label: "FAQ" },
    { path: "/transparency", label: "Financial Transparency" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if any explore link is active to highlight parent Explore tab
  const isExploreActive = exploreLinks.some((link) => location.pathname === link.path);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-2"
            : "bg-warmBg/85 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <motion.img
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              src="/logo.png"
              alt="K.V.G Shanmuka Sai Charitable Trust logo"
              className="w-10 h-10 rounded-full shadow-md"
            />
            <span className="text-2xl font-bold text-primary tracking-tight group-hover:text-amber-700 transition-colors">
              KVG Trust
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 text-base font-medium">
            {publicLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-full transition-all duration-300 group ` +
                  (isActive
                    ? "text-primary bg-primary/5"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-full z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Dropdown explore link */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 hover:bg-gray-50 hover:text-primary ${
                  isExploreActive
                    ? "text-primary bg-primary/5"
                    : "text-gray-700"
                }`}
              >
                <span className="relative z-10">Explore</span>
                <KeyboardArrowDownIcon
                  className={`transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  sx={{ fontSize: "1.1rem" }}
                />
                {isExploreActive && !isDropdownOpen && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute right-0 top-full mt-1 w-60 bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden z-50 py-2"
                  >
                    {exploreLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `block px-5 py-3 text-sm font-semibold transition-all duration-200 ` +
                          (isActive
                            ? "text-primary bg-primary/5"
                            : "text-gray-600 hover:text-primary hover:bg-gray-50")
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth area */}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  disableElevation
                  startIcon={<LoginIcon />}
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    fontSize: "1rem"
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile: Auth + Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                disableElevation
                size="small"
                sx={{ borderRadius: "50px", textTransform: "none", fontWeight: 600 }}
              >
                Login
              </Button>
            )}
            <IconButton
              color="inherit"
              onClick={() => setIsOpen(true)}
              aria-label="Toggle navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer via MUI */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 280, p: 3, display: "flex", flexDirection: "column" },
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-bold text-primary">Menu</span>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex flex-col space-y-1 overflow-y-auto">
          {publicLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl transition-all font-medium text-base ` +
                (isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary")
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Section Divider for Explore links */}
          <div className="border-t border-gray-100 my-2 pt-2">
            <span className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Transparency & Media
            </span>
          </div>

          {exploreLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl transition-all font-medium text-base ` +
                (isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary")
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl transition-all font-medium text-base mt-4 ` +
                (isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary")
              }
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
