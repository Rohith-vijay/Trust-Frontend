import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">K.V.G Shanmuka Sai Charitable Trust</h2>
          <p className="text-gray-400">
            Empowering communities through education, clean water,
            and sustainable development programs.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/donation", label: "Donate" },
              { to: "/events", label: "Events" },
              { to: "/contact", label: "Contact" },
              { to: "/volunteer", label: "Volunteer" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-gray-400 hover:text-white transition-opacity duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">Email: support@trust.org</p>
          <p className="text-gray-400">Phone: +91 98765 43210</p>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-gray-500">
        © {new Date().getFullYear()} K.V.G Shanmuka Sai Charitable Trust. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
