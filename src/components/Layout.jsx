import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import ScrollToTop from "./ScrollToTop";
import GlobalLoader from "./GlobalLoader";
import ScrollProgress from "./ScrollProgress";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Layout({ children }) {
  const location = useLocation();

  const { globalLoading } = useContext(AppContext);

  // simple fade/scale variants defined in constants
  const variants = pageVariants;

  // background per page tone
  let bgClass = "bg-neutralLight";
  switch (location.pathname) {
    case "/":
      bgClass = "bg-gradient-to-b from-primary via-transparentWhite to-warmBg";
      break;
    case "/about":
      bgClass = "bg-warmBg";
      break;
    case "/vision":
      bgClass = "bg-warmBg";
      break;
    case "/donation":
      bgClass = "bg-gradient-to-b from-primary to-accent";
      break;
    case "/events":
      bgClass = "bg-neutralLight";
      break;
    case "/history":
      bgClass = "bg-warmBg";
      break;
    case "/contact":
      bgClass = "bg-[rgba(30,58,95,0.05)]";
      break;
    case "/login":
    case "/signup":
      bgClass = "bg-gradient-to-br from-warmBg via-white to-warmBg";
      break;
    case "/admin":
    case "/dashboard":
    case "/dashboard/volunteer":
      bgClass = "bg-neutralLight";
      break;
    case "/unauthorized":
      bgClass = "bg-warmBg";
      break;
    default:
      bgClass = "bg-neutralLight";
  }

  return (
    <div className={`relative min-h-screen flex flex-col ${bgClass}`}>
      <ScrollProgress />
      {globalLoading && <GlobalLoader />}
      <Navbar />
      <ScrollToTop />


      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={pageTransition}
          className="flex-grow w-full mx-auto py-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default Layout;
