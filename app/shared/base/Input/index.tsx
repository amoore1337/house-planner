import clsx from "clsx";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { forwardRef } from "react";

export interface Props extends ComponentPropsWithRef<"input"> {
  label?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

// const CLASSES = [
//   "relative text-sm leading-[1.4] rounded border border-solid border-green-500",
//   "py-2 px-3 focus-within:outline focus-within:outline-green-300 placeholder:text-green-600 placeholder:italic",
// ];

const CLASSES = clsx(
  "group rounded border-2 border-solid border-green-600 bg-slate-50 outline-none flex w-[200px]",
  "hover:bg-white hover:border-green-500",
  "focus-within:bg-white focus-within:border-green-500",
  "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-800"
);

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className = "",
    label,
    startAdornment,
    endAdornment,
    ...rest
  } = props;

  const input = (
    <div className={clsx(CLASSES, { [className]: !label })}>
      {startAdornment && (
        <AdornmentContainer className="">{startAdornment}</AdornmentContainer>
      )}
      <input
        className={clsx(
          "w-full flex-1 bg-transparent px-3 py-2 text-slate-900 outline-none"
        )}
        data-input
        ref={ref}
        {...rest}
      />
      {endAdornment && (
        <AdornmentContainer className="">{endAdornment}</AdornmentContainer>
      )}
    </div>
  );

  if (label) {
    return (
      <div className={clsx("inline-flex flex-col", className)}>
        <label className="pb-1 text-sm text-white">{label}</label>
        {input}
      </div>
    );
  }

  return input;
});

const containedAdornmentClasses = clsx(
  "min-w-[40px] h-[40px] text-white flex items-center justify-center px-3",
  "bg-green-600 group-focus-within:bg-green-500 group-hover:bg-green-500"
);

function AdornmentContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        { [containedAdornmentClasses]: typeof children === "string" },
        className
      )}
    >
      {children}
    </div>
  );
}

Input.displayName = "Input";
