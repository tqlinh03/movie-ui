"use client";
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { callLogin, callSendCodeEmail } from "@/app/config/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ActiveAccount } from "./active-account";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/app/redux/slice/accountSlide";

export const Login = () => {
  const route = useRouter();
  const [hidden, setHiden] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setEmail(username);
    setIsSubmit(true);
    try {
      const res = await callLogin(username, password);
      if (res?.businessErrorCode === 303) {
        setHiden(false);
        await callSendCodeEmail(email);
      }

      console.log("res", res);

      if (res?.businessErrorCode === 304) {
        message.warning(res?.businessErrorDescription);
      }
      if (res.data.token) {
        localStorage.setItem("access_token", res.data.token);
        dispatch(setUserLoginInfo(res.data))
        message.success('Đăng nhập tài khoản thành công!');
        route.push("/");
      }
    } catch (error) {
      console.error("Error login:", error);
    }
    setIsSubmit(false);
  };

  return (
    <div>
      {hidden === false ? (
        <ActiveAccount email={email} hidden={hidden} setHiden={setHiden} />
      ) : (
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="text-2xl mt-5 mb-10 flex justify-center">
            Đăng Nhập
          </div>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
          >
            <Input
              className="h-10"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              className="h-10"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isSubmit}
              type="primary"
              htmlType="submit"
              className="w-full pt-4 mb-2"
              style={{ height: 40 }}
            >
              Đăng nhập
            </Button>
            <span className="m-1">Chưa có tài khoản?</span>
            <Link href="/register">Đăng ký ngay</Link>
            <br />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
