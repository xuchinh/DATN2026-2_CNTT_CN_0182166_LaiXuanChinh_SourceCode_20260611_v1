'use client'
import { AdminContext } from '@/library/admin.context';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { signOut } from 'next-auth/react';
import ModalChangePassword from '../auth/modal.change.password';
import UserSelect from '../users/table/user.select';
import { handleUserLogin } from '../users/requests/user.requests';
import UserUpdate from '../users/table/user.update';
import { handlePackageUser } from '../packages/requests/package.requests';
import PackageSelect from '../packages/table/package.select';

const AdminHeader = (props: any) => {
    const { session } = props;
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const [changePassword, setChangePassword] = useState(false);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
    const [dataSelect, setDataSelect] = useState<any>(session?.user ?? null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const [isSelectModalPackageOpen, setIsSelectModalPackageOpen] = useState<boolean>(false);
    const [dataPackageSelect, setDataPackageSelect] = useState<any>(null);

    const handleUserInfoClick = async () => {
        try {
            const user = session?.data?.results?.[0]
            if (user) {
                setDataSelect(user)
                setIsSelectModalOpen(true)
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error)
        }
    }
    const handlePackageInfoClick = async () => {
        try {
            const resPackage = await handlePackageUser();
            const dataPackages = resPackage?.data?.results?.[0];
            if (dataPackages) {
                setDataPackageSelect(dataPackages);
                setIsSelectModalPackageOpen(true);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin gói:', error);
        }
    };
    useEffect(() => {
        const fetchUserPackage = async () => {
            try {
                const resPackage = await handlePackageUser();
                const dataPackages = resPackage?.data?.results?.[0];
                if (dataPackages) {
                    setDataPackageSelect(dataPackages);
                }
            } catch (error) {
                console.error("Lỗi khi lấy gói người dùng:", error);
            }
        };

        fetchUserPackage();
    }, []);
    // console.log("..chekc dataPackageSelect", dataPackageSelect);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label:
                <span onClick={handleUserInfoClick}>
                    Thông tin cá nhân
                </span>
        },
        {
            key: '2',
            label: (
                <span onClick={async () => {
                    try {
                        const res = await handleUserLogin()
                        const user = res?.data?.results?.[0]
                        if (user) {
                            setDataUpdate(user)
                            setIsUpdateModalOpen(true)
                        }
                    } catch (err) {
                        console.error('Lỗi khi lấy thông tin người dùng:', err)
                    }
                }}>
                    Sửa thông tin cá nhân
                </span>
            )
        },
        {
            key: '3',
            label:
                <span onClick={() => setChangePassword(true)}>
                    Đổi mật khẩu
                </span>
            ,
        },
        {
            key: '4',
            danger: true,
            label: <span onClick={() => signOut()}> Đăng xuất</span >,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: 0,
                    display: "flex",
                    background: "#f5f5f5",
                    justifyContent: "space-between",
                    alignItems: "center"
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <div className="flex items-center gap-4 pr-5">
                    {(dataPackageSelect?._id && session?.data?.results?.[0].status === true) && (
                        <div
                            onClick={handlePackageInfoClick}
                            className="inline-block bg-emerald-100 text-emerald-700 font-medium px-4 py-2 rounded-full text-sm leading-none cursor-pointer hover:bg-emerald-200 transition"
                        >
                            {dataPackageSelect.name}
                        </div>
                    )}
                    <Dropdown menu={{ items }}>
                        <a
                            onClick={(e) => e.preventDefault()}
                            className="cursor-pointer text-black"
                        >
                            <Space>
                                Welcome {session?.data?.results?.[0].name ?? ""}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </Header>
            <ModalChangePassword
                email={session?.data?.results?.[0].email}
                title="Đổi mật khẩu"
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
                repline="Tải khoản của bạn đã được thay đổi mật khẩu thành công."
            />
            <UserSelect
                isSelectModalOpen={isSelectModalOpen}
                setIsSelectModalOpen={setIsSelectModalOpen}
                dataSelect={dataSelect}
            // setDataSelect={setDataSelect}
            />
            <UserUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <PackageSelect
                dataDetail={dataPackageSelect}
                isDetailModalOpen={isSelectModalPackageOpen}
                // setDataDetail={setDataPackageSelect}
                setIsDetailModalOpen={setIsSelectModalPackageOpen}
            />
        </>
    )
}

export default AdminHeader;