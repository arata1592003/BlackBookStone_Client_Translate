import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TProps = ComponentProps<"button">;

export const Button = forwardRef<HTMLButtonElement, TProps>(
  (
    { className, children, type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={twMerge(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "h-10 px-4 py-2",
          className
        )}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";