'use client';

import { Layout, Menu } from "antd";
import { AppstoreOutlined, MinusSquareOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/library/admin.context";
import { fetchFeatures } from "../faetures/requests/feature.requests";
import { IFeature } from "../faetures/types/feature.type";

import Image from "next/image";
import SVGBuilding from "../buildings/svgs/SVGBuilding";
import SVGElectricBill from "../electricity_bills/svgs/SVGElectricBill";
import SVGVehicles from "../vehicles/svgs/SVGVehicles";
import SVGPackage from "../packages/svgs/SVGPackage";
import SVGFeature from "../faetures/svgs/SVGFeature";
import SVGOffers from "../offers/svgs/SVGOffers";
import SVGBlog from "../blogs/svgs/SVGBlog";
import { handlePackageUser, handlePackageUserLogin, handleUserLogin, handleUserLoginv2 } from "../users/requests/user.requests";

const iconMap: Record<string, React.ReactNode> = {
    user: <TeamOutlined />,
    building: <SVGBuilding className="w-[18px] h-[18px]" />,
    room: <MinusSquareOutlined />,
    "water-bill": <SVGElectricBill className="w-[18px] h-[18px]" />,
    "electricity-bill": <SVGElectricBill className="w-[18px] h-[18px]" />,
    vehicles: <SVGVehicles className="w-[18px] h-[18px]" />,
    package: <SVGPackage className="w-[18px] h-[18px]" />,
    feature: <SVGFeature className="w-[18px] h-[18px]" />,
    offer: <SVGOffers className="w-[18px] h-[18px]" />,
    blog: <SVGBlog className="w-[18px] h-[18px]" />,
};

export default function AdminSideBar() {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            const featureRes = await fetchFeatures();
            const userRes = await handleUserLoginv2();
            const packageRes = await handlePackageUserLogin();

            const role = userRes?.data?.results?.[0]?.role?.toUpperCase();
            const status = userRes?.data?.results?.[0]?.status;
            console.log('check status', status, role, userRes);
            if (status === false) {
                setIsOpen(false);
                return;
            }

            const allFeatures = featureRes?.data?.results || [];
            const packageFeatureIds = (packageRes?.data?.results?.[0]?.features || []).map((id: any) => id.toString());

            if (!role && status === false) return;
            const filtered = allFeatures
                .filter((f: IFeature) => {
                    const allowedRoles = f.systemRoles?.split(",").map(r => r.trim().toUpperCase()) || [];
                    const hasRole = allowedRoles.includes(role);

                    if (!hasRole) return false;

                    if (role === 'SUPER ADMIN') return true;

                    return packageFeatureIds.includes(f._id.toString());
                })
                .sort((a: IFeature, b: IFeature) => a.menuCode.localeCompare(b.menuCode))
                .map((f: IFeature) => ({
                    key: f.path,
                    label: <Link href={`/dashboard/${f.path}`}>{f.name}</Link>,
                    icon: iconMap[f.path] || <AppstoreOutlined />,
                }));

            setMenuItems(filtered);
        };

        load();
    }, []);
    if (!isOpen) {
        return null;
    }
    return (
        <Sider collapsed={collapseMenu}>
            <Menu
                className="h-[100vh-180px]"
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={[
                    {
                        key: 'grp',
                        label: (
                            <Link href="/">
                                <Image
                                    src="/images/header/header-logo.png"
                                    width={140}
                                    height={28}
                                    alt="RoomHub"
                                    className="cursor-pointer py-1"
                                />
                            </Link>
                        ),
                        type: 'group',
                        children: [
                            {
                                key: "dashboard",
                                label: <Link href={"/dashboard"}>Dashboard</Link>,
                                icon: <AppstoreOutlined />,
                            },
                            ...menuItems,
                            {
                                key: "blog 1",
                                label: <Link href={"/dashboard/blog"}>Manage Blogs</Link>,
                                icon: <SVGBlog className="w-[18px] h-[18px]" />,
                            },

                        ],
                    }
                ]}
            />
        </Sider>
    );
}
