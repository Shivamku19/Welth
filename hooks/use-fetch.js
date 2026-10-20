import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);

      if (response && response.success === false) {
        const errorMsg = response.error || "An error occurred";
        setError(new Error(errorMsg));
        toast.error(errorMsg);
        setData(response);
        return response;
      }

      setData(response);
      setError(null);
      return response;
    } catch (error) {
      let message = error?.message || "An unexpected error occurred";
      if (
        message.includes("Minified React error #441") ||
        message.includes("react.dev/errors/441") ||
        message.includes("Server Components render") ||
        message.includes("digest")
      ) {
        message = "Server request failed. Please check rate limits or try again later.";
      }
      setError(new Error(message));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
