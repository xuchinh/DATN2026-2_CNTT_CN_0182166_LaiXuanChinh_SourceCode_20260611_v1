import type { PropsWithChildren } from "react";

import Footer from "./Footer";
import Header from "./Header";
import { handleUserLoginv2 } from "../users/requests/user.requests";

const MainLayout = async ({
  children,
  shouldShowFooter = true,
}: PropsWithChildren & { shouldShowFooter?: boolean }) => {
  const session = await handleUserLoginv2()
  return (
    <div className="flex flex-col min-h-screen">
      <Header session={session} />
      <div className="flex-1">
        <main>{children}</main>
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
