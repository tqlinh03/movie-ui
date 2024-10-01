"use client";
import React, { use, useEffect, useState } from "react";
import { Layout, Card, Row, Col, Button, Progress } from "antd";
import {
  CrownOutlined,
  UserAddOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  GiftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { CheckinReward, Vip } from "@/app/types/backend";
import {
  callCreateCheckinLog,
  callFetchCheckinStreak,
  callFetchDailyReward,
  callFetchVipUserInfo,
} from "@/app/config/api";

const { Header, Content } = Layout;

const taskData = [
  {
    icon: <HeartOutlined />,
    text: "Nhập mã người hâm mộ",
    reward: "+???",
    button: "Nhập",
  },
  {
    icon: <SoundOutlined />,
    text: "Phát nền 3 lần(3/3)",
    reward: "+10",
    button: "Nhận",
  },
  {
    icon: <ClockCircleOutlined />,
    text: "Sử dụng ứng dụng hơn 30 phút (458/30)",
    reward: "+30",
    button: "Nhận",
  },
];

interface Props {
  point: number;
  setSelectedBox: (box: string) => void;
  onCheckin: () => void;
}

const Task = ({ point, setSelectedBox, onCheckin }: Props) => {
  const [checkinData, setCheckinData] = useState<CheckinReward[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [vip, setVip] = useState<Vip | null>(null);
console.log("vip", vip)
  useEffect(() => {
    const fetchVipUserInfo = async () => {
      const res = await callFetchVipUserInfo();
      if (res.status === 200) {
        setVip(res.data);
      }
    };
    fetchVipUserInfo();
  }, []);

  useEffect(() => {
    const fetchCheckinStreak = async () => {
      const res = await callFetchCheckinStreak();
      if (res.status === 200) {
        setStreak(res.data === 7 ? 0 : res.data);
      }
    };
    fetchCheckinStreak();
  }, []);

  useEffect(() => {
    const fetchCheckinData = async () => {
      const res = await callFetchDailyReward();
      if (res.status === 200) {
        setCheckinData(res.data);
      }
    };
    fetchCheckinData();
  }, []);

  const handleCheckin = async (dailyRewardId: number | undefined) => {
    const checkin = { dailyRewardId };
    if (dailyRewardId === streak + 1) {
      const res = await callCreateCheckinLog(checkin);
      if (res.status === 200) {
        setStreak(streak + 1);
        onCheckin();
      }
    }
    return;
  };

  const handleBoxClick = (box: string) => {
    setSelectedBox(box);
  };
  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#1e1e1e", marginTop: 10 }}
    >
      <Content style={{ padding: "20px 50px" }}>
        <Card style={{ backgroundColor: "#2c2c2c", color: "#fff" }}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "20px" }}
          >
            <Col span={12}>
              <Card
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  textAlign: "center",
                  marginRight: "10px",
                }}
              >
                <h2 style={{ color: "#ffb400" }}>
                  <CrownOutlined /> {point}{" "}
                </h2>
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#722ed1",
                    color: "#fff",
                  }}
                  onClick={() => handleBoxClick("exchange-point")}
                >
                  Đổi
                </Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  textAlign: "center",
                  marginLeft: "10px",
                }}
              >
                <h2 style={{ color: "#ffb400" }}>
                { vip && vip !== null 
                  ? 
                    `${vip?.remainTime} VIP`
                  :
                    "Hãy Đăng ký VIP"
                }
                  
                </h2>
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#722ed1",
                    color: "#fff",
                  }}
                  onClick={() => handleBoxClick("exchange-point")}
                >
                   { vip && vip !== null 
                  ? 
                 ' Nhận thêm'
                  :
                    "Đăng ký"
                }
                 
                </Button>
              </Card>
            </Col>
          </Row>
          <Card
            title="Check-in hàng ngày"
            headStyle={{ color: "#fff" }}
            style={{ backgroundColor: "#333", color: "#fff" }}
          >
            <Row justify="space-between" gutter={[16, 16]}>
              {checkinData.map((item) => (
                <Col key={item.id} span={3}>
                  <Card
                    onClick={() =>
                      item.day > streak ? handleCheckin(item.id) : {}
                    }
                    style={{
                      backgroundColor: item.day <= streak ? "#a1a1aa" : "#555",
                      color: item.day <= streak ? "#555" : "#fff",
                      textAlign: "center",
                      width: "100%",
                      height: "100px",
                      cursor: item.day <= streak ? "default" : "pointer",
                    }}
                    bodyStyle={{ padding: "10px" }}
                  >
                    <div>
                      {item.day <= streak ? (
                        <CheckCircleOutlined style={{ color: "#a3e635" }} />
                      ) : (
                        <GiftOutlined />
                      )}
                    </div>
                    <div>{item.point}</div>
                    <div style={{ marginTop: "10px" }}>Ngày {item.day}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
          <Card
            title="Trung tâm nhiệm vụ"
            headStyle={{ color: "#fff" }}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              marginTop: "20px",
            }}
          >
            {taskData.map((task, index) => (
              <Row
                key={index}
                justify="space-between"
                align="middle"
                style={{ marginBottom: "20px" }}
              >
                <Col span={2} style={{ textAlign: "center" }}>
                  {task.icon}
                </Col>
                <Col span={14}>
                  <div style={{ color: "#fff" }}>{task.text}</div>
                  <div style={{ color: "#ca8a04" }}>{task.reward}</div>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Button style={{ backgroundColor: "#722ed1", color: "#fff" }}>
                    {task.button}
                  </Button>
                </Col>
              </Row>
            ))}
          </Card>
        </Card>
      </Content>
    </Layout>
  );
};

export default Task;
