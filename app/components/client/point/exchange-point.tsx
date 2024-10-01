import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Progress, Divider, Badge, message } from 'antd';
import { CrownOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import { callCreatePaymentLink, callFetchSVipPackage, callPurchaseVip } from '@/app/config/api';
import { VipPackage } from '@/app/types/backend';
import { useRouter } from 'next/navigation';

interface Props {
  point: number;
  setVisible: (visible: boolean) => void;
  setSelectedBox: (box: string) => void;
  onExchangePoint: () => void;
}


const ExchangePoint = ({
  point,
  setVisible,
  setSelectedBox,
  onExchangePoint
} : Props) => {
  const [svip, setSvip] = useState<VipPackage[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchSVipPackage = async () => {
      const res = await callFetchSVipPackage();
      if(res.status === 200) {
        setSvip(res.data);
      }
    }
    fetchSVipPackage();
  }, []);

  const handleBoxClick = (box: string) => {
    setSelectedBox(box);
  };

  const handleOk = () => {
    setVisible(true);
  }

  const handlePurchaseVip = async(vipPackageId: number| undefined) => {
    const vip = {vipPackageId}
    const res = await callPurchaseVip(vip);
    if(res.status === 200) {
      onExchangePoint();
      message.success('Đổi thành công');
      setSelectedBox("task");
    } else {
      message.error('Đổi thất bại');
    }
  }


  return (
    <div style={{ padding: '20px', backgroundColor: '#1e1e28' }}>
      {/* Header Section */}
      <div style={{ padding: '20px', backgroundColor: '#1e1e28' }}>
      {/* Points Section Inside a Card */}
      <Card
        bordered={true}
        style={{
          backgroundColor: '#2b2b38',
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <div>
          {/* Icon and Points */}
            <CrownOutlined style={{ fontSize: 50, color: 'white' }} />
          <p style={{ fontSize: '24px', color: 'gold', marginTop: '10px' }}>{point} điểm</p>
        </div>

        {/* Buttons */}
        <Row justify="center" gutter={16} style={{ marginTop: '20px' }}>
          <Col>
            <Button 
              type="default" 
              size="large"
              onClick={() => handleBoxClick('task')}
            >
              Nhận thêm
            </Button>
          </Col>
          <Col>
            <Button 
              type="default" 
              size="large"
              onClick={() => handleOk()}
            >
              Nạp
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
      {/* Features Section inside a Card */}
      <Card bordered={true} style={{ background: '#2b2b38', color: 'white', marginBottom: '20px' }}>
        <Row gutter={16} justify="center" style={{ color: 'white', fontWeight: 'bold' }}>
          <Col span={4}>Thể loại</Col>
          <Col span={4}>Không quảng cáo</Col>
          <Col span={4}>Phát nền</Col>
          <Col span={4}>Độ nét cao</Col>
          <Col span={4}>Tăng tốc 30%</Col>
          <Col span={4}>Phát nhạc pop</Col>
        </Row>
        <Divider style={{ background: 'white' }} />
        <Row gutter={16} justify="center" style={{ color: 'white' }}>
          <Col span={4}>VIP</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>❌</Col>
          <Col span={4}>❌</Col>
        </Row>
        <Row gutter={16} justify="center" style={{ color: 'white', marginTop: '10px' }}>
          <Col span={4}>SVIP</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
          <Col span={4}>✔️</Col>
        </Row>
      </Card>

      {/* Cards Section */}
      <Row gutter={16} justify="center">
        {
          svip.map((item, index) => (
            <Col span={6} key={index}>
              <Card
                title={<div className="text-white"><CrownOutlined style={{ marginRight: 8, color: 'gold' }} /> {item.monthDuration} THÁNG {item.name}</div>}
                bordered={false}
                style={{
                  background: '#2b2b38',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                <p style={{ fontSize: '18px', color: 'gold' }}>{item.point}</p>
                <Button 
                  type="primary" 
                  block 
                  style={{ backgroundColor: '#722ed1' }}
                  onClick={() => handlePurchaseVip(item.id)}
                >Đổi</Button>
              </Card>
            </Col>
          ))
        }
        
      </Row>
    </div>
  );
};

export default ExchangePoint;
