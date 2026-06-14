import AdminContent from '@/components/layout/admin.content';
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import { AdminContextProvider } from '@/library/admin.context';
import '@/app/globals.css';
// import AdminSideBar from '@/components/layout/sidebar/admin.sidebar.client';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { handleUserLoginv2 } from '@/components/users/requests/user.requests';
const AdminLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await handleUserLoginv2()
    // console.log('>>> check session', session);

    return (
        <AdminContextProvider>
            <div className='flex'>
                <div className='left-side min-w-[80px]'>
                    <AdminSideBar />
                </div>
                <div className='right-side flex-1'>
                    <AdminHeader session={session} />
                    <AdminContent>
                        {children}
                    </AdminContent>
                    <AdminFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default AdminLayout