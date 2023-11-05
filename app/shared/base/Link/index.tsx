import { Link as RemixLink } from "@remix-run/react";
import { type RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";

interface Props extends RemixLinkProps {}

const CLASSES = clsx(
  "rounded px-3 py-2 border border-solid",
  "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800",
  "border-green-600 text-white bg-green-600 outline-none",
  "hover:bg-green-500 hover:border-green-500",
  "focus:bg-green-500 focus:border-green-500"
);

export function Link({ className, ...props }: Props) {
  return <RemixLink {...props} className={clsx(CLASSES, className)} />;
}
