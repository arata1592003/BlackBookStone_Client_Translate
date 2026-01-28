import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TProps = ComponentProps<"div">;

export const Card = forwardRef<HTMLDivElement, TProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={twMerge(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, TProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={twMerge("flex flex-col space-y-1.5 p-6", className)}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"h3">
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      {...props}
      className={twMerge(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
    />
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      {...props}
      className={twMerge("text-sm text-muted-foreground", className)}
    />
  );
});
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, TProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} {...props} className={twMerge("p-6 pt-0", className)} />;
  }
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, TProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={twMerge("flex items-center p-6 pt-0", className)}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";