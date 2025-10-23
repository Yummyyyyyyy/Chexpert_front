// src/AnalysisHistory.js
import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HistoryTable } from './features/history';

const { Title, Text } = Typography;

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const goHome = () => navigate('/');

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space direction="vertical" size={0}>
            <Title level={4} style={{ margin: 0 }}>Complete Analysis History</Title>
            <Text type="secondary">View all uploaded files and diagnoses</Text>
          </Space>

          <Button type="default" icon={<ArrowLeftOutlined />} onClick={goHome}>
            Back to Home
          </Button>
        </div>

        <div style={{ marginTop: 16 }}>
          <HistoryTable />
        </div>
      </Card>
    </div>
  );
}
