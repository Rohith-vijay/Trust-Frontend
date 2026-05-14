import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useLoading = () => {
  const {
    loading,
    setLoading,
    globalLoading,
    setGlobalLoading,
  } = useContext(AppContext);
  return { loading, setLoading, globalLoading, setGlobalLoading };
};
