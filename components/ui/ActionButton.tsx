import { ComponentProps, forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ActionButtonVariant = "default" | "primary" | "destructive" | "success" | "accent" | "info";

interface ActionButtonProps extends ComponentProps<"button"> {
  variant?: ActionButtonVariant;
  label: string;
  icon?: ReactNode;
}

const getVariantClasses = (variant: ActionButtonVariant) => {
  switch (variant) {
    case "primary":
      return "bg-blue-700 hover:bg-blue-600 border-[#cecece]";

    case "destructive":
      return "bg-red-700 hover:bg-red-600 border-[#cecece]";

    case "success":
      return "bg-emerald-600 hover:bg-emerald-500 border-[#cecece]";

    case "accent":
      return "bg-violet-600 hover:bg-violet-500 border-[#cecece]";

    case "info":
      return "bg-teal-500 hover:bg-teal-400 border-[#cecece]";

    case "default":
    default:
      return "bg-gray-700 hover:bg-gray-600 border-white";
  }
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { className, label, icon, variant = "default", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        {...props}
        className={twMerge(
          "flex items-center justify-center gap-2.5 px-1 py-[1px] w-full rounded-[10px] border shadow-[0px_4px_4px_#ffffff40] transition-colors",
          getVariantClasses(variant),
          className
        )}
      >
        {icon}

        <span className="font-bold text-white text-lg">
          {label}
        </span>
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";
