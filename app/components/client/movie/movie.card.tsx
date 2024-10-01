"use client";
import { callFetchMovie } from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import {
  Button,
  Card,
  Col,
  Divider,
  Grid,
  Row,
  Typography,
  message,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { useBreakpoint } = Grid;
const { Title } = Typography;

export const MovieCard = () => {
  const [displayMovie, setDisplayMovie] = useState<IMovie[] | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const screens = useBreakpoint();

  useEffect(() => {
    fetchMovie();
  }, []);

  console.log(displayMovie);
  const fetchMovie = async () => {
    setIsLoading(true);
    const query = `page=0&size=100`;
    const res = await callFetchMovie(query);
    console.log("res", res);
    if (res.data) {
      setDisplayMovie(res.data.content);
      setIsLoading(false);
    } else {
      message.error("Can not call api fetchMovie!");
    }
  };
  const handleDetailMovie = (id: number) => {
    router.push(`/movie/${id}`);
  };

  return (
    <>
      <div className="mt-14">
        <Title level={2} style={{ color: "#fff" }}>
          Đề xuất cho bạn
        </Title>

        {/* <Divider orientation="center"></Divider> */}

        <Row justify={"start"} gutter={[40, 40]}>
          {displayMovie?.map((item) => {
            return (
              <Col
                style={{
                  width: 255,
                  display: "flex",
                  justifyContent: "center",
                }}
                span={24}
                md={4}
                key={item.id}
              >
                <Card
                  bodyStyle={{ padding: 0 }}
                  bordered={false}
                  style={{
                    width: 218,
                    borderRadius: 8,
                    boxShadow: "none",
                    background: "#111319",
                  }}
                  cover={
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        height: 292,
                      }}
                      alt="example"
                      src={item.thumbnailUrl}
                    />
                  }
                  onClick={() => handleDetailMovie(item.id)}
                >
                  <Meta
                    style={{ padding: 0, marginTop: 2 }}
                    title={
                      <div
                        className="text-[#4184b0] text-center text-lg hover:underline hover:cursor-pointer"
                      
                      >
                        <span className="text-zinc-300">{item.title}</span>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};
