'use client'

import { Layout } from "antd";

const AdminContent = ({ children }: Readonly<{ children: React.ReactNode; }>) => {

    const { Content } = Layout;

    return (
        <Content style={{ background: "#F8FAFC" }}>
            <div className="p-4 sm:p-6 min-h-[calc(100vh-180px)]">
                {children}
            </div>
        </Content>

    )
}

export default AdminContent;