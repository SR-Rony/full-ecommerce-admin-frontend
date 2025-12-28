import { useEffect, useState } from "react";

const useIntersectionObserver = (
  targets,
  customThreshold = [0],
  customRoot = null
) => {
  const [target, setTarget] = useState(false);

  useEffect(() => {
    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTarget(entry.target);
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: customRoot,
      rootMargin: "0px 0px 0px 0px",
      threshold: customThreshold
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    targets.current.forEach(target => observer.observe(target.current));

    return () => observer.disconnect();
  }, [targets, customThreshold, customRoot]);

  return { target };
};

export default useIntersectionObserver;
