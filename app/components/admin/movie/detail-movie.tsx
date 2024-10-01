"use client";
import {
  Layout,
  Row,
  Col,
  Tabs,
  Typography,
  Rate,
  Image,
  Card,
  Button,
  Tag,
  Avatar,
  Divider,
  Input,
  Form,
  Select,
  message,
} from "antd";
import { StarFilled, LockOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { callFetchGenre, callFetchMovieById, callUpdateMovie } from "@/app/config/api";
import { Episode, IMovie } from "@/app/types/backend";
import { set } from "lodash";
import { it } from "node:test";
import EpisodeModal from "../../modal/episode-modal";
import moment from "moment";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;
interface IProps {
  movieId: number;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const validateMessages = {
  required: "${label} bắt buộc phải nhập!",
};
export const DetailMovie = ({ movieId }: IProps) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [genre, setGenre] = useState<any>([]);
  const [episode, setEpisode] = useState<Episode[]>([]);
  const [episodeDetail, setEpisodeDetail] = useState<Episode | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);


  useEffect(() => {
    genreData(); 
    if (movieId != undefined) {
      movieData();
    }
  }, []);

  const movieData = async () => {
    const res = await callFetchMovieById(movieId);
    setImgUrl(res?.data.thumbnailUrl);
    // setGenre(res?.data.genre);
    const genre = res?.data.genres.map((item: any) => item.id);
     const sortedEpisodes = res.data.episodes.sort((a: Episode, b: Episode) => a.episodeNumber - b.episodeNumber);
    setEpisode(sortedEpisodes);
    form.setFieldsValue({
      title: res?.data.title,
      genreIds: genre,
      cast: res?.data.cast,
      director: res?.data.director,
      description: res?.data.description,
    });
  };

  const genreData = async () => {
    const res = await callFetchGenre();
    setGenre(res.data);
  };

  const handleEventModalEpisode = (episode?: Episode | null) => {
    if(episode) {
      setEpisodeDetail(episode);
    }
    setVisible(true);
    
  };

  const checkVip = (paymentUntil : Date) => {
    const now = moment();
    const paymentUntilMoment = moment(paymentUntil);
    return now.isBefore(paymentUntilMoment);
};
  const [form] = Form.useForm();

  
  const onFinish = async (values: IMovie) => {
    const {
      title,
      cast,
      director,
      genreIds,
      description,
    } = values; 
    const movie = {
      thumbnailUrl: imgUrl,
      title,
      cast,
      director,
      genreIds,
      description,
    };
    console.log("movie", movie);

    if (movieId != undefined) {
      const res = await callUpdateMovie(movieId, movie);
      if (res.status != 200) {
        message.error("Không thể cập nhật!");
      } else {
        message.success("Update movie success.");
        movieData();
      }
    } 
  };

  return (
    <>
    <Layout style={{ backgroundColor: "#F5F5F5" }}>
      {/* Main Content */}
      <Content style={{ padding: "10px 100px" }}>
        {/* Banner và Tabs cùng hàng */}
        <Row gutter={16} style={{ marginBottom: "30px" }}>
        <Col span={18} style={{ display: "flex", flexDirection: "column" }}>
              <Image
                src={imgUrl}
                alt="Banner"
                style={{ width: "100%", height: 400, borderRadius: "8px", objectFit: "cover", flexGrow: 1 }}
                preview={false}
              />
            </Col>

          {/* Tabs Phần Chọn tập và Nội dung đặc sắc */}
          <Col span={6}>
            <Row>
              <Title style={{ marginTop: 5 }} level={3}>
                Tập Phim
              </Title>
            </Row>

            <Row gutter={[4, 4]} style={{ maxHeight: "400px" }}>
              {episode?.map((item) => (
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
                    onClick={() => handleEventModalEpisode(item)}
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
                        color: checkVip(item.payUntil)
                          ? "gold"
                          : "white",
                        position: "absolute",
                        bottom: "5px", // Đặt chữ ở phía dưới của ô
                      }}
                    >
                      {checkVip(item.payUntil)
                        ? "VIP"
                        : ""}
                    </Text>
                  </div>
                </Col>
              ))}
              <Button onClick={() => handleEventModalEpisode()} type="primary">Thêm tập phim</Button>
            </Row>
          </Col>
        </Row>
        <Divider style={{ borderColor: "#282A2C" }}></Divider>

        {/* Thông tin chi tiết */}
        <Row gutter={16} style={{ marginBottom: "30px" }}>
          <Form
            title="update-movie"
            {...layout}
            form={form}
            onFinish={onFinish}
            labelAlign="left"
            name="update-movie"
            style={{ width: "100%" }}
            validateMessages={validateMessages}
            className="text-2xl font-medium mb-10"
          >
            {/* <Form.Item name="img" label="Ảnh">
            <div className="flex">
              <div className="mr-5">
                <Image width={200} src={imgUrl} preview={false} />
              </div>
              <div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res: any) => {
                    setImgUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    message.error(error.message);
                  }}
                />
              </div>
            </div>
          </Form.Item> */}

            <Form.Item
              wrapperCol={{ span: 24 }}
              name="title"
              rules={[{ required: true }]}
            >
              <Input
                style={{ backgroundColor: "#F5F5F5" }}
                placeholder="Tên phim"
                className="custom-input bg-gray-900 text-white"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              name="genreIds"
              rules={[{ required: true, message: "Không được để trống!" }]}
            >
              <Select
                allowClear
                mode="multiple"
                placeholder="Thể loại"
                value={selectedItems}
                onChange={setSelectedItems}
                style={{ backgroundColor: "#F5F5F5" }}
              >
                {genre.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 24 }}
              name="description"
              rules={[{ required: true }]}
            >
              <TextArea
                placeholder="Miêu tả"
                allowClear
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              name="director"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Đạo diễn"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              name="cast"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="Diễn viên"
                style={{ backgroundColor: "#F5F5F5" }}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                style={{ height: 40, width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                {movieId != undefined ? "Cập nhật" : "Thêm "}
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Content>
    </Layout>

    <EpisodeModal 
      movieId={movieId}
      visible={visible}
      setVisible={setVisible}
      episodeDetail={episodeDetail}
      setEpisodeDetail={setEpisodeDetail}
      onChanges={movieData}
    />
    </>
  );
};
