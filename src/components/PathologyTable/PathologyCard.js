import React from 'react';
import { Tooltip, Progress } from 'antd';
import { 
  WarningOutlined, 
  ExclamationCircleOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import './PathologyCard.css';

const PathologyCard = ({ data, index }) => {
  const { label, label_cn, probability, severity, rank } = data;

  // 根据严重程度获取颜色配置
  const getSeverityConfig = (severity) => {
    const configs = {
      high: {
        color: '#ff4d4f',
        bgColor: '#fff1f0',
        borderColor: '#ff4d4f',
        icon: <WarningOutlined />,
        text: '高风险',
        progressStatus: 'exception'
      },
      medium: {
        color: '#fa8c16',
        bgColor: '#fff7e6',
        borderColor: '#fa8c16',
        icon: <ExclamationCircleOutlined />,
        text: '中风险',
        progressStatus: 'normal'
      },
      low: {
        color: '#faad14',
        bgColor: '#fffbe6',
        borderColor: '#faad14',
        icon: <InfoCircleOutlined />,
        text: '低风险',
        progressStatus: 'normal'
      },
      minimal: {
        color: '#52c41a',
        bgColor: '#f6ffed',
        borderColor: '#b7eb8f',
        icon: <CheckCircleOutlined />,
        text: '极低',
        progressStatus: 'success'
      }
    };
    return configs[severity] || configs.minimal;
  };

  const config = getSeverityConfig(severity);
  const percentValue = (probability * 100).toFixed(1);

  return (
    <div 
      className="pathology-card"
      style={{ 
        '--card-index': index,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor
      }}
    >
      {/* 排名标识 */}
      <div className="card-rank" style={{ backgroundColor: config.color }}>
        #{rank}
      </div>

      {/* 卡片头部 */}
      <div className="card-header">
        <div className="card-title-row">
          <Tooltip title={`Severity: ${config.text}`}>
            <span className="severity-icon" style={{ color: config.color }}>
              {config.icon}
            </span>
          </Tooltip>
          <div className="card-title">
            <h4>{label}</h4>
            <span className="label-cn">{label_cn}</span>
          </div>
        </div>
        
        <div className="probability-badge" style={{ backgroundColor: config.color }}>
          {percentValue}%
        </div>
      </div>

      {/* 进度条 */}
      <div className="card-progress">
        <Progress
          percent={parseFloat(percentValue)}
          strokeColor={{
            '0%': config.color,
            '100%': config.color
          }}
          trailColor="#f0f0f0"
          showInfo={false}
          status={config.progressStatus}
        />
      </div>

      {/* 严重程度标签 */}
      <div className="card-footer">
        <span className="severity-tag" style={{ 
          color: config.color,
          borderColor: config.color,
          backgroundColor: config.bgColor
        }}>
          {config.text}
        </span>
        
        {/* 置信度指示器 */}
        <div className="confidence-indicators">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`indicator-dot ${i < Math.round(probability * 5) ? 'active' : ''}`}
              style={{ backgroundColor: i < Math.round(probability * 5) ? config.color : '#d9d9d9' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathologyCard;