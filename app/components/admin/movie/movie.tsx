"use client";
import React, { use, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  DatePicker,
  InputNumber,
  Image,
  Select,
} from "antd";

import { UploadButton, UploadDropzone } from "@/app/utils/uploadthing";
import {
  callCreateMovie,
  callFetchGenre,
  callFetchMovieById,
  callUpdateMovie,
} from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import { useAppSelector } from "@/app/redux/hook";
import moment from "moment";
import { useRouter } from "next/navigation";

interface IProps {
  movieId?: number;
}

const { Option } = Select;

export const Movie = ({ movieId }: IProps) => {
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<string>("");
  const [genre, setGenre] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  console.log("imgUrl", imgUrl);
  const router = useRouter();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const validateMessages = {
    required: "${label} bắt buộc phải nhập!",
  };

  // useEffect(() => { 
  //   const genreData = async () => {
  //     const res = await callFetchGenre();
  //     setGenre(res.data);
  //   }
  //   genreData()
  // }, []); 

  useEffect(() => {
    genreData()
    if (movieId != undefined) {
      const movieData = async () => {
        const res = await callFetchMovieById(movieId);
        setImgUrl(res?.data.thumbnailUrl);
        // setGenre(res?.data.genre);
        const genre = res?.data.genres.map((item: any) => item.id);
        form.setFieldsValue({
          title: res?.data.title,
          genreIds: genre,
          cast: res?.data.cast,
          director: res?.data.director,
          description: res?.data.description,
        });
      };
      movieData();
    }
  }, []);

  const genreData = async () => {
    const res = await callFetchGenre();
    setGenre(res.data);
  }


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
    console.log(movie);

    if (movieId != undefined) {
      const res = await callUpdateMovie(movieId, movie);
      if (res.status != 200) {
        message.error("Không thể cập nhật!");
      } else {
        message.success("Update movie success.");
        // setImgUrl("");
        router.push("/admin/movie/all");
      }
    } else {
      const res = await callCreateMovie(movie);
      console.log(res);
      if (res.status != 200) {
        message.error("Có lỗi xẩy ra!");

      } else {
        message.success("Thêm thành công.");
        setImgUrl("");
        form.resetFields();
      }
    }
  };

  return (
      <div className="m-5 bg-white flex justify-center ">
        <Form
          title="Thêm bộ phim mới"
          {...layout}
          form={form}
          labelAlign="left"
          // name="nest-messages"
          onFinish={onFinish}
          style={{ width: "100%", margin: "60px", padding: "20px" }}
          validateMessages={validateMessages}
          className="text-2xl font-medium mb-10"
        >
          <div className="text-2xl mb-10 flex justify-start">
            {movieId != undefined
              ? "CÂP NHẬT TÔNG TIN PHIM"
              : "THÊM BỘ PHIM MỚI"}
          </div>
          <Form.Item name="img" label="Ảnh">
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
          </Form.Item>

          <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
          label="Thể loại"
          name="genreIds"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Select
            allowClear
             mode="multiple"
            placeholder="Chọn..."
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
          >
            {genre.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
          <Form.Item
            name="description"
            label="Miêu tả"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="director"
            label="Đạo diễn"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="cast"
            label="Diễn viên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
    

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ height: 40, width: "100%" }}
              type="primary"
              htmlType="submit"
            >
              {movieId != undefined
                ? "Cập nhật"
                : "Thêm "}
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};
