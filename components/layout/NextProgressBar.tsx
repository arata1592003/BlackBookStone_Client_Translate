"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NextProgressBar = () => {
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
