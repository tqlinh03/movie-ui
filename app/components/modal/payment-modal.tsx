"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Radio, Form, Input, Checkbox, Row, Col } from 'antd';
import { CreditCardOutlined, DollarCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import { callCreatePaymentLink, callFetchLatestExchangeRate } from '@/app/config/api';
import { ExchangeRate } from '@/app/types/backend';
import { useRouter } from 'next/navigation';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const PaymentModal = ({
  visible,
  setVisible,
} : Props) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [amount, setAmount] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRate = async () => {
      const res = await callFetchLatestExchangeRate();
      if(res.status === 200) {
        setExchangeRate(res.data);
      }
    }
    fetchRate();
  }, []);

  useEffect(() => {
    if(exchangeRate) {
      setPoints(amount * exchangeRate.point);
    }
  }, [amount]);

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAmountChange = (e: any) => {
    const value = e.target.value;
    const numberValue = Number(value);

    // Kiểm tra nếu giá trị là số
    if (!isNaN(numberValue)) {
      setAmount(numberValue);
      setPoints(numberValue * 10); // Giả sử tỷ lệ quy đổi là 1 USD = 10 points
    }
  };

  const handlePayment = async () => {
    const payment = {
      price: amount,
      paymentMethod: "PAYMENT_QR",
      exchangeRate_id: exchangeRate?.id,
    }
    const res = await callCreatePaymentLink(payment);
    if (res.status === 200) {
      router.push(res.data);
    }
  }

  return (
    <Modal
      title="Đăng ký VIP để trải nghiệm các nội dung tuyệt đỉnh"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      {/* Payment Method Selection */}
      <Form layout="vertical">
        <Form.Item label="Chọn phương thức thanh toán" required>
          <Radio.Group
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            value={selectedPaymentMethod}
            style={{ width: '100%' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  hoverable
                  style={{
                    backgroundColor: selectedPaymentMethod === 'card' ? '#faad14' : '#ffffff',
                  }}
                >
                  <CreditCardOutlined style={{ fontSize: '24px' }} />
                  <p>Thanh toán mã QR</p>
                </Card>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>

        {/* Points Information */}
        <Form.Item label="Số tiền muốn nạp">
          <Input
            value={amount}
            onChange={handleAmountChange}
            size="large"
            prefix={<DollarCircleOutlined />}
            style={{ fontWeight: 'bold' }}
          />
        </Form.Item>
        <Form.Item label="Số điểm bạn nhận được">
          <Input
            value={points}
            readOnly
            size="large"
            prefix={<CreditCardOutlined />}
            style={{ fontWeight: 'bold' }}
          />
        </Form.Item>

        {/* Agreement Checkbox */}
        <Form.Item>
          <Checkbox defaultChecked>
            Tôi đồng ý <a href="#">Thỏa thuận dịch vụ VIP</a>
          </Checkbox>
        </Form.Item>

        {/* Payment Button */}
        <Form.Item>
          <Button
            type="primary"
            size="large"
            style={{ width: '100%', backgroundColor: '#faad14', color: 'white' }}
            onClick={() => handlePayment()}
          >
            Xác nhận thanh toán
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
