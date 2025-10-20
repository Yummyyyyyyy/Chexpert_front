import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Tag
} from 'antd';
import {
  FileImageOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

// 导入新的模块化组件
import { UploadImage, HeatmapDisplay, uploadAndAnalyzeImage } from './features/upload';
import { ReportGenerator, ReportDisplay } from './features/llava-report';
import { KnowledgeGraph } from './features/third-party-api';
import AnalysisHistory from './AnalysisHistory';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);

  const handleFileUpload = async (info) => {
    const { file } = info;
    setSelectedFile(file);

    if (file.status !== 'uploading') {
      // 开始AI分析
      setIsAnalyzing(true);
      // 清空之前的报告
      setGeneratedReports([]);
      try {
        const results = await uploadAndAnalyzeImage(file);
        setAnalysisResults(results);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleReportGenerated = (report) => {
    // 添加新报告到列表中
    setGeneratedReports(prevReports => [...prevReports, report]);
  };

  const handleHistoryClick = () => {
    navigate('/history');
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
          {/* 顶部统计卡片 */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card
                className="stat-card"
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'default'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'white' }}>Total Scans</span>}
                  value={1234}
                  prefix={<FileImageOutlined />}
                  valueStyle={{ color: '#fff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                className="stat-card"
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'default'
                }}
              >
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
              <Card
                className="stat-card"
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'default'
                }}
              >
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

          {/* 主要内容区域 */}
          <Row gutter={24}>
            {/* 左侧列 - 文件上传 */}
            <Col span={7}>
              <UploadImage
                selectedFile={selectedFile}
                isAnalyzing={isAnalyzing}
                onFileChange={handleFileUpload}
              />
            </Col>

            {/* 右侧列 - AI分析结果和知识图谱 */}
            <Col span={17}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                {/* AI分析结果 */}
                <HeatmapDisplay
                  analysisResults={analysisResults}
                  isAnalyzing={isAnalyzing}
                />

                {/* 医学知识图谱 */}
                <KnowledgeGraph
                  analysisResults={analysisResults}
                  selectedFile={selectedFile}
                />
              </div>
            </Col>
          </Row>

          {/* LLaVA报告生成模块 */}
          {analysisResults && (
            <Row gutter={24} style={{ marginTop: '24px' }}>
              <Col span={12}>
                <ReportGenerator
                  analysisData={analysisResults}
                  onReportGenerated={handleReportGenerated}
                />
              </Col>
              <Col span={12}>
                <ReportDisplay reports={generatedReports} />
              </Col>
            </Row>
          )}
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
