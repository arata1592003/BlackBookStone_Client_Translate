"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect, useState } from "react";

const NextProgressBar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ProgressBar
      height="4px"
      color="var(--secondary-accent)" // teal-600, matching your project's potential primary color
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

export default NextProgressBar;
