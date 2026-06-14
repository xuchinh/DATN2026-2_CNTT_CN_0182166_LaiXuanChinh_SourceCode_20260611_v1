import clsx from "clsx";
import Link from "next/link";
import type { FC } from "react";
import React from "react";
// action button type
type ActionButton = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

const ActionButton: FC<ActionButton> = ({ href, className, children }) => {
  const defaultClasses =
    "border-[1.3px] rounded-[40px] text-white font-inter font-medium transition-all duration-500 drop-shadow-custom bg-primary border-primary";

  return (
    <Link href={href} className={clsx(defaultClasses, className)}>
      {children}
    </Link>
  );
};

export default ActionButton;
