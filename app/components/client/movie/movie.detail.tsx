"use client";
import {
  Layout,
  Row,
  Col,
  Tabs,
  Typography,
  Rate,
  Tag,
  Divider,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Episode, IMovie } from "@/app/types/backend";
import {
  callAddView,
  callFetchMovieById,
  callFetchViewId,
  callFetchVipUserInfo,
} from "@/app/config/api";
import moment from "moment";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import VIPMembershipConfirmation from "../../modal/vip-membership-confirmation";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface IProps {
  movieId: number;
  episodeId?: number;
}

export const MovieDetail = ({ movieId, episodeId }: IProps) => {
  const [movie, setMovie] = useState<IMovie>();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkView, setCheckView] = useState<boolean>(true);
  const [view, setView] = useState<any>();
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // Thời gian đã xem
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát video
  const playerRef = useRef<ReactPlayer>(null);

  const viewThreshold = 20;
  const route = useRouter();

  useEffect(() => {
    if (selectedEpisode) {
      const handleCallView = async () => {
        const res = await callFetchViewId(selectedEpisode.view.id);
        console.log("res", res);
        setView(res.data);
      };
      handleCallView();
    }

  }, [selectedEpisode?.id]);

  useEffect(() => {
    if (episodeId && movie) {
      const selected = movie?.episodes?.find((ep) => ep.id === episodeId);
      if (selected) {
        setSelectedEpisode(selected);
      }
    }
  }, [episodeId, movie]);

  useEffect(() => {
    movieData();
  }, []);

  const movieData = async () => {
    if (!movieId) return;
    const res = await callFetchMovieById(movieId);
    setMovie(res.data);
    if (!episodeId) {
      const e = res.data?.episodes?.sort(
        (a: Episode, b: Episode) => a.episodeNumber - b.episodeNumber
      )[0];
      setSelectedEpisode(e);
    }
  };

  const handleEpisodeSelect = async (episode: Episode) => {
    if (checkEpisodeVip(episode.payUntil)) {
      const res = await callFetchVipUserInfo();
      if (res.status === 200) {
        if (checkVipOfUser(res.data.vipEndDate)) {
          route.push(`/movie/${movieId}/${episode.id}`);
        }
      } else {
        handleVIPMembershipConfirmation();
      }
      return;
    }
    route.push(`/movie/${movieId}/${episode.id}`);
  };

  const handleVIPMembershipConfirmation = () => {
    setIsModalOpen(true);
  };

  // kiểm tra xem có phải tập VIP không
  const checkEpisodeVip = (paymentUntil: Date) => {
    const now = moment();
    const paymentUntilMoment = moment(paymentUntil);
    return now.isBefore(paymentUntilMoment);
  };

  // Kiểm tra xem user cón VIP không
  const checkVipOfUser = (vipEndDate: Date) => {
    const now = moment();
    const vipEndDateMoment = moment(vipEndDate);
    return now.isBefore(vipEndDateMoment);
  };

  //
  const totalEpisodes = 24;
  const vipEpisodes = [6, 9, 12, 15, 18, 21, 24]; // Những tập có VIP
  const previewEpisodes = [7, 10, 13, 16, 19, 22]; // Những tập có Preview

  const movies = [
    {
      rank: 1,
      title: "Vân Chi Vũ",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 2,
      title: "Thiên Long Bát Bộ",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 3,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 4,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 5,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 6,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 7,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 8,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 9,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      rank: 10,
      title: "Thần Điêu Đại Hiệp",
      image:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    // Thêm các phim khác nếu cần
  ];

  const displayMovie = [
    {
      id: 1,
      title: "Vân Chi Vũ",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      id: 2,
      title: "Thiên Long Bát Bộ",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      id: 3,
      title: "Thần Điêu Đại Hiệp",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      id: 4,
      title: "Thần Điêu Đại Hiệp",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      id: 5,
      title: "Thần Điêu Đại Hiệp",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
    {
      id: 6,
      title: "Thần Điêu Đại Hiệp",
      thumbnailUrl:
        "https://utfs.io/f/30b1c5be-29fd-4c05-88d8-51838843fd9a-t90kbm.jpg",
    },
  ];

  // Xử lý sự kiện khi bắt đầu phát video
  const handlePlay = () => {
    setIsPlaying(true); // Đặt trạng thái là đang phát
    setStartTime(Date.now()); // Ghi lại thời gian bắt đầu
  };

  // Xử lý sự kiện khi kết thúc video
  const handlePause = () => {
    setStartTime(Date.now());
    setIsPlaying(false); // Đặt trạng thái là không phát
  };

  // Xử lý sự kiện khi video chạy
  const handleProgress = async (progress: any) => {
    if (isPlaying && checkView) {
      console.log("elapsedTime", elapsedTime);
      const currentTime = Date.now();
      const timeWatched = Math.floor((currentTime - startTime) / 1000); // Tính thời gian đã xem trong giây
      setElapsedTime((prev) => prev + timeWatched); // Cập nhật tổng thời gian đã xem
      setStartTime(Date.now());
      if (elapsedTime >= viewThreshold) {
        const view = {
          episode_id: selectedEpisode?.id,
        };
        await callAddView(view);
        setCheckView(false);
      }
    }
  };

  return (
    <>
      <Layout style={{ backgroundColor: "#111319" }}>
        {/* Main Content */}
        <Content style={{ padding: "10px 100px" }}>
          {/* Banner và Tabs cùng hàng */}
          <Row gutter={16} style={{ marginBottom: "30px" }}>
            <Col span={18}>
              <ReactPlayer
                ref={playerRef}
                width={"100%"}
                // onStart={handleStart}
                onProgress={handleProgress}
                onPause={handlePause}
                onPlay={handlePlay}
                // onEnded={handleEnded}
                url={selectedEpisode?.movieUrl}
                style={{ borderRadius: "8px" }}
                controls={true}
              />
            </Col>

            {/* Tabs Phần Chọn tập và Nội dung đặc sắc */}
            <Col span={6}>
              <Row>
                <Title style={{ marginTop: 5, color: "white" }} level={3}>
                  {movie?.title}
                </Title>
              </Row>
              <Tabs indicator={{ align: "center" }} defaultActiveKey="1">
                {/* Tab Chọn tập */}
                <TabPane
                  style={{}}
                  tab={<div className="text-white">Chọn tập</div>}
                  key="1"
                >
                  <Row gutter={[4, 4]} style={{ maxHeight: "400px" }}>
                    {movie?.episodes
                      ?.sort((a, b) => a.episodeNumber - b.episodeNumber)
                      .map((item) => (
                        <Col
                          span={4}
                          key={item.id}
                          style={{ textAlign: "center" }}
                        >
                          <div
                            style={{
                              backgroundColor: "#2b2b38",
                              padding: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              height: 40, // Đặt chiều cao cố định
                              width: 40, // Đặt chiều rộng cố định
                              position: "relative", // Đảm bảo vị trí cho căn chỉnh tuyệt đối
                            }}
                            onClick={() => handleEpisodeSelect(item)}
                          >
                            <Text
                              style={{
                                fontSize: "16px",
                                color: "white",
                                marginBottom: "10px", // Điều chỉnh khoảng cách
                              }}
                            >
                              {item.episodeNumber}
                            </Text>

                            <Text
                              style={{
                                fontSize: "10px",
                                color: checkEpisodeVip(item.payUntil)
                                  ? "gold"
                                  : "white",
                                position: "absolute",
                                bottom: "5px", // Đặt chữ ở phía dưới của ô
                              }}
                            >
                              {checkEpisodeVip(item.payUntil) ? "VIP" : ""}
                            </Text>
                          </div>
                        </Col>
                      ))}
                  </Row>
                </TabPane>

                {/* Tab Nội dung đặc sắc */}
                <TabPane
                  tab={<div className="text-white">Nội dung đặc sắc</div>}
                  key="2"
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    Tính năng chưa phát hành.
                  </Text>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <Divider style={{ borderColor: "#282A2C" }}></Divider>

          {/* Thông tin chi tiết */}
          <Row gutter={16} style={{ marginBottom: "30px" }}>
            <Col span={18}>
              <Title style={{ color: "white", marginTop: 2 }} level={3}>
                {movie?.title}
              </Title>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "white",
                }}
              >
                {view?.users.length} lượt xem
              </Text>
              <Rate
                disabled
                defaultValue={5}
                character={<StarFilled />}
                style={{ marginBottom: "10px" }}
              />
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "white",
                }}
              >
                Rating: 9.7
              </Text>
              <Tag color="gold" style={{ marginBottom: "10px" }}>
                VIP
              </Tag>
              <Text
                type="secondary"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "white",
                }}
              >
                13+ | 2024 | {movie?.episodes?.length} Tập
              </Text>
              <Text
                style={{ display: "block", color: "white" }}
                type="secondary"
              >
                Thể loại:{" "}
                {movie?.genres?.map((genre: any) => genre.name).join(", ")}
              </Text>
              {/* 
              <Divider style={{ borderColor: "#282A2C" }}></Divider>
              <Title level={2} style={{ color: "#fff" }}>
                Đề xuất cho bạn
              </Title>
              <Row justify={"start"} gutter={[4, 4]}>
                {displayMovie?.map((item) => {
                  return (
                    <Col
                      style={{
                        width: 100,
                        height: 100,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      span={24}
                      md={4}
                      // key={item.id}
                    >
                      <Card
                        bodyStyle={{ padding: 0 }}
                        bordered={false}
                        style={{
                          width: 140,
                          borderRadius: 8,
                          boxShadow: "none",
                          background: "#111319",
                        }}
                        cover={
                          <img
                            style={{
                              objectFit: "cover",
                              borderRadius: 8,
                              height: 200,
                            }}
                            alt="example"
                            src={item.thumbnailUrl}
                          />
                        }
                      >
                        <Meta
                          style={{ padding: 0, marginTop: 2 }}
                          title={
                            <div
                              className="text-[#4184b0] text-center text-lg hover:underline hover:cursor-pointer"
                              // onClick={() => handleDetailMovie(item.id)}
                            >
                              <span className="text-zinc-300">
                                {item.title}
                              </span>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row> */}
            </Col>

            {/* <Col span={6}>
              <Layout
                style={{
                  backgroundColor: "#111319",
                  border: "2px solid white",
                  borderRadius: "8px",
                }}
              >
                <Content style={{ padding: "20px" }}>
                  <Row gutter={16}>
                    <Title style={{ color: "white", marginTop: 2 }} level={3}>
                      Bảng xếp hạng
                    </Title>
                  </Row>

                  {movies.map((movie) => (
                    <Row
                      gutter={16}
                      style={{ marginBottom: "10px", alignItems: "center" }}
                      key={movie.rank}
                    >
                      <Col span={4}>
                        <Text style={{ color: "white" }}>{movie.rank}</Text>
                      </Col>
                      <Col span={8}>
                        <Image width={80} src={movie.image} alt="Movie Image" />
                      </Col>
                      <Col span={12}>
                        <Text style={{ color: "white" }}>{movie.title}</Text>
                      </Col>
                    </Row>
                  ))}
                </Content>
              </Layout>
            </Col> */}
          </Row>
        </Content>
      </Layout>
      <VIPMembershipConfirmation
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
