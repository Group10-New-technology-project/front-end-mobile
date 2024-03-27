import { useState, useEffect } from "react";

// Custom hook
export function useCounter(initialValue, step) {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + step);
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  return count;
}
