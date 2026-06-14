import Link from "next/link";
import React from "react";

type FooterLinkProps = {
  href: string;
  label: string;
  className?: string;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, label, className }) => {
  return (
    <Link
      href={href}
      className={`text-white hover:text-[#EEB537] font-sans font-normal transition-all duration-500 ${className || ""}`}
    >
      {label}
    </Link>
  );
};

export default FooterLink;
