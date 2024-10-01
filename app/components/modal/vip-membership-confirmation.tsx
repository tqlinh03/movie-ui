import React, { useState } from 'react';
import { Modal, Button, Row } from 'antd';
import { useRouter } from 'next/navigation';
interface IProps {
  isModalOpen: boolean,
  setIsModalOpen: (v: boolean) => void
}

const VIPMembershipConfirmation = ({isModalOpen, setIsModalOpen } : IProps) => {
  const route = useRouter();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    route.push('/point?box=exchange-point');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Đăng ký VIP, tận hưởng nội dung độc quyền!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Để lúc khác
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Đăng ký VIP
          </Button>,
        ]}
      >
      </Modal>
    </>
  );
};

export default VIPMembershipConfirmation;
