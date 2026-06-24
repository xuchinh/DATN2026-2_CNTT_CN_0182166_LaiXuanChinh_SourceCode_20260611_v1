'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center', background: '#F8FAFC', borderTop: '1px solid #e2e8f0', color: '#64748B' }}>
                RoomHub ©{new Date().getFullYear()} Created by Xuân Chính - laixuanchinh@gmail.com
            </Footer>
        </>
    )
}

export default AdminFooter;