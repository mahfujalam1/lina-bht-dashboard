import { useState, useEffect } from "react";

const ErrorElement = () => {
  const [loading, setLoading] = useState(true);

  // Simulating some loading process for demonstration.
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate 3 seconds of loading before displaying content
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {loading ? (
        <div className="loader"></div> // Add your loader component here
      ) : (
        <div>Content Loaded</div> // You can replace this with your actual content after loading.
      )}
    </div>
  );
};

export default ErrorElement;
