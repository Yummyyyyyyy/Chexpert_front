import React from 'react';
import { Card, Typography, Progress, Tag, Space } from 'antd';
import { MedicineBoxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './HeatmapDisplay.css';

const { Title, Text, Paragraph } = Typography;

/**
 * 热力图和分析结果展示组件
 * @param {Object} analysisResults - 分析结果数据
 * @param {boolean} isAnalyzing - 是否正在分析
 */
const HeatmapDisplay = ({ analysisResults, isAnalyzing }) => {
  if (!analysisResults || isAnalyzing) {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <MedicineBoxOutlined style={{ color: '#059669' }} />
          <span style={{ color: '#047857' }}>AI Analysis Results</span>
        </Space>
      }
      className="heatmap-display-card"
    >
      <div className="heatmap-display-content">
        {/* 检测到的疾病 */}
        <div className="result-section">
          <div className="disease-header">
            <Title level={4} style={{ margin: 0 }}>
              Detected Condition:
              <Tag color="orange" className="disease-tag">
                {analysisResults.disease}
              </Tag>
            </Title>
          </div>
        </div>

        {/* 置信度分数 */}
        <div className="result-section">
          <Text strong>Confidence Score:</Text>
          <Progress
            percent={analysisResults.confidence}
            strokeColor={analysisResults.confidence > 80 ? '#52c41a' : '#faad14'}
            style={{ marginTop: '8px' }}
          />
        </div>

        {/* 解释说明 */}
        <div className="result-section">
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Explanation:
          </Text>
          <Paragraph className="explanation-box">
            {analysisResults.explanation}
          </Paragraph>
        </div>

        {/* 建议列表 */}
        <div className="result-section">
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Recommendations:
          </Text>
          <ul className="recommendations-list">
            {analysisResults.recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">
                <CheckCircleOutlined style={{ color: '#10b981', marginRight: '8px' }} />
                <Text>{rec}</Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapDisplay;
