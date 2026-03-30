"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[#111111] bg-[#111111] text-white hover:bg-[#2a2a2a] hover:border-[#2a2a2a]",
        outline:
          "border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white",
        ghost: "border-transparent bg-transparent text-[#111111] hover:bg-black/5",
        dark: "border-[#111111] bg-[#111111] text-white hover:bg-[#2a2a2a]",
        danger: "border-red-600 bg-red-600 text-white hover:bg-red-500 hover:border-red-500",
        success:
          "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500 hover:border-emerald-500",
      },
      size: {
        sm: "min-h-[40px] px-4 text-[10px] font-semibold tracking-[0.18em]",
        md: "min-h-[48px] px-6 text-[11px] font-semibold tracking-[0.18em]",
        lg: "min-h-[54px] px-8 text-[11px] font-semibold tracking-[0.18em]",
        xl: "min-h-[58px] px-10 text-xs font-semibold tracking-[0.18em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
