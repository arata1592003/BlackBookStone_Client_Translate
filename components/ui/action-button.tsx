import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps as ShadcnButtonProps } from "./button";

type ActionButtonVariant = "default" | "primary" | "destructive" | "success" | "accent" | "info";

interface ActionButtonProps extends Omit<ShadcnButtonProps, "variant"> { // Omit variant as we'll map it
  variant?: ActionButtonVariant;
  label: string;
  icon?: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { className, label, icon, variant = "default", ...props },
    ref
  ) => {
    let shadcnVariant: ShadcnButtonProps["variant"];
    let extraClasses = "flex items-center justify-center gap-2.5 px-1 py-[1px] w-full rounded-md border shadow-[0px_4px_4px_var(--color-shadow-white)] transition-colors"; // Common classes

    switch (variant) {
      case "primary":
        shadcnVariant = "default"; // Shadcn default uses bg-primary
        break;
      case "destructive":
        shadcnVariant = "destructive";
        break;
      case "success":
        shadcnVariant = "success-action"; // Custom variant in button.tsx
        break;
      case "accent":
        shadcnVariant = "accent-action"; // Custom variant in button.tsx
        break;
      case "info":
        shadcnVariant = "info-action"; // Custom variant in button.tsx
        break;
      case "default":
      default:
        shadcnVariant = "default-action"; // Custom variant in button.tsx
        break;
    }

    return (
      <Button
        ref={ref}
        variant={shadcnVariant}
        className={cn(
          extraClasses, // Apply common styles first
          className // Then any additional classes passed
        )}
        {...props}
      >
        {icon}
        <span className="font-bold text-lg">
          {label}
        </span>
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";
