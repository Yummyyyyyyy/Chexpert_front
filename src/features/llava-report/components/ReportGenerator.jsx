import React, { useState } from 'react';
import { Card, Space, Typography, Input, Row, Col, message } from 'antd';
import { FileTextOutlined, RobotOutlined } from '@ant-design/icons';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';
import { generateMedicalReport } from '../api';
import './ReportGenerator.css';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * AI报告生成器组件 - 基于LLaVA大模型
 * @param {Object} analysisData - 分析数据（用于生成报告）
 * @param {Function} onReportGenerated - 报告生成完成回调
 */
const ReportGenerator = ({ analysisData, onReportGenerated }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      // 调用真实的 LLaVA API
      message.info('正在调用 LLaVA 模型生成报告，请稍候...');
      const generatedReport = await generateMedicalReport(analysisData, customPrompt);

      message.success(`报告生成成功！耗时 ${generatedReport.processingTime?.toFixed(2)} 秒`);
      onReportGenerated(generatedReport);
    } catch (error) {
      console.error('报告生成失败:', error);
      message.error(`报告生成失败: ${error.message}`);

      // 如果 API 调用失败，可以选择显示一个错误报告
      // 或者什么都不做，让用户重试
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <RobotOutlined style={{ color: '#8b5cf6' }} />
          <span style={{ color: '#7c3aed' }}>AI Report Generator (LLaVA)</span>
        </Space>
      }
      className="report-generator-card"
    >
      <div className="report-generator-content">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="prompt-section">
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Custom Instructions (Optional):
              </Text>
              <TextArea
                rows={4}
                placeholder="Enter any specific requirements or focus areas for the medical report..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={isGenerating}
                className="custom-prompt-input"
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="model-info">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text type="secondary">
                  <strong>Model:</strong> LLaVA-Med (Medical Visual Language Model)
                </Text>
                <Text type="secondary">
                  <strong>Capabilities:</strong> Multi-modal medical image analysis, diagnostic reasoning, report generation
                </Text>
              </Space>
            </div>
          </Col>

          <Col span={24}>
            <Button
              variant="primary"
              gradient
              size="large"
              onClick={handleGenerateReport}
              disabled={!analysisData || isGenerating}
              style={{ width: '100%' }}
              icon={<FileTextOutlined />}
            >
              {isGenerating ? 'Generating Report...' : 'Generate Comprehensive Report'}
            </Button>
          </Col>

          <Col span={24}>
            <Loading
              visible={isGenerating}
              message="LLaVA AI is generating your comprehensive medical report..."
              progress={100}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ReportGenerator;
