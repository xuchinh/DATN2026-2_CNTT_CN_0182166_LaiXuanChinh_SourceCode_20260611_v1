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
const ActionButtonHeader: FC<ActionButton> = ({
  href,
  className,
  children,
}) => {
  const defaultClasses =
    "border-[1.3px] border-white rounded-[40px] text-white font-inter text-[16px] font-[500]";

  return (
    <Link href={href} className={clsx(defaultClasses, className)}>
      {children}
    </Link>
  );
};

export default ActionButtonHeader;
