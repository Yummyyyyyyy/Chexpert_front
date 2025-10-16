import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Space } from 'antd';
import { HistoryOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HistoryTable, fetchAnalysisHistory } from './features/history';
import Button from './components/Button';

const { Header, Content } = Layout;
const { Title } = Typography;

function AnalysisHistory() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      const data = await fetchAnalysisHistory();
      setHistoryData(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <Header
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderBottom: '4px solid #3b82f6',
          padding: '0 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              variant="secondary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
            <HistoryOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />
            <Title level={2} style={{ margin: 0, color: '#1e40af' }}>
              Analysis History
            </Title>
          </div>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Card
            title={
              <Space>
                <HistoryOutlined style={{ color: '#4f46e5' }} />
                <span style={{ color: '#3730a3' }}>Complete Analysis History</span>
              </Space>
            }
            style={{
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #c7d2fe'
            }}
          >
            <HistoryTable data={historyData} pageSize={10} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default AnalysisHistory;
