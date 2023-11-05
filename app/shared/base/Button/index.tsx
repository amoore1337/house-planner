import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";

type VariantType = "primary" | "secondary" | "outlined";

interface Props extends ComponentPropsWithRef<"button"> {
  variant?: VariantType;
}

const SHARED_CLASSES = clsx(
  "rounded px-3 py-2 border border-solid",
  "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
);

const CLASS_MAP: Record<VariantType, string> = {
  primary: clsx(
    "border-green-600 text-white bg-green-600 outline-none",
    "hover:bg-green-500 hover:border-green-500",
    "focus:bg-green-500 focus:border-green-500"
  ),
  secondary: "border-sky-600 text-sky-600 bg-sky-100 hover:bg-sky-200",
  outlined: "border-gray-600 bg-white text-gray-600 hover:bg-gray-100",
};

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, variant = "outlined", ...rest } = props;
  return (
    <button
      className={clsx(SHARED_CLASSES, CLASS_MAP[variant], className)}
      data-button={variant}
      {...rest}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
