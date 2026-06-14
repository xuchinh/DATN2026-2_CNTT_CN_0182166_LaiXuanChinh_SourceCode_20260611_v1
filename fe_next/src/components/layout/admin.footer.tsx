'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                RoomHub ©{new Date().getFullYear()} Created by Xuân Chinh - laixuanchinh@gmail.com
            </Footer>
        </>
    )
}

export default AdminFooter;