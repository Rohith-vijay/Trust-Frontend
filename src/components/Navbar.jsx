import { NavLink, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import UserMenu from "./UserMenu";

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

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-white shadow" : "bg-warmBg bg-opacity-80"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="K.V.G Shanmuka Sai Charitable Trust logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-2xl font-bold text-primary">KVG Trust</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 text-lg">
          {publicLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative py-1 px-2 transition-colors duration-200 group ` +
                (isActive
                  ? "text-primary font-semibold"
                  : "text-dark hover:text-primary")
              }
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-200 ${location.pathname === link.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                  }`}
              />
            </NavLink>
          ))}

          {/* Auth area */}
          <div className="ml-4 pl-4 border-l border-gray-200">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-md hover:brightness-95 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile: Auth + Hamburger */}
        <div className="flex lg:hidden items-center space-x-3">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md hover:brightness-95 transition-all duration-200"
            >
              <span>Login</span>
            </Link>
          )}
          <button
            className="text-3xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-4 pb-4 text-lg font-medium">
          {publicLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative py-1 px-2 transition-colors duration-200 group ` +
                (isActive
                  ? "text-primary font-semibold"
                  : "text-dark hover:text-primary")
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-200 ${location.pathname === link.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                  }`}
              />
            </NavLink>
          ))}

          {/* Admin dashboard link in mobile menu */}
          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `relative py-1 px-2 transition-colors duration-200 group ` +
                (isActive
                  ? "text-primary font-semibold"
                  : "text-dark hover:text-primary")
              }
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
