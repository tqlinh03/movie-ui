"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { callCreateEpisode, callDeleteEpisode, callUpdateEpisode } from "@/app/config/api";
import { Episode } from "@/app/types/backend";
import { on } from "events";
import dayjs from "dayjs";

interface Props {
  movieId: number;
  visible: boolean;
  episodeDetail?: Episode | null;
  setEpisodeDetail?: (a: any) => void;
  setVisible: (visible: boolean) => void;
  onChanges: () => void;
}

const EpisodeModal = ({
  movieId,
  visible,
  episodeDetail,
  setEpisodeDetail,
  setVisible,
  onChanges,
}: Props) => {
  const [form] = Form.useForm();
  const [releaseDateTime, setReleaseDateTime] = useState(dayjs());
  const [paymentUntil, setPaymenUntil] = useState(dayjs());
  const [formData, setFormData] = useState({
    title: "",
    episodeNumber: 0,
    movieUrl: "",
    point: 0,
  });

  useEffect(() => {
    if (episodeDetail) {
      setFormData({
        title: episodeDetail.title,
        episodeNumber: episodeDetail.episodeNumber,
        movieUrl: episodeDetail.movieUrl,
        point: episodeDetail.point,
      });
      setReleaseDateTime(dayjs(episodeDetail.releaseDateTime));
      setPaymenUntil(dayjs(episodeDetail.payUntil));
    }
  }, [episodeDetail]);

  const handleOk = () => {
    setVisible(false);
    setFormData({
      title: "",
      episodeNumber: 0,
      movieUrl: "",
      point: 0,
    });
    setReleaseDateTime(dayjs());
    setPaymenUntil(dayjs());
    if (setEpisodeDetail) {
      setEpisodeDetail(null);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setFormData({
      title: "",
      episodeNumber: 0,
      movieUrl: "",
      point: 0,
    });
    setReleaseDateTime(dayjs());
    setPaymenUntil(dayjs());
    if (setEpisodeDetail) {
      setEpisodeDetail(null);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: any) => {
    setReleaseDateTime(date);
  };

  const handlePaymentUntil = (date: any) => {
    setPaymenUntil(date);
  };

  const handleDeleteEpisode = async () => {
    if (episodeDetail?.id !== undefined) {
      const res = await callDeleteEpisode(episodeDetail.id);
      if (res.status === 200) {
        message.success("Xóa thành công");
        setVisible(false);
        onChanges();
      } else {
        message.error("Xóa thất bại");
      }
    } else {
      message.error("ID của tập phim không hợp lệ");
    }
  };

  const handleEpisode = async () => {
    const episode = {
      title: formData.title,
      episodeNumber: formData.episodeNumber,
      releaseDateTime: releaseDateTime,
      payUntil: paymentUntil,
      movieUrl: formData.movieUrl,
      point: formData.point,
      movieId,
    };

    if (episodeDetail) {
      if (episodeDetail.id !== undefined) {
        const res = await callUpdateEpisode(episodeDetail.id, episode);
        if (res.status === 200) {
          message.success("Cập nhật thành công");
          setVisible(false);
          setFormData({
            title: "",
            episodeNumber: 0,
            movieUrl: "",
            point: 0,
          });
          setReleaseDateTime(dayjs());
          setPaymenUntil(dayjs());
          if (setEpisodeDetail) {
            setEpisodeDetail(null);
          }
          onChanges();
          form.resetFields();
        } else {
          message.error("Cập nhật thất bại");
        }
      } else {
        message.error("ID của tập phim không hợp lệ");
      }
    } else {
      const res = await callCreateEpisode(episode);
      if (res.status === 200) {
        message.success("Tạo thành công");
        setVisible(false);
        setFormData({
          title: "",
          episodeNumber: 0,
          movieUrl: "",
          point: 0,
        });
        setReleaseDateTime(dayjs());
        setPaymenUntil(dayjs());
        if (setEpisodeDetail) {
          setEpisodeDetail(null);
        }
        onChanges();
        form.resetFields();
      } else {
        message.error("Tạo thất bại");
      }
    }
  };

  return (
    <Modal
      title="Chi tiết tập phim"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tiêu đề">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            size="large"
            placeholder="Tiêu đề phim"
            className="placeholder-white"
          />
        </Form.Item>

        <Form.Item label="Số tập">
          <InputNumber
            name="episodeNumber"
            value={formData.episodeNumber}
            onChange={(value) =>
              handleInputChange({ target: { name: "episodeNumber", value } })
            }
            size="large"
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="URL phim">
          <Input
            name="movieUrl"
            value={formData.movieUrl}
            onChange={handleInputChange}
            size="large"
            placeholder="URL phim"
            prefix={<LinkOutlined />}
            className="placeholder-white"
          />
        </Form.Item>

        <Form.Item label="Số điểm mở khóa tập phim">
          <InputNumber
            name="point"
            value={formData.point}
            onChange={(value) =>
              handleInputChange({ target: { name: "point", value } })
            }
            size="large"
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Ngày giờ phát hành">
          <DatePicker
            value={releaseDateTime}
            onChange={handleDateChange}
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Ngày mở miễn phí">
          <DatePicker
            value={paymentUntil}
            onChange={handlePaymentUntil}
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            style={{
              width: "100%",
              backgroundColor: "#faad14",
              color: "white",
            }}
            onClick={handleEpisode}
          >
            Lưu
          </Button>
        </Form.Item>

        {episodeDetail ? (
          <Form.Item>
            <Button
              type="primary"
              size="large"
              style={{
                width: "100%",
                backgroundColor: "red",
                color: "white",
              }}
              onClick={handleDeleteEpisode}
            >
              Xóa
            </Button>
          </Form.Item>
        ) : (
          ""
        )}
      </Form>
    </Modal>
  );
};

export default EpisodeModal;
