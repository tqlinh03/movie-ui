"use client";
import React, { useRef, useState } from "react";
import { ConfigProvider, Image, Popconfirm, message, notification } from "antd";
import { callDeleteMovie, callFetchMovie } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { IMeta, IMovie, IPermission } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
// import { fetchMovie, setSingleMovie } from "@/app/redux/slice/movieSlide";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import Link from "next/link";

export const AllMovie = () => {
  const tableRef = useRef<ActionType>();
  const router = useRouter();
  const [meta, setMeta] = useState<IMeta>();
  const [locale, setLocal] = useState<Locale>(vi_VN);
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteMovie = async (_id: string | undefined) => {
    console.log(_id);
    if (_id) {
      const res = await callDeleteMovie(+_id);
      if (res.status === 200) {
        message.success("Xóa thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Error delete role",
          description: res.data.message,
        });
      }
    }
  };

  const columns: ProColumns<IMovie>[] = [
    {
      title: "STT",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "ẢNH",
      // dataIndex: "img",
      render(dom, entity, index, action, schema) {
        return <Image width={100} src={entity.thumbnailUrl} />;
      },
    },
    {
      title: "TÊN PHIM",
      dataIndex: "title",
    },

    {
      title: "GIỚI THIỆU",
      dataIndex: "description",
      hideInSearch: true,
    },

    {
      title: "TẠO LÚC",
      render(dom, entity, index, action, schema) {
        return <>{moment(entity?.createdDate).format("DD/MM/YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "CẬP NHẬT LÚC",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>{moment(entity.lastModifiedDate).format("DD/MM/YYYY HH:mm:ss")}</>
        );
      },
    },
    {
      title: "HÀNH ĐỘNG",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <a>
            <EditOutlined
              style={{ color: "darkorange" }}
              onClick={async () => {
                // await dispath(setSingleMovie(entity));
                router.push(`/admin/movie/${entity.id}`);
              }}
            />
          </a>

          <Popconfirm
            title="Bạn có muốn xóa?"
            onConfirm={() => handleDeleteMovie(entity.id)}
            okText="xóa"
            cancelText="Hủy"
          >
            <a>
              <DeleteOutlined style={{ color: "red" }} />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
    if (clone.method) clone.method = `/${clone.method}/i`;
    if (clone.module) clone.module = `/${clone.module}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.apiPath) {
      sortBy = sort.apiPath === "ascend" ? "sort=apiPath" : "sort=-apiPath";
    }
    if (sort && sort.method) {
      sortBy = sort.method === "ascend" ? "sort=method" : "sort=-method";
    }
    if (sort && sort.module) {
      sortBy = sort.module === "ascend" ? "sort=module" : "sort=-module";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    // //mặc định sort theo updatedAt
    // if (Object.keys(sortBy).length === 0) {
    //     temp = `${temp}&sort=-updatedAt`;
    // } else {
    //     temp = `${temp}&${sortBy}`;
    // }

    return temp;
  };

  return (
    <div className="mt-4 bg-white">
      <ConfigProvider locale={locale}>
        <DataTable<IMovie>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="DANH SÁCH PHIM"
          columns={columns}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: (params.current ?? 1) - 1,
              size: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            const response = await callFetchMovie(query);
            const meta = {
              number: response.data.number,
              size: response.data.size,
              totalElements: response.data.totalElements,
              totalPages: response.data.totalPages,
            };
            setMeta(meta);
            return {
              data: response.data.content,
              success: true,
            };
          }}
          scroll={{ x: true }}
          pagination={{
            // current: meta?.number,
            // pageSize: meta?.size,
            // showSizeChanger: true,
            // total: meta?.totalElements,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} trên {total}
                </div>
              );
            },
          }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <Link href={"/admin/movie/new"}>
                <Button icon={<PlusOutlined />} type="primary">
                  Thêm bộ phim mới
                </Button>
              </Link>
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
};
