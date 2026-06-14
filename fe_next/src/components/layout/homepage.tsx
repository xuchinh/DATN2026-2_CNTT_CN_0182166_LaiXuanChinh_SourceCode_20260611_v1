'use client'

import { CrownOutlined } from "@ant-design/icons"
import { Result } from "antd"
import { useSession } from "next-auth/react";


const HomePage = () => {
    const session = useSession()
    return (
        <>heloo</>
    )
}

export default HomePage;

