import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TProps = ComponentProps<"label">;

export const Label = forwardRef<HTMLLabelElement, TProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        {...props}
        className={twMerge(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
      />
    );
  }
);
Label.displayName = "Label";