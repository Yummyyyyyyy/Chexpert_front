import React from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Typography, 
  Space,
  Button
} from 'antd';
import { 
  HistoryOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

function AnalysisHistory() {
  const navigate = useNavigate();

  // Mock history data
  const historyData = [
    {
      key: '1',
      date: '2024-01-15',
      fileName: 'chest_ct_001.dcm',
      diagnosis: 'Pneumonia',
      confidence: 87.5,
      status: 'completed'
    },
    {
      key: '2',
      date: '2024-01-14',
      fileName: 'chest_ct_002.dcm', 
      diagnosis: 'Normal',
      confidence: 94.2,
      status: 'completed'
    },
    {
      key: '3',
      date: '2024-01-13',
      fileName: 'chest_ct_003.dcm',
      diagnosis: 'Pleural Effusion',
      confidence: 91.8,
      status: 'completed'
    },
    {
      key: '4',
      date: '2024-01-12',
      fileName: 'chest_ct_004.dcm',
      diagnosis: 'Normal',
      confidence: 96.1,
      status: 'completed'
    },
    {
      key: '5',
      date: '2024-01-11',
      fileName: 'chest_ct_005.dcm',
      diagnosis: 'Pneumothorax',
      confidence: 89.3,
      status: 'completed'
    }
  ];

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (diagnosis) => (
        <Tag color={diagnosis === 'Normal' ? 'green' : 'orange'}>
          {diagnosis}
        </Tag>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => (
        <Progress 
          percent={confidence} 
          size="small" 
          format={(percent) => `${percent}%`}
          strokeColor={confidence > 80 ? '#52c41a' : '#faad14'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'} icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <Header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderBottom: '4px solid #3b82f6',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')}
              style={{ fontSize: '16px', color: '#3b82f6' }}
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
            <Table 
              dataSource={historyData} 
              columns={historyColumns}
              pagination={{ pageSize: 10 }}
              size="middle"
              className="ant-table-striped"
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default AnalysisHistory;