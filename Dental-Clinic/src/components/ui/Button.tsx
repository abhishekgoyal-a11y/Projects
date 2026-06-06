import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "emergency" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white shadow-cta hover:bg-accent-600 active:scale-[0.98]",
  secondary:
    "border-2 border-primary-500 bg-transparent text-primary-700 hover:bg-primary-100",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-100/80",
  emergency: "bg-error-600 text-white hover:bg-error-600/90",
  dark: "bg-white text-primary-900 hover:bg-neutral-100",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-5 text-sm",
  md: "min-h-12 px-7 text-[15px]",
  lg: "min-h-14 px-9 text-base",
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = SharedProps & {
  href: string;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

function getClasses(variant: Variant, size: Size, className: string) {
  return `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button(props: ButtonAsLink): ReactNode;
export function Button(props: ButtonAsButton): ReactNode;
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonAsLink | ButtonAsButton) {
  const classes = getClasses(variant, size, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
