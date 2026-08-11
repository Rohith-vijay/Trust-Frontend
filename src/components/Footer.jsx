import { NavLink } from "react-router-dom";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Column 1: Brand & Description */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-primary tracking-tight">
            K.V.G Shanmuka Sai Charitable Trust
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            Empowering underprivileged communities through education, healthcare, 
            clean water initiatives, and sustainable development programs.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider text-amber-500 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/events", label: "Upcoming Events" },
              { to: "/volunteer", label: "Join as Volunteer" },
              { to: "/contact", label: "Contact Us" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group block w-fit"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Transparency & Media */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider text-amber-500 mb-4">
            Transparency & Media
          </h3>
          <ul className="space-y-2.5">
            {[
              { to: "/reports", label: "Impact Reports" },
              { to: "/gallery", label: "Media Gallery" },
              { to: "/impact-showcase", label: "✦ Impact Showcase" },
              { to: "/transparency", label: "Financial Transparency" },
              { to: "/faq", label: "FAQ / Support" },
              { to: "/donation", label: "Donate Securely" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group block w-fit"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-base font-semibold uppercase tracking-wider text-amber-500 mb-4">
            Get In Touch
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <span className="block font-medium text-white mb-0.5">Email</span>
              <a href="mailto:kvgshanmukhsaitrust@gmail.com" className="hover:text-primary transition-colors break-all">
                kvgshanmukhsaitrust@gmail.com
              </a>
            </li>
            <li>
              <span className="block font-medium text-white mb-0.5">Phone</span>
              <span className="leading-relaxed block">
                8919493436, 9121603777, 9390564417
              </span>
            </li>
            <li>
              <span className="block font-medium text-white mb-0.5">Office</span>
              <span className="leading-relaxed">
                49a, Harischandrapuram, Thullur mandal, Guntur district, Andhra pradesh, India
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-xs text-gray-500 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <NavLink to="/privacy-policy" className="hover:text-white transition-colors duration-200">
            Privacy Policy
          </NavLink>
          <span className="text-gray-700">•</span>
          <NavLink to="/terms-and-conditions" className="hover:text-white transition-colors duration-200">
            Terms & Conditions
          </NavLink>
          <span className="text-gray-700">•</span>
          <NavLink to="/refund-policy" className="hover:text-white transition-colors duration-200">
            Donation & Refund Policy
          </NavLink>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div>
            © {new Date().getFullYear()} K.V.G Shanmuka Sai Charitable Trust. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Developed by <span className="font-semibold text-gray-400">Komma Rohith Vijay</span> (9390564417)</span>
            <a
              href="https://www.linkedin.com/in/rohithvijayk/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary text-gray-500 transition-colors inline-flex items-center"
              title="LinkedIn Profile"
            >
              <LinkedInIcon sx={{ fontSize: 18 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
