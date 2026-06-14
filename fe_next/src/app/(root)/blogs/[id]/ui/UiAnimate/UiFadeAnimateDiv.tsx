"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type UiFadeAnimateDivProps = {
  className?: string;
  id?: string;
  children: ReactNode;
};

const UiFadeAnimateDiv = ({ ...htmlProps }: UiFadeAnimateDivProps) => {
  return (
    <motion.div
      transition={{ duration: 1 }}
      {...htmlProps}
      initial={{ opacity: 0 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    />
  );
};
export default UiFadeAnimateDiv;
