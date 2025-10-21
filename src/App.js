// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Tag,
  Empty,
  Button,
  Space,
  message,
  Tabs,
} from 'antd';
import {
  FileImageOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

import { API_ENDPOINTS } from './config/api';

// Feature modules
import { UploadImage, HeatmapDisplay } from './features/upload';
import { KnowledgeGraph } from './features/third-party-api';
import AnalysisHistory from './AnalysisHistory';

// 新增：左右两列显示两个模型标签
import PathologyLabels from './features/upload/components/PathologyLabels';

import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

function Dashboard() {
  const navigate = useNavigate();

  // Upload / Analysis states
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('heatmap');

  const handleHistoryClick = () => navigate('/history');

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
          <Space align="center">
            <Button icon={<HistoryOutlined />} onClick={handleHistoryClick}>
              Analysis History
            </Button>
            <Tag color="blue" style={{ padding: '4px 16px', fontSize: '14px' }}>
              Healthcare Analytics
            </Tag>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top statistics */}
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
                  value="Open"
                  prefix={<HistoryOutlined />}
                  valueStyle={{ color: '#fff', fontSize: '16px' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main two columns */}
          <Row gutter={24}>
            {/* Left: upload & trigger */}
            <Col span={7}>
              <UploadImage
                onFileChange={(f) => setSelectedFile(f)}
                onAnalysisFinished={async (res) => {
                  // 这里的 res 来自我们在 upload/api.js 里合并后的 analyzeBoth 输出
                  if (!res || !res.success) {
                    setAnalysisResults(null);
                    setGeneratedReport(null);
                    message.error(res?.message || 'Analyze failed');
                    return;
                  }
                  setAnalysisResults(res);

                  // 自动生成报告（以 CheXpert 的分类为主）
                  try {
                    setReportLoading(true);
                    const heatmap  = res.heatmapUrl || res.heatmap_image_url || null;
                    const original = res.originalImageUrl || res.original_image_url || null;
                    const resp = await fetch(API_ENDPOINTS.REPORT, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        classifications: res.classifications || res.chexpert?.classifications || [],
                        heatmap_image_url: heatmap,
                        original_image_url: original
                      })
                    });
                    const data = await resp.json();
                    setGeneratedReport(data?.success && data.report_text ? data.report_text : null);
                  } catch (e) {
                    console.error('Report generation error:', e);
                    setGeneratedReport(null);
                  } finally {
                    setReportLoading(false);
                  }
                }}
              />
            </Col>

            {/* Right: Knowledge Graph + AI Analysis Results */}
            <Col span={17}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
                <Card title="Medical Knowledge Graph">
                  <KnowledgeGraph analysisResults={analysisResults} selectedFile={selectedFile} />
                  {!analysisResults && !selectedFile && (
                    <Empty description="Upload an image to view related medical knowledge" />
                  )}
                </Card>

                {/* AI Analysis Results Tabs */}
                {analysisResults ? (
                  <Card
                    title="AI Analysis Results"
                    extra={
                      <Tag color={activeResultTab === 'heatmap' ? 'blue' : 'green'}>
                        {activeResultTab === 'heatmap' ? 'Heatmap Mode' : 'Pathology Mode'}
                      </Tag>
                    }
                  >
                    <Tabs activeKey={activeResultTab} onChange={setActiveResultTab} size="large">
                      {/* 热力图 */}
                      <TabPane
                        tab={<span><ThunderboltOutlined />Heatmap Analysis</span>}
                        key="heatmap"
                      >
                        <HeatmapDisplay analysisResults={analysisResults} isAnalyzing={false} />
                      </TabPane>

                      {/* 病理标签：左右两列显示两个模型 */}
                      <TabPane
                        tab={<span><ExperimentOutlined />Pathology Labels</span>}
                        key="pathology"
                      >
                        <PathologyLabels analysisResults={analysisResults} />
                      </TabPane>
                    </Tabs>
                  </Card>
                ) : null}
              </div>
            </Col>
          </Row>

          {/* Report section */}
          {analysisResults && (
            <Row gutter={24} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Card title="Report">
                  <div style={{ whiteSpace: 'pre-wrap', opacity: reportLoading ? 0.6 : 1 }}>
                    {reportLoading ? 'Generating report...' : (generatedReport || 'No report')}
                  </div>
                </Card>
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
