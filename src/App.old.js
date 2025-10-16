import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Upload, 
  Row, 
  Col, 
  Typography, 
  Space,
  Alert,
  Statistic,
  Image,
  Progress,
  Tag
} from 'antd';
import { 
  UploadOutlined, 
  FileImageOutlined, 
  MedicineBoxOutlined,
  BarChartOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import AnalysisHistory from './AnalysisHistory';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function Dashboard() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock analysis results
  const mockAnalysisResults = {
    disease: 'Pneumonia',
    confidence: 87.5,
    explanation: 'AI analysis detected consolidation patterns in the right lower lobe consistent with bacterial pneumonia. The opacity shows air bronchograms and increased density compared to surrounding healthy lung tissue.',
    recommendations: [
      'Consider antibiotic treatment',
      'Monitor oxygen saturation',
      'Follow-up chest X-ray in 48-72 hours'
    ]
  };

  const handleFileUpload = (info) => {
    const { file } = info;
    setSelectedFile(file);
    
    if (file.status !== 'uploading') {
      // Simulate AI analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysisResults(mockAnalysisResults);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.dcm,.jpg,.jpeg,.png',
    beforeUpload: () => false, // Prevent automatic upload
    onChange: handleFileUpload,
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

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
            <MedicineBoxOutlined style={{ fontSize: '32px', color: '#3b82f6' }} />
            <Title level={2} style={{ margin: 0, color: '#1e40af' }}>
              Medical AI Dashboard
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Tag color="blue" style={{ padding: '4px 16px', fontSize: '14px' }}>
              Healthcare Analytics
            </Tag>
          </div>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top 4 Statistics Cards */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card className="stat-card" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                cursor: 'default'
              }}>
                <Statistic
                  title={<span style={{ color: 'white' }}>Total Scans</span>}
                  value={1234}
                  prefix={<FileImageOutlined />}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                cursor: 'default'
              }}>
                <Statistic
                  title={<span style={{ color: 'white' }}>Normal Cases</span>}
                  value={89.7}
                  precision={1}
                  suffix={<span style={{ color: 'white' }}>%</span>}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="stat-card" style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                cursor: 'default'
              }}>
                <Statistic
                  title={<span style={{ color: 'white' }}>Abnormal Cases</span>}
                  value={10.3}
                  precision={1}
                  suffix={<span style={{ color: 'white' }}>%</span>}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card 
                className="stat-card" 
                onClick={handleHistoryClick}
                style={{ 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Statistic
                  title={<span style={{ color: 'white' }}>Analysis History</span>}
                  value="View All"
                  prefix={<HistoryOutlined />}
                  valueStyle={{ color: '#fff', fontSize: '16px' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Two Column Layout */}
          <Row gutter={24}>
            {/* Left Column - File Upload (30% width) */}
            <Col span={7}>
              <Card 
                title={
                  <Space>
                    <UploadOutlined style={{ color: '#2563eb' }} />
                    <span style={{ color: '#1e40af' }}>CT Image Upload</span>
                  </Space>
                }
                style={{ 
                  height: '100%',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #bfdbfe'
                }}
              >
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Upload.Dragger {...uploadProps} className="upload-area">
                    <p className="ant-upload-drag-icon">
                      <FileImageOutlined style={{ fontSize: '48px', color: '#3b82f6' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '18px', color: '#374151' }}>
                      Click or drag CT image file to this area to upload
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
                      Support for DICOM (.dcm), JPEG, PNG formats
                    </p>
                  </Upload.Dragger>

                  {selectedFile && (
                    <Alert
                      message={`File Selected: ${selectedFile.name}`}
                      type="info"
                      showIcon
                      style={{ marginTop: '16px' }}
                    />
                  )}

                  {isAnalyzing && (
                    <div style={{ marginTop: '16px' }}>
                      <Progress percent={100} status="active" />
                      <Text style={{ color: '#2563eb' }}>AI is analyzing your CT scan...</Text>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            {/* Right Column - AI Results and Knowledge Graph (70% width) */}
            <Col span={17}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                
                {/* AI Analysis Results */}
                {analysisResults && !isAnalyzing && (
                  <Card 
                    title={
                      <Space>
                        <MedicineBoxOutlined style={{ color: '#059669' }} />
                        <span style={{ color: '#047857' }}>AI Analysis Results</span>
                      </Space>
                    }
                    style={{
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #bbf7d0'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Title level={4} style={{ margin: 0 }}>
                          Detected Condition: 
                          <Tag color="orange" style={{ marginLeft: '8px', fontSize: '16px', padding: '4px 12px' }}>
                            {analysisResults.disease}
                          </Tag>
                        </Title>
                      </div>

                      <div>
                        <Text strong>Confidence Score:</Text>
                        <Progress 
                          percent={analysisResults.confidence} 
                          strokeColor={analysisResults.confidence > 80 ? '#52c41a' : '#faad14'}
                          style={{ marginTop: '8px' }}
                        />
                      </div>

                      <div>
                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Explanation:</Text>
                        <Paragraph style={{
                          backgroundColor: '#eff6ff',
                          padding: '16px',
                          borderRadius: '8px',
                          borderLeft: '4px solid #60a5fa'
                        }}>
                          {analysisResults.explanation}
                        </Paragraph>
                      </div>

                      <div>
                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Recommendations:</Text>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {analysisResults.recommendations.map((rec, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                              <CheckCircleOutlined style={{ color: '#10b981', marginRight: '8px' }} />
                              <Text>{rec}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Medical Knowledge Graph */}
                <Card 
                  title={
                    <Space>
                      <BarChartOutlined style={{ color: '#9333ea' }} />
                      <span style={{ color: '#7c3aed' }}>Medical Knowledge Graph</span>
                    </Space>
                  }
                  style={{
                    flex: 1,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e9d5ff'
                  }}
                >
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    {selectedFile && analysisResults ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <Text style={{ fontSize: '16px', color: '#7c3aed', marginBottom: '16px' }}>
                          Knowledge Graph for: {analysisResults.disease}
                        </Text>
                        <Image
                          src="/image/IMG_1674.jpg"
                          alt="Medical Knowledge Graph"
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            border: '2px solid #c4b5fd'
                          }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                          preview={{
                            mask: <div style={{ color: 'white' }}>Click to view full graph</div>
                          }}
                        />
                        <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                          Interactive medical knowledge relationships and disease pathways
                        </Text>
                      </div>
                    ) : (
                      <div style={{
                        height: '300px',
                        background: 'linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%)',
                        borderRadius: '8px',
                        border: '2px dashed #c4b5fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <BarChartOutlined style={{ fontSize: '72px', color: '#8b5cf6', marginBottom: '16px' }} />
                          <Title level={4} style={{ color: '#7c3aed' }}>
                            Knowledge Graph Visualization
                          </Title>
                          <Text style={{ color: '#6b7280' }}>
                            Upload a CT scan to view related medical knowledge graph
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<AnalysisHistory />} />
      </Routes>
    </Router>
  );
}

export default App;