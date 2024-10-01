"use client"
import { useAppSelector } from "@/app/redux/hook";
import { Col, Divider, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import Task from "./task";
import { useRouter } from "next/navigation";
import ExchangePoint from "./exchange-point";
import { callFetchPointOfUser } from "@/app/config/api";
import PaymentModal from "../../modal/payment-modal";
import queryString from "query-string";

export const Point = () => {
  const [selectedBox, setSelectedBox] = useState<string>("task");
  const [point, setPoint] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    // Lấy query string từ URL
    const { box } = queryString.parse(location.search);
    if (box === "exchange-point") {
      setSelectedBox(box as string);
    }
  }, []);

  useEffect(() => {
    fetchPointOfUser();
  }, []);

  const fetchPointOfUser = async () => {
    const res = await callFetchPointOfUser();
    if (res.status === 200) {
      setPoint(res.data.point);
    } else {
      message.error("Có lỗi xảy ra");
    }
  }






  const handleBoxClick = (box: string) => {
    setSelectedBox(box);
  };
  const router = useRouter(); 
 
  // const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isAuthenticated]);

  return (
    <>
   <Row className="mt-10 text-white font-bold" justify="start" align="middle" gutter={16}>
  <Col span={8}>
    <div
      className={`p-4 ${selectedBox === 'task' ? 'bg-lavender_purple text-zinc-300' : 'bg-zinc-700'} text-center`}
      onClick={() => handleBoxClick('task')}
    >
      NHIÊM VỤ
    </div>
  </Col>
  <Col span={8}>
    <div
      className={`p-4 ${selectedBox === 'invite' ? 'bg-lavender_purple text-white' : 'bg-zinc-700'} text-center`}
      onClick={() => handleBoxClick('invite')}
    >
      MỜI 
    </div>
  </Col>
  <Col span={8}>
    <div
      className={`p-4 ${selectedBox === 'exchange-point' ? 'bg-lavender_purple text-white' : 'bg-zinc-700'} text-center`}
      onClick={() => handleBoxClick('exchange-point')}
    >
      ĐỔI ĐIỂM
    </div>
  </Col>
</Row>

    {/* <Divider className="bg-zinc-300" style={{ margin: 0, marginTop: 14 }} /> */}
    {selectedBox === 'task' && 
      <Task 
        point={point}
        setSelectedBox={setSelectedBox}
        onCheckin={fetchPointOfUser}
      />
    }
    {selectedBox === "exchange-point" && 
      <ExchangePoint
        point={point}
        setSelectedBox={setSelectedBox}
        setVisible={setVisible}
        onExchangePoint={fetchPointOfUser}
      />
    }

    <PaymentModal 
      visible={visible}
      setVisible={setVisible}
    />
  </>
  );
}