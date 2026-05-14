import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";

function NotFound() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
      <p className="text-xl text-gray-600">
        The page you are looking for does not exist.
      </p>
    </motion.div>
  );
}

export default NotFound;
