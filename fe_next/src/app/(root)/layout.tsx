import type { PropsWithChildren } from "react";
import React from "react";
import '@/app/globals.css';

import MainLayout from "@/components/main-layout/MainLayout";

const RootLayout = ({ children }: PropsWithChildren) => {
    return <MainLayout>{children}</MainLayout>;
};

export default RootLayout;
