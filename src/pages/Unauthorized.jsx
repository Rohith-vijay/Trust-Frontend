import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="flex flex-col items-center justify-center h-[60vh] text-center px-6"
        >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">403</h1>
            <p className="text-xl text-gray-600 mb-2">Access Denied</p>
            <p className="text-gray-500 mb-8 max-w-md">
                You don't have permission to access this page. Please contact an administrator if you believe this is a mistake.
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:brightness-90 transition"
            >
                Go Back Home
            </button>
        </motion.div>
    );
}

export default Unauthorized;
