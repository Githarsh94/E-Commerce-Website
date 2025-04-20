import { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loader-container">
      <video autoPlay muted loop className="loader-video">
        <source src="/LoaderVideo.mp4" type="video/mp4" />
      </video>
      <div className="loader-overlay">
        <h1>Loading... {progress}%</h1>
      </div>
    </div>
  );
};

export default Loader;
