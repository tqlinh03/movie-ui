"use client";
import React from "react";
import { Layout, Menu, theme, Image, message } from "antd/lib";
import { useDispatch } from "react-redux";
import { setLogoutAction } from "../redux/slice/accountSlide";
import { useRouter } from "next/navigation";
import { callLogout } from "@/app/config/api";
import { useAppSelector } from "../redux/hook";
import {
  Avatar,
  Breadcrumb,
  Divider,
  Dropdown,
  GetProps,
  Grid,
  Space,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { TbVip } from "react-icons/tb";
import Link from "next/link";
import {
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GoHistory } from "react-icons/go";
import { AiOutlineUser } from "react-icons/ai";
import { FcDvdLogo } from "react-icons/fc";
import { Input } from "antd";
const { Search } = Input;

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

type SearchProps = GetProps<typeof Input.Search>;

export const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated 
  );
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const screens = useBreakpoint();

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const handleLogout = async () => {
    try {
      const res = await callLogout();
      if (res && res.data) {
        dispatch(setLogoutAction({}));
        router.push(`${window.location.origin}/login`);
        message.success("Đăng xuất thành công");
      }
    } catch (e) {
      console.log("error logout: ", e);
    }
  };

  const itemsDropdown = [
    {
      label: <Link href={"/account"}> Quản lý tài khoản</Link>,
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      className="flex justify-center items-center"
      style={{
        backgroundColor: "#111319",
      }}
    >
      <div className="w-full flex justify-center bg-dark_gray fixed !top-0 !left-0 !z-50">
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 99,
            width: "100%",
            marginLeft: 20,
            marginRight: 20,
            // width: screens.xl
            //   ? 1180
            //   : screens.lg
            //   ? 1024
            //   : screens.md
            //   ? 768
            //   : screens.sm
            //   ? 640
            //   : 390,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#0A0C0F",

            // padding: screens.sm ? 48 : 24,
          }}
        >
          <div>
            <Link href={"/"}>
              <FcDvdLogo className="text-6xl mt-5" />
            </Link>
          </div>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={[
              {
                key: "home",
                label: (
                  <Link href="/">
                    <span className="text-zinc-200">Đề xuất</span>
                  </Link>
                ),
              },
              {
                key: "/news-and-offers",
                label: (
                  <Link href="/">
                    <span className="text-zinc-200">Phim bộ</span>
                  </Link>
                ),
              },
            ]}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: "#0A0C0F",
              color: "#d1d5db",
              fontSize: "16px",
              fontWeight: 400,
            }}
          />
          <Search
            className="bg-dark_gray"
            placeholder="input search text"
            allowClear
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
          <div className="flex flex-col items-center mt-2 ml-4">
            <GoHistory className="text-zinc-200 text-base" />
            <span className="mt-1 text-xs text-zinc-200">Lịch sử xem</span>
          </div>

          {isAuthenticated === false ? (
            <Link href={"login"} className="text-gray-300">
              <div className="flex flex-col items-center mt-2 ml-4 ">
                <AiOutlineUser className="text-zinc-200 text-base" />
                <span className="mt-1 text-xs text-zinc-200">Đăng nhập</span>
              </div>
            </Link>
          ) : (
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: "#a1a1aa", marginLeft: 16 }}>
                  {user?.lastName?.substring(0, 1)?.toUpperCase()}{" "}
                </Avatar>
              </Space>
            </Dropdown>
          )}

          <Link href="/point">
            <div className="flex flex-col items-center mt-2 ml-4">
              <TbVip className="text-4xl text-amber-400" />
              {/* <span className="mt-1 text-xs text-zinc-200">Điểm thưởng</span> */}
            </div>
          </Link>
        </Header>
      </div>
      {/* <Divider style={{ margin: 0 }} /> */}
      <Content
        style={{
          width: "100%",
          // width: screens.xl
          //   ? 1180
          //   : screens.lg
          //   ? 1024
          //   : screens.md
          //   ? 768
          //   : screens.sm
          //   ? 640
          //   : 390,
          // padding: screens.sm ? 640 : 390"0 48px"
          paddingLeft: 20,
          paddingRight: 20,

          backgroundColor: "#111319",
        }}
      >
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            height: "100%",
            background: "#111319",
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{ width: "100%", textAlign: "center", background: "#d9d9d9" }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
